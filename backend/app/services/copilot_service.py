from pathlib import Path

from app.services.azure_openai_service import generate_grounded_answer
from app.services.azure_search_service import retrieve_chunks
from app.services.match_loader import load_match_by_id

BACKEND_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = BACKEND_ROOT.parent


def answer_question(match_id: str, question: str) -> dict:
    match = load_match_by_id(match_id)
    if match is None:
        return {
            "answer": "I could not find that match.",
            "grounding": [],
        }

    summary = match.get("summary", "")
    retrieved = retrieve_chunks(question, top_k=5)

    if not retrieved:
        return {
            "answer": "I could not find grounded context for that question.",
            "grounding": [],
        }

    answer = generate_grounded_answer(
        question=question,
        retrieved_chunks=retrieved,
        match_summary=summary,
    )

    grounding = [
        {
            "source": chunk["source_type"],
            "content": chunk["content"],
        }
        for chunk in retrieved
    ]

    return {
        "answer": answer,
        "grounding": grounding,
        "retrieved_context_preview": " ".join(
            chunk["content"] for chunk in retrieved if chunk.get("content")
        )[:500],
    }
