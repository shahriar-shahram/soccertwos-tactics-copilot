import json
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[3]
MATCHES_DIR = PROJECT_ROOT / "data" / "processed" / "matches"


def load_all_matches() -> list[dict[str, Any]]:
    matches = []
    if not MATCHES_DIR.exists():
        return matches

    for file_path in sorted(MATCHES_DIR.glob("*.json")):
        with open(file_path, "r", encoding="utf-8") as f:
            matches.append(json.load(f))
    return matches


def load_match_by_id(match_id: str) -> dict[str, Any] | None:
    file_path = MATCHES_DIR / f"{match_id}.json"
    if not file_path.exists():
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)
