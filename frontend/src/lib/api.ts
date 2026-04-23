export async function getMatches() {
  const res = await fetch("http://127.0.0.1:8000/matches");
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}
