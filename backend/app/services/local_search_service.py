import json
import re
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[2]
RAG_CHUNKS_PATH = BACKEND_ROOT / "deploy_seed" / "rag_chunks" / "rag_chunks.json"


def _tokenize(text: str) -> set[str]:
    return set(re.findall(r"[a-zA-Z0-9_]+", text.lower()))


def _load_chunks() -> list[dict]:
    if not RAG_CHUNKS_PATH.exists():
        return []

    with open(RAG_CHUNKS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, list):
        return data

    return data.get("chunks", [])


def retrieve_chunks(query: str, top_k: int = 5) -> list[dict]:
    chunks = _load_chunks()
    query_tokens = _tokenize(query)

    scored = []
    for chunk in chunks:
        content = chunk.get("content", "")
        content_tokens = _tokenize(content)
        score = len(query_tokens & content_tokens)

        if score > 0:
            scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [
        {
            "id": chunk.get("id"),
            "source_type": chunk.get("source_type", "local_rag"),
            "source_name": chunk.get("source_name", "rag_chunks.json"),
            "content": chunk.get("content", ""),
        }
        for _, chunk in scored[:top_k]
    ]
