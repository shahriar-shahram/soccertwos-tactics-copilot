import { Link } from "react-router-dom";
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  Film,
  GitCompare,
  Shield,
  Target,
  Zap,
} from "lucide-react";
import TopNav from "../components/TopNav";

const policies = [
  {
    name: "Safe",
    desc: "Prioritizes more controlled play, recovery, and lower-risk decisions.",
    icon: Shield,
    tone: "border-blue-400/20 bg-blue-500/10 text-blue-200",
  },
  {
    name: "Aggressive",
    desc: "Applies more pressure, attacks faster, and accepts more tactical risk.",
    icon: Zap,
    tone: "border-purple-400/20 bg-purple-500/10 text-purple-200",
  },
  {
    name: "Baseline",
    desc: "Acts as a reference point to compare against the trained variants.",
    icon: Target,
    tone: "border-teal-400/20 bg-teal-500/10 text-teal-200",
  },
];

const matchupRows = [
  ["Safe vs Safe", "Safe vs Aggressive", "Safe vs Baseline"],
  ["Aggressive vs Safe", "Aggressive vs Aggressive", "Aggressive vs Baseline"],
  ["Baseline vs Safe", "Baseline vs Aggressive", "Baseline vs Baseline"],
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-15rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-16 h-[36rem] w-[36rem] rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-[-20rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative mx-auto max-w-[1500px] px-6 py-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-xl shadow-slate-950/20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
            <BrainCircuit className="h-4 w-4 text-purple-300" />
            How the system works
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            Train policies, evaluate them fairly, then explain what happened.
          </h1>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300">
            This project follows a simple pipeline:
            <span className="text-white"> train different RL policies in Unity SoccerTwos</span>,
            <span className="text-white"> evaluate them across repeated Blue-vs-Purple matchups</span>,
            and then
            <span className="text-white"> analyze outcomes through replays and an AI copilot</span>.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:scale-[1.02]"
            >
              View Arena
              <GitCompare className="h-4 w-4" />
            </Link>
            <Link
              to="/copilot"
              className="inline-flex items-center gap-2 rounded-2xl border border-purple-400/20 bg-purple-500/10 px-4 py-2.5 text-sm font-bold text-purple-100 transition hover:bg-purple-500/15"
            >
              Open Copilot
              <Bot className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Step 1 · Training
            </div>
            <h2 className="text-2xl font-black text-white">We train multiple policies, not just one.</h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              The project focuses on behavior differences across policy types. Instead of treating RL as a single final model,
              we train multiple policy styles so they can later be compared in a more meaningful way.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              In this version, the main policies are Safe, Aggressive, and Baseline. These names reflect their intended style
              and make the comparison easier to understand than raw run IDs alone.
            </p>

            <div className="mt-5 space-y-3">
              {policies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <div key={policy.name} className={`rounded-2xl border p-4 ${policy.tone}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/50">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-black text-white">{policy.name}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-300">{policy.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Step 2 · Evaluation
            </div>
            <h2 className="text-2xl font-black text-white">We evaluate policies head-to-head across all matchups.</h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Each policy plays against every other policy as Blue and Purple. That gives us
              <span className="text-white"> 9 matchup cases</span>, not just a single tournament bracket.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              The side assignment matters. Safe vs Aggressive is treated separately from Aggressive vs Safe,
              because behavior and outcomes can shift depending on which team starts as Blue or Purple.
            </p>

            <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
              <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
                <div className="p-3">Blue</div>
                <div className="p-3">Blue</div>
                <div className="p-3">Blue</div>
              </div>
              <div className="grid gap-px bg-white/10">
                {matchupRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-3 gap-px">
                    {row.map((cell) => (
                      <div key={cell} className="bg-slate-950/80 p-4 text-center text-sm font-semibold text-white">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="font-semibold text-emerald-200">Evaluation rule</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                Each matchup is run over repeated games. The current setup uses
                <span className="text-white"> 50 matches</span> per matchup,
                with a
                <span className="text-white"> 5000-step limit</span>,
                and the
                <span className="text-white"> first team to 10 goals wins</span>.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Step 3 · Analysis
            </div>
            <h2 className="text-2xl font-black text-white">We do not stop at win rates.</h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              After evaluation, the product helps interpret the results through replay review and AI assistance.
              The replay page shows score, major events, and a simple match story. The copilot then answers questions
              about why the game unfolded the way it did.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center gap-2 text-white">
                  <Film className="h-4 w-4 text-purple-300" />
                  <span className="font-semibold">Replay review</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Useful for seeing goals, recoveries, mistakes, and momentum changes inside a single match.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center gap-2 text-white">
                  <Bot className="h-4 w-4 text-purple-300" />
                  <span className="font-semibold">AI copilot</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Useful for asking why Blue won, what Purple struggled with, which moment changed the game,
                  or how one policy style differs from another.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Product goal
            </div>
            <h2 className="text-2xl font-black text-white">Why build it this way?</h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                RL projects often produce results that are technically correct but hard to understand quickly.
                This project tries to make policy behavior more visible and easier to communicate.
              </p>
              <p className="text-slate-400">
                Instead of only storing logs, the product creates a path from
                <span className="text-white"> training</span> to
                <span className="text-white"> evaluation</span> to
                <span className="text-white"> explanation</span>.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Clear comparison across policy types",
                "Replay-based interpretation of results",
                "More accessible explanations for non-RL users",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-950/40 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
