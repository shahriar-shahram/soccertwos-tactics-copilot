from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SoccerTwos Tactics Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/matches")
def list_matches():
    return [
        {
            "id": "match_001",
            "title": "Blue vs Orange Demo Match",
            "score": "3-2",
            "summary": "Blue side won after stronger late defensive rotations."
        }
    ]

@app.get("/matches/{match_id}")
def get_match(match_id: str):
    return {
        "id": match_id,
        "title": "Blue vs Orange Demo Match",
        "score": "3-2",
        "summary": "Blue side won after stronger late defensive rotations.",
        "events": [
            {"step": 120, "type": "goal", "team": "blue", "text": "Blue scored from a quick counter."},
            {"step": 240, "type": "goal", "team": "orange", "text": "Orange equalized after midfield pressure."}
        ]
    }
