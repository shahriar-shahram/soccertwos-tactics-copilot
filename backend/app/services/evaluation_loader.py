import json
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parents[2]
MATCHUP_FILE = BASE_DIR / "deploy_seed" / "processed" / "evaluations" / "matchup_results.json"


def load_matchups() -> list[dict[str, Any]]:
    if not MATCHUP_FILE.exists():
        return []

    with MATCHUP_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def load_matchup(matchup_id: str) -> dict[str, Any] | None:
    for matchup in load_matchups():
        if matchup.get("matchup_id") == matchup_id:
            return matchup
    return None
