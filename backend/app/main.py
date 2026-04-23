from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.match_loader import load_all_matches, load_match_by_id
from app.services.run_loader import load_all_runs, load_run_by_id
from app.services.copilot_service import answer_question

app = FastAPI(title="SoccerTwos Tactics Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
