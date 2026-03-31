"""Phase 2 one-time ingestion script for Nyaay Sahayak FAISS index."""

from pathlib import Path

try:
    from rag_service.rag_pipeline import IngestConfig, build_and_persist_faiss_index
except ModuleNotFoundError:
    from rag_pipeline import IngestConfig, build_and_persist_faiss_index


# Orchestrates the loading of raw case data and its conversion into a FAISS vector index
def run_ingestion() -> None:
    service_dir = Path(__file__).resolve().parent
    root_dir = service_dir.parent
    index_dir = service_dir / "faiss_index"

    config = IngestConfig(root_dir=root_dir, index_dir=index_dir)
    case_count, chunk_count = build_and_persist_faiss_index(config)

    print(f"Ingestion complete. Cases indexed: {case_count}")
    print(f"Total chunks stored in FAISS: {chunk_count}")
    print(f"FAISS index path: {index_dir}")


if __name__ == "__main__":
    run_ingestion()
