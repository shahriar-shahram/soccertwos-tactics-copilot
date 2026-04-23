import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import { getMatchById } from "../lib/api";

type MatchEvent = {
  step: number;
  type: string;
  team: string;
  text: string;
};

type MatchDetail = {
  id: string;
  title: string;
  score: {
    blue: number;
    orange: number;
  };
  summary: string;
  events: MatchEvent[];
};

export default function ReplayPage() {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get("id") || "match_001";

  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatchById(matchId)
      .then(setMatch)
      .finally(() => setLoading(false));
  }, [matchId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <p className="text-slate-400">Loading replay...</p>
        ) : !match ? (
          <p className="text-red-400">Match not found.</p>
        ) : (
          <>
            <h1 className="mb-2 text-3xl font-bold">{match.title}</h1>
            <p className="mb-6 text-slate-300">
              Score: Blue {match.score.blue} - Orange {match.score.orange}
            </p>

            <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-3 text-2xl font-semibold">Summary</h2>
              <p className="text-slate-300">{match.summary}</p>
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-3 text-2xl font-semibold">Replay Canvas</h2>
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950 text-slate-500">
                Replay visualization placeholder
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-4 text-2xl font-semibold">Event Timeline</h2>
              <div className="space-y-3">
                {match.events.map((event, index) => (
                  <div key={index} className="rounded-xl bg-slate-800 p-4">
                    <div className="text-sm text-slate-400">
                      Step {event.step} · {event.team.toUpperCase()} · {event.type}
                    </div>
                    <div className="mt-1 text-slate-200">{event.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
