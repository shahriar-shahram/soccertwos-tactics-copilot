import os
from pathlib import Path

from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_CHAT_DEPLOYMENT = os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT", "soccer-chat")


def get_client() -> AzureOpenAI:
    if not AZURE_OPENAI_ENDPOINT or not AZURE_OPENAI_API_KEY:
        raise RuntimeError("Missing Azure OpenAI configuration in backend/.env")

    return AzureOpenAI(
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        api_key=AZURE_OPENAI_API_KEY,
        api_version="2024-12-01-preview",
    )


def generate_grounded_answer(question: str, retrieved_chunks: list[dict], match_summary: str) -> str:
    client = get_client()

    context_blocks = []
    for idx, chunk in enumerate(retrieved_chunks, start=1):
        context_blocks.append(
            f"[Source {idx}] ({chunk.get('source_type')}/{chunk.get('source_name')}): {chunk.get('content')}"
        )

    context_text = "\n\n".join(context_blocks)

    system_prompt = (
        "You are a tactical soccer analysis copilot for a SoccerTwos reinforcement learning project. "
        "Answer only using the provided grounded context. "
        "Be concise, clear, and analytical. "
        "Do not invent facts that are not supported by the context."
    )

    user_prompt = f"""
Question:
{question}

Match summary:
{match_summary}

Grounded context:
{context_text}

Instructions:
- Answer in 3 to 6 sentences.
- Base the answer only on the grounded context above.
- If the context is insufficient, say so briefly.
""".strip()

    response = client.chat.completions.create(
        model=AZURE_OPENAI_CHAT_DEPLOYMENT,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_completion_tokens=300,
        temperature=0.2,
        top_p=1.0,
    )

    return response.choices[0].message.content.strip()
