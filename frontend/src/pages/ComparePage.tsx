import { useEffect, useMemo, useState } from "react";
import TopNav from "../components/TopNav";
import { getMatchups, getPolicies } from "../lib/api";
import type { MatchupResult, Policy } from "../lib/api";

const accentClass: Record<string, string> = {
  emerald: "from-emerald-500 to-teal-500 border-emerald-200",
  violet: "from-violet-500 to-fuchsia-500 border-violet-200",
  slate: "from-slate-500 to-blue-500 border-slate-200",
};

function pct(wins: number, total: number) {
  if (!total) return "Pending";
  return `${Math.round((wins / total) * 100)}%`;
}

export default function ComparePage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [matchups, setMatchups] = useState<MatchupResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPolicies(), getMatchups()])
      .then(([policyData, matchupData]) => {
        setPolicies(policyData);
        setMatchups(matchupData);
      })
      .finally(() => setLoading(false));
  }, []);

  const policyById = useMemo(() => {
    return Object.fromEntries(policies.map((p) => [p.policy_id, p]));
  }, [policies]);

  return (
    <div className="min-h-screen bg-[#f8faf7] text-slate-950">
      <TopNav />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                SoccerTwos Policy Arena
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                Compare RL soccer agents like a tactical product dashboard.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Review safe, aggressive, and baseline SoccerTwos policies through policy cards,
                matchup summaries, evaluation metrics, and grounded copilot prompts.
              </p>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-blue-600 p-6 text-white shadow-xl">
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
                Arena Snapshot
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                  <div className="text-3xl font-black">{policies.length || 3}</div>
                  <div className="text-sm text-emerald-50">Policy styles</div>
                </div>
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                  <div className="text-3xl font-black">{matchups.length || 4}</div>
                  <div className="text-sm text-emerald-50">Matchups</div>
                </div>
                <div className="col-span-2 rounded-2xl bg-white/15 p-4 backdrop-blur">
                  <div className="text-sm text-emerald-50">Main question</div>
                  <div className="mt-1 text-xl font-bold">
                    Which policy wins, and what behavior explains it?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="mt-10 rounded-3xl border bg-white p-8 text-slate-600 shadow-sm">
            Loading arena data...
          </div>
        ) : (
          <>
            <section className="mt-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Policy identities</h2>
                  <p className="mt-1 text-slate-600">
                    Each agent has a different tactical personality and risk profile.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {policies.map((policy) => (
                  <article
                    key={policy.policy_id}
                    className={`rounded-[1.75rem] border bg-white p-6 shadow-sm ${
                      accentClass[policy.accent]?.split(" ").at(-1) ?? "border-slate-200"
                    }`}
                  >
                    <div
                      className={`mb-5 h-2 rounded-full bg-gradient-to-r ${
                        accentClass[policy.accent] ?? accentClass.slate
                      }`}
                    />
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                      {policy.tagline}
                    </div>
                    <h3 className="mt-2 text-2xl font-black">{policy.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-emerald-700">{policy.style}</p>
                    <p className="mt-4 leading-7 text-slate-600">{policy.summary}</p>

                    <div className="mt-5">
                      <div className="text-sm font-black text-slate-900">Strengths</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {policy.strengths.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <div className="mb-5">
                <h2 className="text-2xl font-black text-slate-950">Matchup board</h2>
                <p className="mt-1 text-slate-600">
                  These cards will automatically become quantitative once your logged evaluations are processed.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {matchups.map((m) => {
                  const blue = policyById[m.blue_policy];
                  const orange = policyById[m.orange_policy];

                  return (
                    <article
                      key={m.matchup_id}
                      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                            {m.tempo} tempo · {m.risk_level} risk
                          </div>
                          <h3 className="mt-2 text-2xl font-black">{m.title}</h3>
                        </div>
                        <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                          {m.num_matches ? `${m.num_matches} matches` : "Data pending"}
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-blue-50 p-4">
                          <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                            Blue
                          </div>
                          <div className="mt-1 text-xl font-black">{blue?.name ?? m.blue_policy}</div>
                          <div className="mt-1 text-sm text-slate-600">
                            Win rate: {pct(m.blue_wins, m.num_matches)}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-violet-50 p-4">
                          <div className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
                            Purple
                          </div>
                          <div className="mt-1 text-xl font-black">{orange?.name ?? m.orange_policy}</div>
                          <div className="mt-1 text-sm text-slate-600">
                            Win rate: {pct(m.orange_wins, m.num_matches)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-slate-100 p-4">
                          <div className="text-xs font-bold text-slate-400">Avg Blue</div>
                          <div className="text-2xl font-black">{m.avg_blue_score}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-100 p-4">
                          <div className="text-xs font-bold text-slate-400">Avg Purple</div>
                          <div className="text-2xl font-black">{m.avg_orange_score}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-100 p-4">
                          <div className="text-xs font-bold text-slate-400">Goal Diff</div>
                          <div className="text-2xl font-black">{m.goal_difference}</div>
                        </div>
                      </div>

                      <p className="mt-5 leading-7 text-slate-600">{m.summary}</p>

                      <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                          Copilot prompt
                        </div>
                        <div className="mt-2 text-sm leading-6">{m.copilot_prompt}</div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
