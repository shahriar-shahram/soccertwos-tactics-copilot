from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[3]
RUNS_DIR = PROJECT_ROOT / "training" / "results"


def load_all_runs() -> list[dict[str, Any]]:
    runs = []
    if not RUNS_DIR.exists():
        return runs

    for run_dir in sorted(RUNS_DIR.iterdir()):
        if not run_dir.is_dir():
            continue

        top_level_onnx = run_dir / "SoccerTwos.onnx"
        config_file = run_dir / "configuration.yaml"
        readme_file = run_dir / "README.md"
        timers_file = run_dir / "timers.json"
        status_file = run_dir / "training_status.json"
        checkpoint_file = run_dir / "SoccerTwos" / "checkpoint.pt"

        snapshots = sorted((run_dir / "SoccerTwos").glob("*.onnx")) if (run_dir / "SoccerTwos").exists() else []

        latest_snapshot = snapshots[-1].name if snapshots else None

        runs.append(
            {
                "run_id": run_dir.name,
                "has_top_level_onnx": top_level_onnx.exists(),
                "has_checkpoint": checkpoint_file.exists(),
                "has_config": config_file.exists(),
                "has_readme": readme_file.exists(),
                "has_timers": timers_file.exists(),
                "has_status": status_file.exists(),
                "latest_snapshot": latest_snapshot,
                "artifact_count": len(list(run_dir.rglob("*"))),
            }
        )

    return runs


def load_run_by_id(run_id: str) -> dict[str, Any] | None:
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists() or not run_dir.is_dir():
        return None

    files = sorted(
        str(path.relative_to(PROJECT_ROOT))
        for path in run_dir.rglob("*")
        if path.is_file()
    )

    return {
        "run_id": run_id,
        "files": files,
    }
