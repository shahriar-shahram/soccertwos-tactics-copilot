import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock,
  Crosshair,
  Flag,
  Goal,
  PlayCircle,
  Shield,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
import TopNav from "../components/TopNav";
import { getMatchById } from "../lib/api";
import type { MatchDetail } from "../lib/api";

function eventIcon(type: string) {
  if (type === "goal") return Goal;
  if (type === "mistake") return Zap;
  if (type === "recovery") return ShieldCheck;
  if (type === "chance") return Crosshair;
  return Flag;
}

function eventTone(type: string) {
  if (type === "goal") return "border-blue-200 bg-blue-50 text-blue-700";
  if (type === "mistake") return "border-rose-200 bg-rose-50 text-rose-700";
  if (type === "recovery") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (type === "chance") return "border-violet-200 bg-violet-50 text-violet-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function teamLabel(team: string) {
  const lower = team.toLowerCase();
  if (lower.includes("orange") || lower.includes("purple")) return "Purple";
  if (lower.includes("blue")) return "Blue";
  return team;
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

  const stats = useMemo(() => {
    const events = match?.events ?? [];
    return {
      goals: events.filter((e) => e.type === "goal").length,
      chances: events.filter((e) => e.type === "chance").length,
      mistakes: events.filter((e) => e.type === "mistake").length,
      recoveries: events.filter((e) => e.type === "recovery").length,
    };
  }, [match]);

  const winner = useMemo(() => {
    if (!match) return "Unknown";
    if (match.score.blue > match.score.orange) return "Blue";
    if (match.score.orange > match.score.blue) return "Purple";
    return "Draw";
  }, [match]);

  const keyEvents = match?.events.slice(0, 8) ?? [];

  return (
    <div className="min-h-screen bg-[#f8faf7] text-slate-950">
      <TopNav />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
            Loading replay...
          </div>
        ) : !match ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">
            Match not found.
          </div>
        ) : (
          <>
            <section className="overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white shadow-sm">
              <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
                <div>
                  <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Baseline Replay Room
                  </div>

                  <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                    Inspect one representative baseline match.
                  </h1>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                    This page keeps the replay focused: one baseline match, one scoreline,
                    one event timeline, and a clean summary of what happened.
                  </p>

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                      Match summary
                    </div>
                    <p className="mt-3 leading-8 text-slate-700">{match.summary}</p>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
                  <div className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
                    Final score
                  </div>

                  <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="rounded-3xl bg-blue-500/15 p-5">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-blue-300" />
                        <div className="font-bold text-blue-100">Blue</div>
                      </div>
                      <div className="mt-4 text-6xl font-black">{match.score.blue}</div>
                    </div>

                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-slate-300">
                      VS
                    </div>

                    <div className="rounded-3xl bg-violet-500/15 p-5">
                      <div className="flex items-center gap-3">
                        <Crosshair className="h-6 w-6 text-violet-300" />
                        <div className="font-bold text-violet-100">Purple</div>
                      </div>
                      <div className="mt-4 text-6xl font-black">{match.score.orange}</div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl bg-white/10 p-4">
                    <div className="text-sm text-slate-300">Result</div>
                    <div className="mt-1 flex items-center gap-2 text-2xl font-black">
                      <Trophy className="h-6 w-6 text-emerald-300" />
                      {winner === "Draw" ? "Draw" : `${winner} won`}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-4 md:grid-cols-5">
              {[
                { label: "Policy", value: match.policy_id ?? "baseline", Icon: Shield },
                { label: "Duration", value: match.duration_steps ?? "N/A", Icon: Clock },
                { label: "ELO", value: match.elo_estimate ?? "N/A", Icon: Trophy },
                { label: "Events", value: match.events.length, Icon: Flag },
                { label: "Goals", value: stats.goals, Icon: Goal },
              ].map((item) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <Icon className="mb-4 h-5 w-5 text-emerald-600" />
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 break-words text-xl font-black text-slate-950">
                      {String(item.value)}
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                      Replay viewer
                    </div>
                    <h2 className="mt-1 text-2xl font-black">Match video</h2>
                  </div>

                  <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                    Baseline
                  </div>
                </div>

                {match.video_path ? (
                  <video
                    controls
                    className="aspect-video w-full rounded-[1.5rem] border border-slate-200 bg-slate-950 object-cover"
                  >
                    <source src={match.video_path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex aspect-video w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 text-center">
                    <PlayCircle className="mb-4 h-14 w-14 text-slate-300" />
                    <div className="text-lg font-black text-slate-700">No replay video attached yet</div>
                    <div className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                      The page is ready for a baseline match recording. Once the video path is included
                      in the match JSON, it will appear here automatically.
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  {[
                    { label: "Goals", value: stats.goals, Icon: Goal },
                    { label: "Chances", value: stats.chances, Icon: Crosshair },
                    { label: "Mistakes", value: stats.mistakes, Icon: Zap },
                    { label: "Recoveries", value: stats.recoveries, Icon: ShieldCheck },
                  ].map((item) => {
                    const Icon = item.Icon;
                    return (
                      <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                        <Icon className="mb-3 h-5 w-5 text-slate-500" />
                        <div className="text-sm font-bold text-slate-500">{item.label}</div>
                        <div className="text-3xl font-black">{item.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                    Event timeline
                  </div>
                  <h2 className="mt-1 text-2xl font-black">Key moments</h2>
                </div>

                <div className="space-y-3">
                  {keyEvents.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                      No events found for this match.
                    </div>
                  ) : (
                    keyEvents.map((event) => {
                      const Icon = eventIcon(event.type);
                      return (
                        <div
                          key={`${event.step}-${event.text}`}
                          className={`rounded-2xl border p-4 ${eventTone(event.type)}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/70">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.15em]">
                                <span>Step {event.step}</span>
                                <span>·</span>
                                <span>{teamLabel(event.team)}</span>
                                {event.tag ? (
                                  <>
                                    <span>·</span>
                                    <span>{event.tag}</span>
                                  </>
                                ) : null}
                              </div>
                              <p className="mt-2 text-sm leading-6">{event.text}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-[2rem] bg-gradient-to-br from-emerald-700 to-blue-700 p-8 text-white shadow-xl">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-100">
                    Copilot-ready context
                  </div>
                  <h2 className="mt-3 text-3xl font-black">Ask why this match unfolded this way.</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Why did the winning team create better chances?",
                    "Where did the baseline policy make mistakes?",
                    "Summarize this match like a soccer coach.",
                    "Explain this replay like an RL engineer.",
                  ].map((prompt) => (
                    <div key={prompt} className="rounded-2xl bg-white/15 p-4 text-sm font-semibold leading-6">
                      {prompt}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
