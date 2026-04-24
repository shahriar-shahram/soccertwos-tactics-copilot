import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import { getMatchById } from "../lib/api";

type MatchEvent = {
  step: number;
  type: string;
  team: string;
  tag?: string;
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
  duration_steps?: number;
  policy_id?: string;
  elo_estimate?: number;
  teams?: {
    blue: string;
    orange: string;
  };
  events: MatchEvent[];
};

function badgeColor(type: string) {
  if (type === "goal") return "bg-emerald-500/15 text-emerald-300";
  if (type === "mistake") return "bg-rose-500/15 text-rose-300";
  if (type === "recovery") return "bg-sky-500/15 text-sky-300";
  if (type === "chance") return "bg-amber-500/15 text-amber-300";
  return "bg-slate-700 text-slate-300";
}

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

  const goalCount = useMemo(() => {
    return match?.events.filter((e) => e.type === "goal").length ?? 0;
  }, [match]);

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
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                  RL Replay Analysis
                </div>
                <h1 className="text-4xl font-bold tracking-tight">{match.title}</h1>
                <p className="mt-3 text-lg text-slate-300">
                  Score: Blue {match.score.blue} - Orange {match.score.orange}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                Backed by <span className="font-semibold text-white">Azure AI Search</span> retrieval
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <div className="text-sm text-slate-400">Policy</div>
                <div className="mt-2 text-xl font-semibold">{match.policy_id ?? "N/A"}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <div className="text-sm text-slate-400">Duration</div>
                <div className="mt-2 text-xl font-semibold">{match.duration_steps ?? "N/A"}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <div className="text-sm text-slate-400">Estimated ELO</div>
                <div className="mt-2 text-xl font-semibold">{match.elo_estimate ?? "N/A"}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <div className="text-sm text-slate-400">Events</div>
                <div className="mt-2 text-xl font-semibold">{match.events.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <div className="text-sm text-slate-400">Goals</div>
                <div className="mt-2 text-xl font-semibold">{goalCount}</div>
              </div>
            </div>

            <div className="mb-6 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
              <h2 className="mb-3 text-2xl font-semibold">Match Summary</h2>
              <p className="max-w-4xl text-slate-300">{match.summary}</p>
            </div>

            <div className="mb-6 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Replay Canvas</h2>
                <div className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  Visual playback placeholder
                </div>
              </div>
              <div className="flex h-[380px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950 text-slate-500">
                Replay visualization placeholder
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Event Timeline</h2>
                <div className="text-sm text-slate-400">
                  Ordered by match step
                </div>
              </div>

              <div className="space-y-4">
                {match.events.map((event, index) => (
                  <div key={index} className="rounded-2xl border border-white/5 bg-slate-800/80 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200">
                        Step {event.step}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                        {event.team}
                      </span>
                      {event.tag ? (
                        <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-400">
                          {event.tag}
                        </span>
                      ) : null}
                    </div>

                    <div className="text-slate-200">{event.text}</div>
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
