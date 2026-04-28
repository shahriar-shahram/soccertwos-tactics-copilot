import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]

SOURCE = ROOT / "evaluation" / "results" / "summaries" / "side_balanced_policy_comparison.json"
OUT = ROOT / "backend" / "deploy_seed" / "processed" / "evaluations" / "matchup_results.json"


POLICY_SHORT = {
    "soccertwos_poca_aggressive_s1": "aggressive",
    "soccertwos_poca_baseline_s1": "baseline",
    "soccertwos_poca_safe_s1": "safe",
}

POLICY_LABEL = {
    "aggressive": "Aggressive",
    "baseline": "Baseline",
    "safe": "Safe",
}

STYLE = {
    "aggressive": {
        "risk_level": "High",
        "tempo": "Fast",
    },
    "baseline": {
        "risk_level": "Medium",
        "tempo": "Balanced",
    },
    "safe": {
        "risk_level": "Low",
        "tempo": "Controlled",
    },
}


def short_policy(policy_id: str) -> str:
    return POLICY_SHORT.get(policy_id, policy_id)


def round_float(value: Any, digits: int = 2) -> float:
    return round(float(value), digits)


def make_summary(winner: str, loser: str, win_rate: float, goal_diff: float, conclusion: str) -> str:
    winner_label = POLICY_LABEL.get(winner, winner.title())
    loser_label = POLICY_LABEL.get(loser, loser.title())

    return (
        f"{winner_label} outperformed {loser_label} in the side-balanced evaluation. "
        f"It won {round(win_rate * 100)}% of matches with an average goal difference of "
        f"{goal_diff:+.2f}. {conclusion}"
    )


def convert_pair(row: dict[str, Any]) -> dict[str, Any]:
    a = short_policy(row["policy_a"])
    b = short_policy(row["policy_b"])

    a_wins = int(row["policy_a_wins"])
    b_wins = int(row["policy_b_wins"])
    total = int(row["total_matches"])

    a_win_rate = float(row["policy_a_win_rate"])
    b_win_rate = float(row["policy_b_win_rate"])

    if a_wins >= b_wins:
        winner = a
        loser = b
        winner_rate = a_win_rate
        signed_goal_diff = float(row["avg_goal_diff_policy_a_minus_b"])
    else:
        winner = b
        loser = a
        winner_rate = b_win_rate
        signed_goal_diff = -float(row["avg_goal_diff_policy_a_minus_b"])

    title = f"{POLICY_LABEL[a]} vs {POLICY_LABEL[b]}"

    if a == "aggressive" or b == "aggressive":
        risk = "High"
        tempo = "Fast"
    elif a == "safe" or b == "safe":
        risk = "Low"
        tempo = "Controlled"
    else:
        risk = "Reference"
        tempo = "Neutral"

    return {
        "matchup_id": f"{a}_vs_{b}",
        "title": title,
        "blue_policy": a,
        "orange_policy": b,
        "num_matches": total,
        "blue_wins": a_wins,
        "orange_wins": b_wins,
        "draws": int(row["draws"]),
        "blue_win_rate": round_float(a_win_rate),
        "orange_win_rate": round_float(b_win_rate),
        "draw_rate": round_float(row["draw_rate"]),
        "avg_blue_score": round_float(row["avg_goals_policy_a"]),
        "avg_orange_score": round_float(row["avg_goals_policy_b"]),
        "goal_difference": round_float(row["avg_goal_diff_policy_a_minus_b"]),
        "avg_steps_per_match": round_float(row["avg_steps_per_match"]),
        "timeout_matches": int(row["timeout_matches"]),
        "winner_policy": winner,
        "risk_level": risk,
        "tempo": tempo,
        "summary": make_summary(
            winner=winner,
            loser=loser,
            win_rate=winner_rate,
            goal_diff=signed_goal_diff,
            conclusion=row["conclusion"],
        ),
        "copilot_prompt": (
            f"Compare {POLICY_LABEL[a]} and {POLICY_LABEL[b]} using the side-balanced evaluation. "
            f"Explain who performed better and what the result suggests about policy behavior."
        ),
    }


def baseline_reference() -> dict[str, Any]:
    summary_path = ROOT / "evaluation" / "results" / "summaries" / "baseline_s1_vs_baseline_s1.json"

    if summary_path.exists():
        row = json.loads(summary_path.read_text())
        return {
            "matchup_id": "baseline_vs_baseline",
            "title": "Baseline vs Baseline",
            "blue_policy": "baseline",
            "orange_policy": "baseline",
            "num_matches": int(row.get("matches_played", 50)),
            "blue_wins": int(row.get("blue_wins", 0)),
            "orange_wins": int(row.get("orange_wins", 0)),
            "draws": int(row.get("draws", 0)),
            "blue_win_rate": round_float(row.get("blue_win_rate", 0)),
            "orange_win_rate": round_float(row.get("orange_win_rate", 0)),
            "draw_rate": round_float(row.get("draw_rate", 0)),
            "avg_blue_score": round_float(row.get("avg_goals_blue", 0)),
            "avg_orange_score": round_float(row.get("avg_goals_orange", 0)),
            "goal_difference": round_float(row.get("avg_goal_diff_blue_minus_orange", 0)),
            "avg_steps_per_match": round_float(row.get("avg_steps_per_match", 0)),
            "timeout_matches": int(row.get("timeout_matches", 0)),
            "winner_policy": "reference",
            "risk_level": "Reference",
            "tempo": "Neutral",
            "summary": (
                "Baseline vs Baseline is the reference matchup. It is useful for understanding "
                "the benchmark policy without comparing against a different tactical style."
            ),
            "copilot_prompt": "Explain the baseline versus baseline reference matchup and what it shows about the benchmark policy.",
        }

    return {
        "matchup_id": "baseline_vs_baseline",
        "title": "Baseline vs Baseline",
        "blue_policy": "baseline",
        "orange_policy": "baseline",
        "num_matches": 0,
        "blue_wins": 0,
        "orange_wins": 0,
        "draws": 0,
        "blue_win_rate": 0,
        "orange_win_rate": 0,
        "draw_rate": 0,
        "avg_blue_score": 0,
        "avg_orange_score": 0,
        "goal_difference": 0,
        "avg_steps_per_match": 0,
        "timeout_matches": 0,
        "winner_policy": "reference",
        "risk_level": "Reference",
        "tempo": "Neutral",
        "summary": "Reference matchup for understanding baseline behavior.",
        "copilot_prompt": "Explain the baseline replay and summarize the main tactical behavior.",
    }


def main() -> None:
    data = json.loads(SOURCE.read_text())
    rows = data["side_balanced_results"]

    converted = [convert_pair(row) for row in rows]
    converted.append(baseline_reference())

    order = {
        "aggressive_vs_baseline": 1,
        "baseline_vs_safe": 2,
        "aggressive_vs_safe": 3,
        "baseline_vs_baseline": 4,
    }
    converted = sorted(converted, key=lambda item: order.get(item["matchup_id"], 99))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(converted, indent=2), encoding="utf-8")

    print(f"Wrote {len(converted)} matchup records to {OUT}")
    for item in converted:
        print(
            f"- {item['title']}: {item['blue_wins']}-{item['orange_wins']}-"
            f"{item['draws']} over {item['num_matches']} matches"
        )


if __name__ == "__main__":
    main()
