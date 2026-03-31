"""Phase 2: ingestion and FAISS index build for LangChain RAG."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI
from sentence_transformers import SentenceTransformer

# Phase 2 chunking configuration (required range: 500-800, overlap: 100)
CHUNK_SIZE = 700
CHUNK_OVERLAP = 100
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
GENERATION_MODEL_NAME = "gemini-2.5-flash"
DEFAULT_TOP_K = 5

_EMBEDDING_FUNCTION: SentenceTransformerEmbeddingFunction | None = None
_VECTOR_STORE_CACHE: dict[str, FAISS] = {}
_LLM_CACHE: dict[tuple[str, str], ChatGoogleGenerativeAI] = {}

PROMPT_TEMPLATE = ChatPromptTemplate.from_template(
    """
You are a highly precise AI legal research assistant specializing in domestic violence matters before the High Court.

<rules>
1. NO LEGAL ADVICE: You are an AI, not an advocate. You must strictly synthesize information and include a standard legal disclaimer.
2. STRICT GROUNDING: You must rely EXCLUSIVELY on the provided `<retrieved_context>`. Do not incorporate outside knowledge, and absolutely do not hallucinate or invent case laws.
3. HANDLING MISSING INFO: If the retrieved context does not contain relevant legal provisions or similar cases, leave those arrays empty ([]). 
4. OUTPUT FORMAT: Return ONLY valid JSON. Do not include markdown formatting (like ```json), and do not include any conversational filler before or after the JSON block.
</rules>

<retrieved_context>
{retrieved_context}
</retrieved_context>

<user_case>
{user_case}
</user_case>

<instructions>
Analyze the `<user_case>` against the `<retrieved_context>`. 
Generate a JSON response strictly adhering to the following structure:
{{
    "analysis": "Briefly outline your internal reasoning here before filling the specific fields below. Explain why the context matches the case.",
    "summary": "Concise, objective summary of the user's situation.",
    "legalProvisions": [
        {{
            "section": "...", 
            "act": "...", 
            "relevance": "Explain specifically how this applies to the user case based on the context"
        }}
    ],
    "similarCases": [
        {{
            "caseTitle": "...",
            "year": 2020,
            "caseNumber": "...",
            "similarityScore": "Integer from 0 to 100 (percentage match)",
            "keyParallels": "...",
            "decision": "..."
        }}
    ],
    "disclaimer": "Standard disclaimer stating this is AI-generated research, not legal advice."
}}
</instructions>
    """.strip()
)

@dataclass(frozen=True)
class IngestConfig:
    root_dir: Path
    index_dir: Path


@dataclass(frozen=True)
class QueryConfig:
    index_dir: Path
    gemini_api_key: str
    generation_model: str = GENERATION_MODEL_NAME
    top_k: int = DEFAULT_TOP_K


# Custom embedding class using SentenceTransformers for high-quality semantic vector generation
class SentenceTransformerEmbeddingFunction(Embeddings):
    def __init__(self, model_name: str = EMBEDDING_MODEL_NAME):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        vectors = self.model.encode(texts, normalize_embeddings=True)
        return vectors.tolist()

    def embed_query(self, text: str) -> list[float]:
        vector = self.model.encode(text, normalize_embeddings=True)
        return vector.tolist()


def build_and_persist_faiss_index(config: IngestConfig) -> tuple[int, int]:
    cases = load_case_records(config.root_dir)
    documents = build_documents(cases)
    chunks = chunk_documents(documents)

    embeddings = get_embedding_function()
    vector_store = FAISS.from_documents(chunks, embeddings)

    index_path = config.index_dir / case_category
    index_path.mkdir(parents=True, exist_ok=True)

    vector_store.save_local(str(index_path))

    return len(cases), len(chunks)


def load_case_records(root_dir: Path) -> list[dict]:
    merged = {}

    for item in load_imported_cases(root_dir, case_category):
        case_number = str(item.get("caseNumber", "")).strip()

        # fallback to title if case number missing
        if not case_number:
            case_number = str(item.get("caseTitle", "")).strip()

        if not case_number:
            continue

        merged[case_number] = item

    # property cases should NOT use DV filter
    if case_category.lower() == "property":
        return list(merged.values())

    # existing mixed cases keep DV filter
    filtered = [item for item in merged.values() if is_target_case(item)]
    return filtered


def load_imported_cases(root_dir: Path) -> list[dict]:
    imported_file = root_dir / "server" / "data" / "importedCases.json"
    if not imported_file.exists():
        return []

    raw = imported_file.read_text(encoding="utf-8").strip()
    if not raw:
        return []

    parsed = json.loads(raw)
    return parsed if isinstance(parsed, list) else []





# Heuristic filter to identify relevant Domestic Violence cases from the Allahabad High Court
def is_target_case(item: dict) -> bool:
    blob = " ".join(
        [
            str(item.get("caseTitle", "")),
            str(item.get("facts", "")),
            str(item.get("legalReasoning", "")),
            str(item.get("decision", "")),
        ]
    ).lower()

    has_dv_signal = (
        "domestic violence" in blob
        or "dv act" in blob
        or "section 498a" in blob
        or "protection of women" in blob
    )
    has_court_signal = "allahabad" in blob or "u.p." in blob or "uttar pradesh" in blob
    return has_dv_signal and has_court_signal


# Converts raw case dictionaries into LangChain Document objects with metadata
def build_documents(cases: Iterable[dict]) -> list[Document]:
    docs: list[Document] = []
    for item in cases:
        metadata = {
            "caseTitle": item.get("caseTitle", ""),
            "year": item.get("year", ""),
            "caseNumber": item.get("caseNumber", ""),
            "decision": item.get("decision", ""),
            "relevantSections": item.get("relevantSections", []),
        }

        content = (
            f"Case Title: {item.get('caseTitle', '')}\n"
            f"Year: {item.get('year', '')}\n"
            f"Case Number: {item.get('caseNumber', '')}\n"
            f"Facts: {item.get('facts', '')}\n"
            f"Legal Reasoning: {item.get('legalReasoning', '')}\n"
            f"Decision: {item.get('decision', '')}\n"
            f"Relevant Sections: {', '.join(item.get('relevantSections', []))}"
        )

        docs.append(Document(page_content=content, metadata=metadata))

    return docs


# Splits large documents into smaller semantic chunks for optimized vector retrieval
def chunk_documents(documents: list[Document]) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return splitter.split_documents(documents)


# Main pipeline function: performs retrieval, prompt augmentation, and LLM generation
def analyze_case_text(case_text: str, config: QueryConfig) -> dict:
    if not case_text or not case_text.strip():
        raise ValueError("case text is required")

    vector_store = load_faiss_index(config.index_dir)
    retriever = vector_store.as_retriever(search_kwargs={"k": config.top_k})
    retrieved_docs = retriever.invoke(case_text)
    context = build_retrieved_context(retrieved_docs)

    llm = get_llm(config)

    try:
        response = llm.invoke(
            PROMPT_TEMPLATE.format_messages(
                user_case=case_text.strip(),
                retrieved_context=context,
            )
        )
        parsed = parse_model_json(str(response.content))
        return normalize_analysis_output(parsed)
    except Exception as error:
        if is_quota_or_busy_error(error):
            return build_quota_fallback_analysis(case_text, retrieved_docs)
        raise


# Loads or retrieves the FAISS index from the local file system
def load_faiss_index(index_dir: Path) -> FAISS:
    if not index_dir.exists():
        raise FileNotFoundError(
            f"FAISS index not found at {index_dir}. Run ingest.py first."
        )

    cache_key = str(index_dir.resolve())
    cached = _VECTOR_STORE_CACHE.get(cache_key)
    if cached is not None:
        return cached

    embeddings = get_embedding_function()
    loaded = FAISS.load_local(
        cache_key,
        embeddings,
        allow_dangerous_deserialization=True,
    )
    _VECTOR_STORE_CACHE[cache_key] = loaded
    return loaded


# Singleton-style accessor for the global embedding model instance
def get_embedding_function() -> SentenceTransformerEmbeddingFunction:
    global _EMBEDDING_FUNCTION
    if _EMBEDDING_FUNCTION is None:
        _EMBEDDING_FUNCTION = SentenceTransformerEmbeddingFunction(EMBEDDING_MODEL_NAME)
    return _EMBEDDING_FUNCTION


# Cached accessor for the Google Gemini LLM instance
def get_llm(config: QueryConfig) -> ChatGoogleGenerativeAI:
    cache_key = (config.generation_model, config.gemini_api_key)
    cached = _LLM_CACHE.get(cache_key)
    if cached is not None:
        return cached

    llm = ChatGoogleGenerativeAI(
        model=config.generation_model,
        temperature=0,
        google_api_key=config.gemini_api_key,
    )
    _LLM_CACHE[cache_key] = llm
    return llm


# Aggregates retrieved document contents and metadata into a formatted context string
def build_retrieved_context(docs: list[Document]) -> str:
    if not docs:
        return "No retrieved cases available."

    blocks = []
    for idx, doc in enumerate(docs, start=1):
        metadata = doc.metadata or {}
        blocks.append(
            "\n".join(
                [
                    f"Case {idx}",
                    f"Case Title: {metadata.get('caseTitle', '')}",
                    f"Year: {metadata.get('year', '')}",
                    f"Case Number: {metadata.get('caseNumber', '')}",
                    f"Decision: {metadata.get('decision', '')}",
                    f"Relevant Sections: {', '.join(metadata.get('relevantSections', []))}",
                    f"Chunk: {doc.page_content}",
                ]
            )
        )

    return "\n\n---\n\n".join(blocks)


# Extracts a structured JSON object from a raw LLM string response
def parse_model_json(raw_text: str) -> dict:
    cleaned = raw_text.strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(cleaned[start : end + 1])
        raise ValueError("LLM returned invalid JSON")


# Ensures the LLM-generated payload contains all required fields and correct formats
def normalize_analysis_output(payload: dict) -> dict:
    if not isinstance(payload, dict):
        raise ValueError("LLM response must be a JSON object")

    normalized = dict(payload)

    raw_provisions = normalized.get("legalProvisions", [])
    if isinstance(raw_provisions, list):
        normalized["legalProvisions"] = raw_provisions

    similar_cases = normalized.get("similarCases", [])
    if isinstance(similar_cases, list):
        for item in similar_cases:
            if not isinstance(item, dict):
                continue
            item["similarityScore"] = normalize_similarity_score(item.get("similarityScore"))

    return normalized


# Normalizes various similarity score outputs (0.0-1.0 or 0-10) into a 0-100 percentage
def normalize_similarity_score(value) -> int:
    try:
        score = float(value)
    except (TypeError, ValueError):
        return 0

    # Handle 0-1 scale (probability-like)
    if score <= 1:
        score *= 100
    # Handle 1-10 scale (LLM may output despite prompt)
    elif score <= 10:
        score *= 10

    score = max(0, min(100, score))
    return int(round(score))


# Determines if a specific error is related to API rate limiting or service unavailability
def is_quota_or_busy_error(error: Exception) -> bool:
    message = str(error).lower()
    return (
        "quota" in message
        or "resource_exhausted" in message
        or "429" in message
        or "too many requests" in message
        or "service unavailable" in message
        or "rate limit" in message
    )


# Generates a simplified analysis using only retrieved context when the LLM is unavailable
def build_quota_fallback_analysis(case_text: str, docs: list[Document]) -> dict:
    top_docs = docs[:3]
    legal_provisions = collect_legal_provisions(top_docs)

    similar_cases = []
    for index, doc in enumerate(top_docs, start=1):
        metadata = doc.metadata or {}
        similarity_score = max(50, 95 - (index - 1) * 12)
        snippet = normalize_whitespace(doc.page_content)
        if len(snippet) > 220:
            snippet = f"{snippet[:217]}..."

        similar_cases.append(
            {
                "caseTitle": metadata.get("caseTitle", "Relevant Retrieved Case"),
                "year": int(metadata.get("year") or 0),
                "caseNumber": metadata.get("caseNumber", "N/A"),
                "similarityScore": similarity_score,
                "keyParallels": (
                    "This result was retrieved from similar High Court domestic violence "
                    f"materials. Context snapshot: {snippet}"
                ),
                "decision": metadata.get("decision", "Decision details not available."),
            }
        )

    summary = build_fallback_summary(case_text, top_docs)
    return {
        "summary": summary,
        "legalProvisions": legal_provisions,
        "similarCases": similar_cases,
        "disclaimer": (
            "This analysis is generated by Nyaay Sahayak for informational and educational "
            "purposes only and does not constitute legal advice. Due to temporary AI quota "
            "or service limits, this response was produced using retrieval-based fallback logic. "
            "Please consult a qualified advocate for legal guidance specific to your situation."
        ),
    }


# Creates a best-effort summary based on user input and retrieved precedent titles
def build_fallback_summary(case_text: str, docs: list[Document]) -> str:
    normalized_input = normalize_whitespace(case_text)
    sentence_parts = [s.strip() for s in normalized_input.split(".") if s.strip()]
    short_user_summary = ". ".join(sentence_parts[:3]).strip()
    if short_user_summary and not short_user_summary.endswith("."):
        short_user_summary += "."

    if not short_user_summary:
        short_user_summary = (
            "The submitted text describes a domestic violence dispute involving requests for legal protection."
        )

    if not docs:
        return (
            f"{short_user_summary} Similar-case retrieval is currently limited, so this is a high-level "
            "fallback summary pending full model generation."
        )

    case_titles = [
        (doc.metadata or {}).get("caseTitle", "retrieved precedent") for doc in docs[:3]
    ]
    titles_text = "; ".join(case_titles)
    return (
        f"{short_user_summary} Based on retrieved High Court precedents ({titles_text}), "
        "the facts may engage protections, residence rights, maintenance, compensation, or related "
        "reliefs depending on evidence and procedural posture."
    )


# Extracts unique legal provisions from metadata of retrieved document chunks
def collect_legal_provisions(docs: list[Document]) -> list[dict]:
    provisions: list[dict] = []
    seen: set[str] = set()

    for doc in docs:
        metadata = doc.metadata or {}
        sections = metadata.get("relevantSections", [])
        if not isinstance(sections, list):
            continue

        for raw_section in sections:
            key = normalize_whitespace(str(raw_section))
            if not key or key in seen:
                continue
            seen.add(key)

            parts = [p.strip() for p in key.split(",") if p.strip()]
            section = parts[0] if parts else key
            act = parts[1] if len(parts) > 1 else "Relevant statute"
            provisions.append(
                {
                    "section": section,
                    "act": act,
                    "relevance": (
                        "This provision appears in closely matched domestic violence precedents "
                        "and may be relevant depending on proved facts."
                    ),
                }
            )

            if len(provisions) >= 6:
                return provisions

    if not provisions:
        provisions.append(
            {
                "section": "Section 3",
                "act": "Protection of Women from Domestic Violence Act, 2005",
                "relevance": (
                    "This section defines domestic violence and is commonly used as a baseline "
                    "for factual assessment in DV proceedings."
                ),
            }
        )

    return provisions


# Standardizes string whitespace for cleaner display and comparison
def normalize_whitespace(value: str) -> str:
    return " ".join(str(value or "").split())


# Internal utility to read secrets from a server-side .env file if available
def _read_env_file_value(env_file: Path, key: str) -> str:
    if not env_file.exists():
        return ""

    prefix = f"{key}="
    for line in env_file.read_text(encoding="utf-8").splitlines():
        raw = line.strip()
        if not raw or raw.startswith("#"):
            continue
        if raw.startswith(prefix):
            return raw[len(prefix) :].strip().strip('"').strip("'")
    return ""


def build_default_query_config() -> QueryConfig:
    service_dir = Path(__file__).resolve().parent
    root_dir = service_dir.parent
    server_env_file = root_dir / "server" / ".env"

    api_key = os.getenv("GEMINI_API_KEY", "").strip() or _read_env_file_value(
        server_env_file, "GEMINI_API_KEY"
    )

    if not api_key:
        raise ValueError("GEMINI_API_KEY is required")

    generation_model = os.getenv("GENERATION_MODEL", "").strip() or _read_env_file_value(
        server_env_file, "GENERATION_MODEL"
    )

    if not generation_model:
        generation_model = GENERATION_MODEL_NAME

    return QueryConfig(
        index_dir=service_dir / "faiss_index" / case_category,
        gemini_api_key=api_key,
        generation_model=generation_model,
        top_k=DEFAULT_TOP_K,
    )


