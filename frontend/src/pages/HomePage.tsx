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
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <TopNav />

      <main className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="absolute left-1/2 top-10 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute right-10 top-80 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <section className="grid min-h-[72vh] gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              RL Replay Intelligence Platform
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
              Explain how AI soccer agents play.
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
              Watch RL matches, inspect key events, and ask a grounded AI copilot why agents won, failed, or recovered.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/copilot"
                className="rounded-2xl bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Ask the Copilot
              </Link>
              <Link
                to="/replay?id=match_001"
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-bold text-slate-100 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Watch Replay
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["1", "Demo Match"],
                ["5", "Grounding Sources"],
                ["Live", "Vercel + Render"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="mt-1 text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-blue-950/20 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Current Replay</div>
                  <div className="text-xl font-bold">Blue vs Orange</div>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                  Live Demo
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950 p-5">
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-blue-500/15 p-4">
                    <div className="text-sm text-blue-200">Blue</div>
                    <div className="text-5xl font-black">3</div>
                  </div>
                  <div className="rounded-2xl bg-orange-500/15 p-4">
                    <div className="text-sm text-orange-200">Orange</div>
                    <div className="text-5xl font-black">2</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    ["120", "Counterattack", "Blue scored after midfield transition"],
                    ["430", "Punish mistake", "Blue exploited a defensive gap"],
                    ["470", "Game management", "Blue protected the lead"],
                  ].map(([step, tag, detail]) => (
                    <div key={step} className="rounded-2xl border border-white/5 bg-slate-900 p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-bold">{tag}</span>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                          step {step}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-3xl border border-white/10 bg-blue-600 p-5 shadow-2xl shadow-blue-950/40 md:block">
              <div className="text-sm text-blue-100">Copilot insight</div>
              <div className="mt-1 max-w-56 font-bold">
                Blue won through recovery shape and cleaner counters.
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            ["01", "Train", "Evaluate RL policies across different behaviors."],
            ["02", "Replay", "Turn match events into visual inspection."],
            ["03", "Explain", "Use retrieved evidence to answer tactical questions."],
          ].map(([num, title, body]) => (
            <div key={title} className="group rounded-3xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-slate-800">
              <div className="mb-5 text-5xl font-black text-slate-800 group-hover:text-blue-500/30">{num}</div>
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl shadow-slate-950/40">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                What it delivers
              </div>
              <h2 className="text-4xl font-black">From black-box RL to readable behavior.</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Replay-based behavior review",
                "Grounded tactical Q&A",
                "Failure-mode explanation",
                "Future policy comparison",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 font-semibold text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-slate-900 p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-black">Try the demo match</h2>
              <p className="mt-2 text-slate-400">Start with one seeded match and ask the copilot what happened.</p>
            </div>
            <Link
              to="/copilot"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-center font-bold text-white transition hover:bg-blue-500"
            >
              Ask AI
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
                  className="block rounded-3xl border border-white/10 bg-slate-950 p-5 transition hover:border-blue-400/50 hover:bg-slate-800"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="text-xl font-bold">{match.title}</div>
                      <div className="mt-2 text-slate-400">{match.summary}</div>
                    </div>
                    <div className="rounded-full bg-slate-800 px-5 py-2 font-bold text-slate-200">
                      {match.score}
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
