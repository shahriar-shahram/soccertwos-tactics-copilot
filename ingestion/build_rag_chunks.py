import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MATCHES_DIR = PROJECT_ROOT / "data" / "processed" / "matches"
PLAYBOOKS_DIR = PROJECT_ROOT / "docs" / "playbooks"
OUTPUT_DIR = PROJECT_ROOT / "data" / "rag_chunks"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

chunks = []

for playbook_file in PLAYBOOKS_DIR.glob("*.md"):
    text = playbook_file.read_text(encoding="utf-8")
    chunks.append(
        {
            "id": f"playbook::{playbook_file.stem}",
            "source_type": "playbook",
            "source_name": playbook_file.name,
            "content": text,
        }
    )

for match_file in MATCHES_DIR.glob("*.json"):
    match = json.loads(match_file.read_text(encoding="utf-8"))

    chunks.append(
        {
            "id": f"match_summary::{match['id']}",
            "source_type": "match_summary",
            "source_name": match_file.name,
            "content": match.get("summary", ""),
        }
    )

    for idx, event in enumerate(match.get("events", [])):
        chunks.append(
            {
                "id": f"match_event::{match['id']}::{idx}",
                "source_type": "match_event",
                "source_name": match_file.name,
                "content": f"Step {event['step']} | Team {event['team']} | Type {event['type']} | Tag {event.get('tag', 'none')} | {event['text']}",
            }
        )

output_file = OUTPUT_DIR / "rag_chunks.json"
output_file.write_text(json.dumps(chunks, indent=2), encoding="utf-8")

print(f"Wrote {len(chunks)} chunks to {output_file}")
