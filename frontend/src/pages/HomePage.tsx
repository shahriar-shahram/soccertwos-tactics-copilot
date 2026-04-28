import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";

const features = [
  {
    title: "Compare policy styles",
    body: "See safe, aggressive, and baseline agents as tactical personalities instead of raw checkpoints.",
    href: "/compare",
    cta: "Open Arena",
  },
  {
    title: "Replay the baseline match",
    body: "Inspect a representative baseline game with match summary, scoreline, and event timeline.",
    href: "/replay",
    cta: "Watch Replay",
  },
  {
    title: "Ask the copilot",
    body: "Ask grounded questions about policy behavior, match events, and RL tactics.",
    href: "/copilot",
    cta: "Ask Questions",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8faf7] text-slate-950">
      <TopNav />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white shadow-sm">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-200 opacity-40 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-72 w-72 rounded-full bg-blue-200 opacity-40 blur-3xl" />

          <div className="relative grid gap-10 p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-14">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                RL Soccer Analytics · Tactical Copilot · Match Replay
              </div>

              <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                Watch RL agents learn soccer tactics.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                SoccerTwos Policy Arena is an application-style dashboard for comparing trained
                reinforcement learning agents, replaying a baseline match, and asking a grounded
                AI copilot why the agents behave the way they do.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/compare"
                  className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  Open Arena
                </Link>
                <Link
                  to="/replay"
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Watch Baseline Replay
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
              <div className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
                Policy lineup
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-black">Safe</div>
                  <div className="mt-1 text-sm text-slate-300">
                    Controlled recovery and lower-risk positioning.
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-black">Aggressive</div>
                  <div className="mt-1 text-sm text-slate-300">
                    High-pressure attack with more tactical risk.
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-black">Baseline</div>
                  <div className="mt-1 text-sm text-slate-300">
                    Reference policy used for comparison and replay.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <h2 className="text-2xl font-black">{feature.title}</h2>
              <p className="mt-3 min-h-24 leading-7 text-slate-600">{feature.body}</p>
              <div className="mt-5 font-black text-emerald-700 group-hover:text-emerald-800">
                {feature.cta} →
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
