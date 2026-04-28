import json
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parents[2]
POLICY_FILE = BASE_DIR / "deploy_seed" / "processed" / "policies" / "policy_summary.json"


def load_policies() -> list[dict[str, Any]]:
    if not POLICY_FILE.exists():
        return []

    with POLICY_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def load_policy(policy_id: str) -> dict[str, Any] | None:
    for policy in load_policies():
        if policy.get("policy_id") == policy_id:
            return policy
    return None
