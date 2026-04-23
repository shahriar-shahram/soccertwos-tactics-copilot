export async function getMatches() {
  const res = await fetch("http://127.0.0.1:8000/matches");
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function getMatchById(matchId: string) {
  const res = await fetch(`http://127.0.0.1:8000/matches/${matchId}`);
  if (!res.ok) throw new Error("Failed to fetch match");
  return res.json();
}

export async function getRuns() {
  const res = await fetch("http://127.0.0.1:8000/runs");
  if (!res.ok) throw new Error("Failed to fetch runs");
  return res.json();
}

export async function getRunById(runId: string) {
  const res = await fetch(`http://127.0.0.1:8000/runs/${runId}`);
  if (!res.ok) throw new Error("Failed to fetch run");
  return res.json();
}
