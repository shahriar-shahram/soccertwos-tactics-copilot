import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Crosshair,
  GitCompare,
  Grid3X3,
  RotateCcw,
  Settings,
  Shield,
  Swords,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";

const policies = [
  {
    name: "Safe",
    icon: Shield,
    color: "blue",
    desc: "Stays organized and limits risk.",
    chip: "More stable",
  },
  {
    name: "Aggressive",
    icon: Zap,
    color: "purple",
    desc: "Pressures hard and attacks fast.",
    chip: "Creates chances",
  },
  {
    name: "Baseline",
    icon: Crosshair,
    color: "teal",
    desc: "Reference policy for comparison.",
    chip: "Comparison anchor",
  },
];

function policyIcon(policy: string) {
  if (policy === "Safe") return Shield;
  if (policy === "Aggressive") return Zap;
  return Crosshair;
}

function policyColor(policy: string) {
  if (policy === "Safe") return "text-blue-300 bg-blue-500/10 border-blue-400/20";
  if (policy === "Aggressive") return "text-purple-300 bg-purple-500/10 border-purple-400/20";
  return "text-teal-300 bg-teal-500/10 border-teal-400/20";
}

function MatrixHeader({ policy }: { policy: string }) {
  const Icon = policyIcon(policy);

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-300">
      <span className={`flex h-8 w-8 items-center justify-center rounded-2xl border ${policyColor(policy)}`}>
        <Icon className="h-4 w-4" />
      </span>
      {policy}
    </div>
  );
}

function MatrixRowLabel({ policy }: { policy: string }) {
  const Icon = policyIcon(policy);

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold text-slate-300">
      <span className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${policyColor(policy)}`}>
        <Icon className="h-4 w-4" />
      </span>
      {policy}
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-15rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-16 h-[36rem] w-[36rem] rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-[-20rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative mx-auto max-w-[1500px] px-6 py-8">
        <section className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-purple-400/30 bg-purple-500/10 shadow-lg shadow-purple-500/10">
              <GitCompare className="h-8 w-8 text-purple-200" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                Policy Arena
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Compare Safe, Aggressive, and Baseline agents across repeated matchups.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {[
              ["3", "Policies", Swords, "blue"],
              ["9", "Matchups", Grid3X3, "purple"],
              ["50", "Games each", CheckCircle2, "teal"],
              ["5,000", "Max steps", Clock, "orange"],
              ["First to 10", "Goals wins", Target, "yellow"],
            ].map(([value, label, Icon, tone]) => {
              const toneClass =
                tone === "blue"
                  ? "text-blue-300 bg-blue-500/10"
                  : tone === "purple"
                    ? "text-purple-300 bg-purple-500/10"
                    : tone === "teal"
                      ? "text-teal-300 bg-teal-500/10"
                      : tone === "orange"
                        ? "text-orange-300 bg-orange-500/10"
                        : "text-yellow-300 bg-yellow-500/10";

              return (
                <div
                  key={label as string}
                  className="min-w-[150px] rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-slate-950/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${toneClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{value as string}</div>
                      <div className="text-xs text-slate-400">{label as string}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[390px_1fr_320px]">
          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-300" />
                  <h2 className="text-base font-black text-white">Evaluation Setup</h2>
                </div>

                <Link
                  to="/replay"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10"
                >
                  View replay
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  ["Environment", "SoccerTwos (poca_v1)"],
                  ["Episode length", "5,000 steps"],
                  ["Goal condition", "First to 10 goals wins"],
                  ["Games per matchup", "50"],
                  ["Policies", "3"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm font-semibold text-slate-300">{label}</span>
                    <span className="text-sm text-slate-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {policies.map((policy) => {
                const Icon = policy.icon;
                const colorClass =
                  policy.color === "blue"
                    ? "border-blue-400/40 bg-blue-500/10"
                    : policy.color === "purple"
                      ? "border-purple-400/40 bg-purple-500/10"
                      : "border-teal-400/40 bg-teal-500/10";

                const iconClass =
                  policy.color === "blue"
                    ? "bg-blue-500/10 text-blue-300"
                    : policy.color === "purple"
                      ? "bg-purple-500/10 text-purple-300"
                      : "bg-teal-500/10 text-teal-300";

                return (
                  <div
                    key={policy.name}
                    className={`rounded-3xl border p-4 shadow-lg shadow-slate-950/20 ${colorClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-full border border-white/10 ${iconClass}`}>
                        <Icon className="h-7 w-7" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black text-white">{policy.name}</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-400">{policy.desc}</p>

                        <div className="mt-2 flex gap-2">
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
                            Strength
                          </span>
                          <span className="rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-[11px] text-slate-300">
                            {policy.chip}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
            <div className="mb-5 grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-3">
              <div />
              <MatrixHeader policy="Safe" />
              <MatrixHeader policy="Aggressive" />
              <MatrixHeader policy="Baseline" />
            </div>

            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <div className="text-sm font-black text-blue-300">Blue side = row</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-300">
                VS
              </div>
              <div className="text-sm font-black text-purple-300">Purple side = column</div>
            </div>

            <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-3">
              {["Safe", "Aggressive", "Baseline"].map((rowPolicy) => (
                <div key={rowPolicy} className="contents">
                  <MatrixRowLabel policy={rowPolicy} />

                  {["Safe", "Aggressive", "Baseline"].map((colPolicy) => (
                    <div
                      key={`${rowPolicy}-${colPolicy}`}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 transition hover:border-purple-400/40 hover:bg-purple-500/10"
                    >
                      <div className="text-center text-sm font-bold text-white">
                        {rowPolicy} vs {colPolicy}
                      </div>

                      <div className="my-3 border-t border-white/10" />

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="mx-auto mb-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
                          <div className="text-xs text-slate-500">-</div>
                        </div>
                        <div>
                          <div className="mx-auto mb-1 h-2.5 w-2.5 rounded-full bg-slate-400" />
                          <div className="text-xs text-slate-500">-</div>
                        </div>
                        <div>
                          <div className="mx-auto mb-1 h-2.5 w-2.5 rounded-full bg-purple-400" />
                          <div className="text-xs text-slate-500">-</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                Blue wins
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                Draw
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
                Purple wins
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-gradient-to-b from-purple-500/10 to-blue-500/5 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-purple-400/30 bg-purple-500/10 shadow-lg shadow-purple-500/10">
                <RotateCcw className="h-11 w-11 text-purple-200" />
              </div>

              <h2 className="text-xl font-black text-white">Matchups are asymmetric</h2>

              <p className="mt-3 max-w-[230px] text-sm leading-6 text-slate-400">
                Safe vs Aggressive is not the same as Aggressive vs Safe. Each cell runs a separate evaluation.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
