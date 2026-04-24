import os
from pathlib import Path

from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT")
SEARCH_KEY = os.getenv("AZURE_SEARCH_API_KEY")
INDEX_NAME = os.getenv("AZURE_SEARCH_INDEX_NAME", "soccer-rag-index")


def get_search_client() -> SearchClient:
    if not SEARCH_ENDPOINT or not SEARCH_KEY:
        raise RuntimeError("Missing Azure Search configuration in backend/.env")

    return SearchClient(
        endpoint=SEARCH_ENDPOINT,
        index_name=INDEX_NAME,
        credential=AzureKeyCredential(SEARCH_KEY),
    )


def retrieve_chunks(query: str, top_k: int = 5) -> list[dict]:
    client = get_search_client()
    results = client.search(search_text=query, top=top_k)

    chunks = []
    for item in results:
        chunks.append(
            {
                "id": item.get("id"),
                "source_type": item.get("source_type"),
                "source_name": item.get("source_name"),
                "content": item.get("content"),
            }
        )
    return chunks
