import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.match_loader import load_all_matches, load_match_by_id
from app.services.run_loader import load_all_runs, load_run_by_id
from app.services.copilot_service import answer_question

BACKEND_ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_ROOT.parent

load_dotenv(BACKEND_ROOT / ".env")

cors_origins_raw = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
cors_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

app = FastAPI(title="SoccerTwos Tactics Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    match_id: str
    question: str


@app.get("/")
def root():
    return {"message": "SoccerTwos Tactics Copilot API"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/debug/files")
def debug_files():
    matches_dir = PROJECT_ROOT / "data" / "processed" / "matches"
    playbook_path = PROJECT_ROOT / "docs" / "playbooks" / "basic_tactics.md"

    return {
        "cwd": str(Path.cwd()),
        "backend_root": str(BACKEND_ROOT),
        "project_root": str(PROJECT_ROOT),
        "matches_dir": str(matches_dir),
        "matches_dir_exists": matches_dir.exists(),
        "matches_files": sorted([p.name for p in matches_dir.glob("*.json")]) if matches_dir.exists() else [],
        "playbook_path": str(playbook_path),
        "playbook_exists": playbook_path.exists(),
    }


@app.get("/matches")
def list_matches():
    matches = load_all_matches()
    return [
        {
            "id": match["id"],
            "title": match["title"],
            "score": f'{match["score"]["blue"]}-{match["score"]["orange"]}',
            "summary": match["summary"],
        }
        for match in matches
    ]


@app.get("/matches/{match_id}")
def get_match(match_id: str):
    match = load_match_by_id(match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return match


@app.get("/runs")
def list_runs():
    return load_all_runs()


@app.get("/runs/{run_id}")
def get_run(run_id: str):
    run = load_run_by_id(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@app.post("/chat")
def chat(request: ChatRequest):
    return answer_question(request.match_id, request.question)
