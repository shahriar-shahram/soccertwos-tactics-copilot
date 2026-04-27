def generate_grounded_answer(question: str, retrieved_chunks: list[dict], match_summary: str) -> str:
    context = " ".join(
        chunk.get("content", "") for chunk in retrieved_chunks if chunk.get("content")
    )

    if not context:
        return "I could not find enough grounded local context to answer that question."

    preview = context[:700]

    return (
        "Based on the locally retrieved SoccerTwos context, the relevant evidence suggests the answer is tied to "
        "the match behavior described in the retrieved chunks. "
        f"Match summary: {match_summary} "
        f"Relevant local context: {preview}"
    )
