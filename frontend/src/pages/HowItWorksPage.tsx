import TopNav from "../components/TopNav";

const workflow = [
  {
    title: "Train",
    subtitle: "Multi-agent RL policies",
    body: "SoccerTwos agents are trained in the Unity ML-Agents environment. The goal is not only to score, but to learn team behavior such as pressure, recovery, positioning, and transitions.",
  },
  {
    title: "Separate",
    subtitle: "Policy behavior styles",
    body: "The trained checkpoints are organized into interpretable policy variants: baseline, safe, and aggressive. This turns raw RL models into behavior profiles that users can compare.",
  },
  {
    title: "Evaluate",
    subtitle: "Repeated head-to-head games",
    body: "Policies are evaluated across repeated matchups. The app summarizes score, win rate, goal difference, tempo, risk, and behavior-level observations.",
  },
  {
    title: "Explain",
    subtitle: "Grounded tactical copilot",
    body: "Match logs, evaluation summaries, and methodology notes are converted into retrieval evidence so the copilot can answer questions using project-specific context.",
  },
];

const policies = [
  {
    name: "Baseline",
    label: "Reference benchmark",
    body: "The baseline agent is the neutral reference policy. It is useful for showing what happens before emphasizing safer recovery or higher-pressure attacking.",
    accent: "border-slate-200 bg-slate-50 text-slate-800",
  },
  {
    name: "Safe",
    label: "Controlled recovery",
    body: "The safe agent represents a lower-risk tactical style. It prioritizes team shape, defensive recovery, and fewer collapses during transitions.",
    accent: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    name: "Aggressive",
    label: "High-pressure attack",
    body: "The aggressive agent represents a higher-tempo style. It pressures quickly and attacks directly, but may expose itself defensively if it overcommits.",
    accent: "border-violet-200 bg-violet-50 text-violet-800",
  },
];

const metrics = [
  "Win rate",
  "Average score",
  "Goal difference",
  "Tempo",
  "Risk level",
  "Behavior summary",
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#f8faf7] text-slate-950">
      <TopNav />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white shadow-sm">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Methodology
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                From trained RL agents to tactical explanations.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                This app turns SoccerTwos reinforcement learning experiments into an application-style
                analysis system: train agents, compare behavior, replay matches, and ask a grounded
                copilot why each policy behaves the way it does.
              </p>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
              <div className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
                Project pipeline
              </div>
              <div className="mt-6 space-y-3">
                {["Unity ML-Agents", "Policy checkpoints", "Evaluation logs", "Processed evidence", "RAG copilot"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-sm font-black">
                        {index + 1}
                      </div>
                      <div className="font-bold">{item}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step) => (
            <article
              key={step.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                {step.subtitle}
              </div>
              <h2 className="mt-2 text-3xl font-black">{step.title}</h2>
              <p className="mt-4 leading-7 text-slate-600">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Policy interpretation
            </div>
            <h2 className="text-3xl font-black">What the models mean</h2>
            <p className="mt-4 leading-8 text-slate-600">
              A recruiter or product reviewer should not need to inspect raw checkpoints to understand
              the experiment. The app explains each model as a tactical behavior profile.
            </p>
          </div>

          <div className="grid gap-5">
            {policies.map((policy) => (
              <article
                key={policy.name}
                className={`rounded-[1.75rem] border p-6 shadow-sm ${policy.accent}`}
              >
                <div className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">
                  {policy.label}
                </div>
                <h3 className="mt-2 text-2xl font-black">{policy.name}</h3>
                <p className="mt-3 leading-7">{policy.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Evaluation layer
              </div>
              <h2 className="text-3xl font-black">Repeated matchups, not one-off demos.</h2>
              <p className="mt-4 leading-8 text-slate-600">
                The Arena page is designed to use processed evaluation logs, not manually written claims.
                Once your logged runs are connected, the cards will report real matchup statistics.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div
                  key={metric}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold text-slate-700"
                >
                  {metric}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[2.5rem] bg-gradient-to-br from-emerald-700 to-blue-700 p-8 text-white shadow-xl lg:p-10">
          <div className="max-w-4xl">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-100">
              Why this matters
            </div>
            <h2 className="mt-3 text-3xl font-black">
              The project demonstrates more than model training.
            </h2>
            <p className="mt-4 text-lg leading-8 text-emerald-50">
              It shows an end-to-end AI product pattern: train agents, process experiment outputs,
              serve structured backend data, build a polished frontend, and use retrieval-augmented
              generation to explain results in a way humans can actually inspect.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
