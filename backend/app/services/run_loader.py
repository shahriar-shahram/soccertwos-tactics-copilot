from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = BACKEND_ROOT.parent
RUNS_DIR = PROJECT_ROOT / "training" / "results"


def load_all_runs() -> list[dict]:
    if not RUNS_DIR.exists():
        return []

    runs = []
    for run_dir in sorted(RUNS_DIR.iterdir()):
        if not run_dir.is_dir():
            continue

        files = [str(p.relative_to(run_dir)) for p in run_dir.rglob("*") if p.is_file()]

        latest_snapshot = None
        snapshot_candidates = sorted(
            [p.name for p in run_dir.rglob("*.onnx") if "SoccerTwos-" in p.name]
        )
        if snapshot_candidates:
            latest_snapshot = snapshot_candidates[-1]

        runs.append(
            {
                "run_id": run_dir.name,
                "has_top_level_onnx": (run_dir / "SoccerTwos.onnx").exists(),
                "has_checkpoint": any(p.name == "checkpoint.pt" for p in run_dir.rglob("checkpoint.pt")),
                "has_config": (run_dir / "configuration.yaml").exists(),
                "has_readme": (run_dir / "README.md").exists(),
                "has_timers": (run_dir / "timers.json").exists() or (run_dir / "run_logs" / "timers.json").exists(),
                "has_status": (run_dir / "training_status.json").exists() or (run_dir / "run_logs" / "training_status.json").exists(),
                "latest_snapshot": latest_snapshot,
                "artifact_count": len(files),
            }
        )

    return runs


def load_run_by_id(run_id: str) -> dict | None:
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists() or not run_dir.is_dir():
        return None

    files = [str(p.relative_to(run_dir)) for p in run_dir.rglob("*") if p.is_file()]

    return {
        "run_id": run_id,
        "files": sorted(files),
    }
