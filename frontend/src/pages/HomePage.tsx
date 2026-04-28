import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Eye,
  GitCompare,
  PlayCircle,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import TopNav from "../components/TopNav";

const valueCards = [
  {
    title: "See policy behavior, not just scores",
    text: "Win rates tell you who won. This product helps explain how the agents actually behaved.",
    icon: Eye,
  },
  {
    title: "Compare agents head-to-head",
    text: "Safe, Aggressive, and Baseline policies are evaluated across Blue-vs-Purple matchups.",
    icon: GitCompare,
  },
  {
    title: "Ask why outcomes happened",
    text: "The copilot turns match context into readable explanations for non-RL users.",
    icon: Bot,
  },
];

const specialPoints = [
  "Built around Unity SoccerTwos multi-agent RL",
  "Designed for repeated policy evaluation, not one-off demos",
  "Connects training, matchup results, replay review, and AI explanation",
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-15rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-16 h-[36rem] w-[36rem] rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-[-20rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative mx-auto max-w-[1350px] px-6 py-10">
        <section className="grid gap-7 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl shadow-slate-950/20">
            <div className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
              <Sparkles className="h-4 w-4 text-purple-300" />
              RL policy evaluation, made understandable
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-[0.98] text-white md:text-6xl">
              Understand why AI soccer agents win, lose, or fail.
            </h1>

            <p className="mt-6 max-w-3xl text-[15px] leading-7 text-slate-300">
              SoccerTwos Policy Arena is a product-style dashboard for comparing trained agents in
              the Unity SoccerTwos environment. It helps turn raw RL evaluation into something you
              can actually inspect, explain, and communicate.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02]"
              >
                Explore Policy Arena
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                See How It Works
                <BrainCircuit className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-7 shadow-xl shadow-slate-950/20">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15">
                <Target className="h-6 w-6 text-purple-200" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                  Why it matters
                </div>
                <h2 className="text-xl font-black text-white">RL results are hard to interpret.</h2>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Most RL projects stop at reward curves, logs, or final scores. But those do not clearly
              show why an agent succeeded, where it failed, or how one policy behaves differently
              from another.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                <Trophy className="h-4 w-4 text-emerald-300" />
                This product adds the missing layer
              </div>
              <p className="text-sm leading-6 text-slate-400">
                It connects policy comparison, replay evidence, and AI explanation so the result is
                easier to understand than raw metrics alone.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-5 md:grid-cols-3">
          {valueCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="h-6 w-6 text-purple-200" />
                </div>
                <h3 className="text-lg font-black text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{card.text}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-7 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20">
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr] xl:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                What makes it special
              </div>
              <h2 className="mt-2 text-2xl font-black text-white">
                Not just a demo. A policy evaluation workflow.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {specialPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm leading-6 text-slate-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-5 md:grid-cols-3">
          <Link
            to="/compare"
            className="group rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5 transition hover:bg-blue-500/15"
          >
            <GitCompare className="mb-4 h-6 w-6 text-blue-200" />
            <div className="text-lg font-black text-white">Compare policies</div>
            <div className="mt-2 text-sm text-slate-400">Safe, Aggressive, and Baseline matchups.</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-200">
              Open Arena
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/replay"
            className="group rounded-3xl border border-purple-400/20 bg-purple-500/10 p-5 transition hover:bg-purple-500/15"
          >
            <PlayCircle className="mb-4 h-6 w-6 text-purple-200" />
            <div className="text-lg font-black text-white">Review a replay</div>
            <div className="mt-2 text-sm text-slate-400">Inspect goals, mistakes, and key moments.</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-purple-200">
              Watch Match
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/copilot"
            className="group rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 transition hover:bg-emerald-500/15"
          >
            <Bot className="mb-4 h-6 w-6 text-emerald-200" />
            <div className="text-lg font-black text-white">Ask the copilot</div>
            <div className="mt-2 text-sm text-slate-400">Ask why a team won, failed, or changed momentum.</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-200">
              Ask Why
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
