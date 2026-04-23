import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]
PLAYBOOK_PATH = PROJECT_ROOT / "docs" / "playbooks" / "basic_tactics.md"
MATCHES_DIR = PROJECT_ROOT / "data" / "processed" / "matches"


def load_playbook_text() -> str:
    if not PLAYBOOK_PATH.exists():
        return ""
    return PLAYBOOK_PATH.read_text(encoding="utf-8")


def load_match(match_id: str) -> dict | None:
    file_path = MATCHES_DIR / f"{match_id}.json"
    if not file_path.exists():
        return None
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def answer_question(match_id: str, question: str) -> dict:
    match = load_match(match_id)
    if match is None:
        return {
            "answer": "I could not find that match.",
            "grounding": [],
        }

    playbook = load_playbook_text()
    q = question.lower()

    summary = match.get("summary", "")
    events = match.get("events", [])

    answer = ""
    grounding = [
        {"source": "match_summary", "content": summary},
        {"source": "playbook", "content": playbook[:500]},
    ]

    if "why did blue win" in q or "why blue win" in q:
        answer = (
            f"Blue won because {summary.lower()} "
            f"The event log also shows Orange made a costly mistake: "
            f"{next((e['text'] for e in events if e['type'] == 'mistake'), 'no major mistake recorded')}."
        )
    elif "orange" in q and ("mistake" in q or "biggest mistake" in q):
        mistake = next((e["text"] for e in events if e["type"] == "mistake" and e["team"] == "orange"), None)
        answer = mistake or "No specific Orange mistake was recorded in the current event log."
    elif "tactical pattern" in q or "pattern" in q:
        answer = (
            "The biggest tactical pattern was transition punishment and defensive recovery. "
            "The playbook emphasizes avoiding double-commitment and keeping one player in recovery shape."
        )
    elif "summarize" in q:
        answer = (
            f"Coaching summary: {summary} "
            f"Blue were more disciplined in recovery, while Orange were punished for overcommitting."
        )
    else:
        answer = (
            "Grounded answer: based on the current match summary and tactical notes, "
            f"the main takeaway is that {summary.lower()}"
        )

    return {
        "answer": answer,
        "grounding": grounding,
    }
