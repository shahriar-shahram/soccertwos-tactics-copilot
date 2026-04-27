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

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              RL replay analysis + grounded AI explanations
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
              Understand how SoccerTwos RL agents behave, fail, and improve.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              SoccerTwos Tactical Copilot turns reinforcement learning matches into an interactive product:
              watch replay clips, inspect match events, and ask an AI copilot for grounded tactical explanations.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/copilot"
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500"
              >
                Ask the Copilot
              </Link>
              <Link
                to="/replay?id=match_001"
                className="rounded-2xl border border-white/10 bg-slate-900 px-6 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                View Replay
              </Link>
              <a
                href="https://github.com/shahriar-shahram/soccertwos-tactics-copilot"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-slate-900 px-6 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/50">
            <div className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
              Product Flow
            </div>

            <div className="space-y-4">
              {[
                ["1", "Train RL agents", "Baseline, safe, and aggressive policies are trained and evaluated."],
                ["2", "Review matches", "Replay clips and event timelines make agent behavior visible."],
                ["3", "Ask grounded questions", "The copilot retrieves match evidence before generating an answer."],
                ["4", "Compare behavior", "Future versions will compare policies and summarize failure modes."],
              ].map(([step, title, body]) => (
                <div key={step} className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                      {step}
                    </div>
                    <div className="font-semibold text-slate-100">{title}</div>
                  </div>
                  <p className="pl-11 text-sm leading-6 text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["Replay Analysis", "Watch match clips and inspect key events that shaped the outcome."],
            ["Grounded Copilot", "Ask tactical questions and see the evidence used to support each answer."],
            ["Experiment Platform", "Connect model training, evaluation, and interpretation in one product workflow."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h3 className="mb-3 text-xl font-semibold">{title}</h3>
              <p className="leading-7 text-slate-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <div className="mb-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
            What this project delivers
          </div>

          <h2 className="text-3xl font-bold">From RL experiments to understandable AI behavior.</h2>

          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            This project bridges the gap between training reinforcement learning policies and understanding their
            real behavior. Instead of only reporting rewards or metrics, it provides an interactive system to analyze
            how agents act, why certain decisions lead to success or failure, and how tactical patterns emerge across
            simulated matches.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Analyze RL agent behavior in replay scenarios",
              "Connect raw simulation events to human-readable insights",
              "Explain wins, mistakes, pressure, recovery, and counterattacks",
              "Prepare for multi-policy comparison and failure-mode analysis",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-950/70 p-4 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold">Demo Match</h2>
              <p className="mt-2 text-slate-400">
                Start with the seeded replay and ask the copilot what happened.
              </p>
            </div>
            <Link
              to="/copilot"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-500"
            >
              Try Questions
            </Link>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading match data…</p>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <Link
                  key={match.id}
                  to={`/replay?id=${match.id}`}
                  className="block rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-blue-400/50 hover:bg-slate-800/70"
                >
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <div className="text-xl font-semibold">{match.title}</div>
                      <div className="mt-2 text-slate-400">{match.summary}</div>
                    </div>
                    <div className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                      Score {match.score}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
