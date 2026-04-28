import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Crosshair,
  Film,
  Flag,
  Goal,
  Shield,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
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
  video_path?: string;
  teams?: {
    blue: string;
    orange: string;
  };
  events: MatchEvent[];
};

function eventIcon(type: string) {
  if (type === "goal") return Goal;
  if (type === "mistake") return Zap;
  if (type === "recovery") return ShieldCheck;
  if (type === "chance") return Crosshair;
  return Flag;
}

function eventColor(type: string) {
  if (type === "goal") return "border-blue-400/30 bg-blue-500/10 text-blue-300";
  if (type === "mistake") return "border-rose-400/30 bg-rose-500/10 text-rose-300";
  if (type === "recovery") return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  if (type === "chance") return "border-purple-400/30 bg-purple-500/10 text-purple-300";
  return "border-white/10 bg-white/5 text-slate-300";
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

  const keyEvents = match?.events.slice(0, 6) ?? [];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-15rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-16 h-[36rem] w-[36rem] rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative mx-auto max-w-[1500px] px-6 py-8">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-400">
            Loading replay...
          </div>
        ) : !match ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-200">
            Match not found.
          </div>
        ) : (
          <>
            <section className="mb-6 grid gap-5 xl:grid-cols-[1fr_540px_220px] xl:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-400/30 bg-blue-500/10 shadow-lg shadow-blue-500/10">
                  <Film className="h-8 w-8 text-blue-200" />
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                    Replay
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    <span className="font-bold text-white">{match.title}</span>
                    <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-200">
                      {winner} won
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span className="line-clamp-1">{match.summary}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-slate-950/20">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="flex items-center gap-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                      <Shield className="h-7 w-7 text-blue-300" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-blue-200">Blue</div>
                      <div className="text-3xl font-black text-white">{match.score.blue}</div>
                    </div>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-400">
                    VS
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15">
                      <Crosshair className="h-7 w-7 text-purple-300" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-purple-200">Purple</div>
                      <div className="text-3xl font-black text-white">{match.score.orange}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden items-center justify-center gap-3 xl:flex">
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Final Score
                </div>
                <Trophy className="h-6 w-6 text-purple-200" />
              </div>
            </section>

            <section className="mb-5 grid gap-3 md:grid-cols-5">
              {[
                { label: "Policy", value: match.policy_id ?? "N/A", Icon: Shield },
                { label: "Duration", value: `${match.duration_steps ?? "N/A"}s`, Icon: Clock },
                { label: "ELO", value: match.elo_estimate ?? "N/A", Icon: Trophy },
                { label: "Events", value: match.events.length, Icon: Flag },
                { label: "Goals", value: stats.goals, Icon: Goal },
              ].map((item) => {
                const Icon = item.Icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-slate-950/20"
                  >
                    <Icon className="mb-3 h-5 w-5 text-slate-400" />
                    <div className="text-xs text-slate-500">{item.label}</div>
                    <div className="mt-1 break-words text-sm font-black text-white">
                      {String(item.value)}
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-black text-white">Match Replay</h2>
                  <span className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                    3D View
                  </span>
                </div>

                {match.video_path ? (
                  <video
                    controls
                    className="aspect-video w-full rounded-2xl border border-white/10 bg-slate-950 object-cover"
                  >
                    <source src={match.video_path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/70 text-sm text-slate-500">
                    No replay video attached yet
                  </div>
                )}

                <div className="mx-auto mt-3 flex w-fit rounded-2xl border border-white/10 bg-slate-950/60 p-1 text-xs text-slate-400">
                  {["0.5x", "1x", "1.5x", "2x"].map((speed) => (
                    <span
                      key={speed}
                      className={
                        speed === "1x"
                          ? "rounded-xl bg-white/10 px-4 py-1.5 font-bold text-white"
                          : "px-4 py-1.5"
                      }
                    >
                      {speed}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
                  <h2 className="mb-4 text-base font-black text-white">What decided the match?</h2>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-2">
                    {[
                      { label: "Goals", value: stats.goals, Icon: Goal, tone: "blue" },
                      { label: "Chances", value: stats.chances, Icon: Zap, tone: "purple" },
                      { label: "Mistakes", value: stats.mistakes, Icon: Zap, tone: "rose" },
                      { label: "Recoveries", value: stats.recoveries, Icon: ShieldCheck, tone: "emerald" },
                    ].map((item) => {
                      const Icon = item.Icon;
                      const toneClass =
                        item.tone === "blue"
                          ? "border-blue-400/30 bg-blue-500/10 text-blue-300"
                          : item.tone === "purple"
                            ? "border-purple-400/30 bg-purple-500/10 text-purple-300"
                            : item.tone === "rose"
                              ? "border-rose-400/30 bg-rose-500/10 text-rose-300"
                              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";

                      return (
                        <div
                          key={item.label}
                          className={`rounded-2xl border p-4 ${toneClass}`}
                        >
                          <Icon className="mb-2 h-5 w-5" />
                          <div className="text-xs text-slate-400">{item.label}</div>
                          <div className="text-xl font-black text-white">{String(item.value)}</div>
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    to="/copilot"
                    className="mt-4 flex items-center justify-between rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4 text-sm text-slate-200 hover:bg-purple-500/15"
                  >
                    <div>
                      <div className="font-black text-white">Key takeaway</div>
                      <div className="mt-1 text-xs text-slate-400">
                        Score first. Then inspect turning points.
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-purple-200" />
                  </Link>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-black text-white">Key moments</h2>
                    <span className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                      First {keyEvents.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {keyEvents.map((event, index) => {
                      const Icon = eventIcon(event.type);

                      return (
                        <div
                          key={`${event.step}-${index}`}
                          className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl bg-slate-950/50 p-3"
                        >
                          <div className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${eventColor(event.type)}`}>
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-500">
                                Step {event.step}
                              </span>
                              <span className="text-xs font-bold text-slate-300">
                                {teamLabel(event.team)}
                              </span>
                            </div>
                            <div className="line-clamp-1 text-sm text-slate-200">
                              {event.text}
                            </div>
                          </div>

                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300">
                            {event.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
