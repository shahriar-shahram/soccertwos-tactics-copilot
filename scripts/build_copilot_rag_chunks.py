import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]

RAG_PATH = ROOT / "backend" / "deploy_seed" / "rag_chunks" / "rag_chunks.json"
MATCHUPS_PATH = ROOT / "backend" / "deploy_seed" / "processed" / "evaluations" / "matchup_results.json"
POLICIES_PATH = ROOT / "backend" / "deploy_seed" / "processed" / "policies" / "policy_summary.json"
SIDE_BALANCED_PATH = ROOT / "evaluation" / "results" / "summaries" / "side_balanced_policy_comparison.json"


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def upsert_chunk(chunks: list[dict[str, Any]], new_chunk: dict[str, Any]) -> None:
    chunks[:] = [chunk for chunk in chunks if chunk.get("id") != new_chunk["id"]]
    chunks.append(new_chunk)


def main() -> None:
    chunks = load_json(RAG_PATH, [])
    if isinstance(chunks, dict):
        chunks = chunks.get("chunks", [])

    policies = load_json(POLICIES_PATH, [])
    matchups = load_json(MATCHUPS_PATH, [])
    side_balanced = load_json(SIDE_BALANCED_PATH, {})

    for policy in policies:
        content = (
            f"Policy {policy['name']} ({policy['policy_id']}): {policy['summary']} "
            f"Style: {policy['style']}. Best for: {policy['best_for']}. "
            f"Strengths: {', '.join(policy.get('strengths', []))}. "
            f"Weaknesses: {', '.join(policy.get('weaknesses', []))}."
        )
        upsert_chunk(
            chunks,
            {
                "id": f"policy::{policy['policy_id']}",
                "source_type": "policy_profile",
                "source_name": "policy_summary.json",
                "content": content,
            },
        )

    for matchup in matchups:
        content = (
            f"Matchup {matchup['title']} ({matchup['matchup_id']}): "
            f"{matchup['summary']} "
            f"Total matches: {matchup['num_matches']}. "
            f"{matchup['blue_policy']} wins: {matchup['blue_wins']} "
            f"with win rate {matchup.get('blue_win_rate', 'N/A')}. "
            f"{matchup['orange_policy']} wins: {matchup['orange_wins']} "
            f"with win rate {matchup.get('orange_win_rate', 'N/A')}. "
            f"Draws: {matchup['draws']}. "
            f"Average goals: {matchup['blue_policy']} {matchup['avg_blue_score']}, "
            f"{matchup['orange_policy']} {matchup['avg_orange_score']}. "
            f"Average goal difference: {matchup['goal_difference']}. "
            f"Average steps per match: {matchup.get('avg_steps_per_match', 'N/A')}. "
            f"Timeout matches: {matchup.get('timeout_matches', 'N/A')}. "
            f"Tempo: {matchup['tempo']}. Risk level: {matchup['risk_level']}."
        )
        upsert_chunk(
            chunks,
            {
                "id": f"evaluation::{matchup['matchup_id']}",
                "source_type": "evaluation_summary",
                "source_name": "matchup_results.json",
                "content": content,
            },
        )

    ranking = side_balanced.get("ranking", [])
    if ranking:
        ranking_text = " ".join(
            f"Rank {item['rank']}: {item['policy_id']} - {item['summary']}"
            for item in ranking
        )
        upsert_chunk(
            chunks,
            {
                "id": "evaluation::policy_ranking",
                "source_type": "evaluation_ranking",
                "source_name": "side_balanced_policy_comparison.json",
                "content": (
                    "Side-balanced policy ranking: "
                    f"{ranking_text} "
                    f"Important limitation: {side_balanced.get('important_note', '')}"
                ),
            },
        )

    protocol = side_balanced.get("evaluation_protocol", {})
    if protocol:
        upsert_chunk(
            chunks,
            {
                "id": "methodology::side_balanced_evaluation",
                "source_type": "methodology",
                "source_name": "side_balanced_policy_comparison.json",
                "content": (
                    "Side-balanced evaluation means each policy pair is evaluated in both Blue and Purple "
                    "assignments to reduce side-assignment bias. "
                    f"Protocol: {protocol.get('description', '')} "
                    f"Goals to win: {protocol.get('goals_to_win')}. "
                    f"Maximum environment steps: {protocol.get('max_environment_steps')}. "
                    f"Matches per direction: {protocol.get('matches_per_direction')}. "
                    f"Total matches per pair: {protocol.get('total_matches_per_pair')}."
                ),
            },
        )

    RAG_PATH.parent.mkdir(parents=True, exist_ok=True)
    RAG_PATH.write_text(json.dumps(chunks, indent=2), encoding="utf-8")

    print(f"Wrote {len(chunks)} total RAG chunks to {RAG_PATH}")
    print("Added/updated policy profiles, matchup summaries, policy ranking, and side-balanced methodology.")


if __name__ == "__main__":
    main()
