import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { getMatches } from "../lib/api";

type Match = {
  id: string;
  title: string;
  score: string;
  summary: string;
};

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches()
      .then(setMatches)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-4xl font-bold">Azure SoccerTwos Tactics Copilot</h1>
        <p className="mb-8 max-w-3xl text-slate-300">
          A product project combining Deep RL, replay analytics, and RAG-based tactical explanations.
        </p>

        <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Recent Matches</h2>
          {loading ? (
            <p className="text-slate-400">Loading…</p>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <Link
                  key={match.id}
                  to={`/replay?id=${match.id}`}
                  className="block rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
                >
                  <div className="text-lg font-medium">{match.title}</div>
                  <div className="text-sm text-slate-400">Score: {match.score}</div>
                  <div className="mt-2 text-slate-300">{match.summary}</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
