const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function getMatches() {
  const res = await fetch(`${API_BASE_URL}/matches`);
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function getMatchById(matchId: string) {
  const res = await fetch(`${API_BASE_URL}/matches/${matchId}`);
  if (!res.ok) throw new Error("Failed to fetch match");
  return res.json();
}

export async function getRuns() {
  const res = await fetch(`${API_BASE_URL}/runs`);
  if (!res.ok) throw new Error("Failed to fetch runs");
  return res.json();
}

export async function getRunById(runId: string) {
  const res = await fetch(`${API_BASE_URL}/runs/${runId}`);
  if (!res.ok) throw new Error("Failed to fetch run");
  return res.json();
}

export async function askCopilot(matchId: string, question: string) {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      match_id: matchId,
      question,
    }),
  });

  if (!res.ok) throw new Error("Failed to get copilot answer");
  return res.json();
}
