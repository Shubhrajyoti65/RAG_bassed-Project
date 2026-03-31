"""Phase 2 one-time ingestion script for Nyaay Sahayak FAISS index."""

from pathlib import Path

try:
    from rag_service.rag_pipeline import IngestConfig, build_and_persist_faiss_index
except ModuleNotFoundError:
    from rag_pipeline import IngestConfig, build_and_persist_faiss_index


# Orchestrates the loading of raw case data and its conversion into a FAISS vector index
def run_ingestion() -> None:
    print("INGESTION STARTED")

    service_dir = Path(__file__).resolve().parent
    root_dir = service_dir.parent
    index_dir = service_dir / "faiss_index"

    config = IngestConfig(root_dir=root_dir, index_dir=index_dir)

    # Build general mixed cases index
    general_cases, general_chunks = build_and_persist_faiss_index(
        config,
        "general"
    )

    # Build property land dispute index
    property_cases, property_chunks = build_and_persist_faiss_index(
        config,
        "property"
    )

    print("\nGENERAL INDEX")
    print(f"Cases indexed: {general_cases}")
    print(f"Chunks: {general_chunks}")

    print("\nPROPERTY INDEX")
    print(f"Cases indexed: {property_cases}")
    print(f"Chunks: {property_chunks}")

    print(f"\nFAISS index path: {index_dir}")


if __name__ == "__main__":
    run_ingestion()

