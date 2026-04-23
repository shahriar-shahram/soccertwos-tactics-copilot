import json
import os
from pathlib import Path

from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SearchableField,
    SimpleField,
)
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / "backend" / ".env")

SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT")
SEARCH_KEY = os.getenv("AZURE_SEARCH_API_KEY")
INDEX_NAME = os.getenv("AZURE_SEARCH_INDEX_NAME", "soccer-rag-index")

CHUNKS_PATH = PROJECT_ROOT / "data" / "rag_chunks" / "rag_chunks.json"

if not SEARCH_ENDPOINT or not SEARCH_KEY:
    raise RuntimeError("Missing Azure Search endpoint or key in backend/.env")

credential = AzureKeyCredential(SEARCH_KEY)
index_client = SearchIndexClient(endpoint=SEARCH_ENDPOINT, credential=credential)

fields = [
    SimpleField(name="id", type="Edm.String", key=True),
    SearchableField(name="source_type", type="Edm.String"),
    SearchableField(name="source_name", type="Edm.String"),
    SearchableField(name="content", type="Edm.String"),
]

index = SearchIndex(name=INDEX_NAME, fields=fields)
index_client.create_or_update_index(index)
print(f"Index ready: {INDEX_NAME}")

with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
    docs = json.load(f)

def sanitize_key(value: str) -> str:
    return (
        value.replace("::", "__")
        .replace(":", "_")
        .replace("/", "_")
        .replace(".", "_")
        .replace(" ", "_")
    )

sanitized_docs = []
for doc in docs:
    sanitized = dict(doc)
    sanitized["id"] = sanitize_key(str(doc["id"]))
    sanitized_docs.append(sanitized)

search_client = SearchClient(
    endpoint=SEARCH_ENDPOINT,
    index_name=INDEX_NAME,
    credential=credential,
)

result = search_client.upload_documents(documents=sanitized_docs)
print("Upload result:", result)
