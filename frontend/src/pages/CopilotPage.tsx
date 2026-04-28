import { useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  HelpCircle,
  Loader2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import TopNav from "../components/TopNav";
import { askCopilot } from "../lib/api";

type GroundingItem = {
  source: string;
  content: string;
};

const suggestedPrompts = [
  "Which policy is strongest overall?",
  "Why did aggressive outperform baseline?",
  "Is safe actually better or just more conservative?",
  "Compare aggressive and safe using the evaluation results.",
  "What does side-balanced evaluation mean?",
  "How reliable are these results?",
  "Why did Blue win this baseline replay?",
  "Explain this project like an ML engineer.",
];

const questionThemes = [
  "Policy ranking",
  "Safe vs aggressive behavior",
  "Side-balanced evaluation",
  "Baseline replay",
  "Training/evaluation limitations",
  "Grounded tactical explanations",
];

const copilotStrengths = [
  "Compares safe, aggressive, and baseline policies",
  "Explains side-balanced evaluation results",
  "Summarizes replay events and match turning points",
  "Shows retrieved evidence behind each answer",
];

export default function CopilotPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [grounding, setGrounding] = useState<GroundingItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk(selectedQuestion?: string) {
    const finalQuestion = selectedQuestion ?? question;
    if (!finalQuestion.trim()) return;

    setQuestion(finalQuestion);
    setLoading(true);

    try {
      const result = (await askCopilot("match_001", finalQuestion)) as {
        answer?: string;
        grounding?: GroundingItem[];
      };

      setAnswer(result.answer || "");
      setGrounding(result.grounding || []);
    } catch (err) {
      setAnswer("I could not reach the backend. Make sure the API is running on port 8000.");
      setGrounding([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf7] text-slate-950">
      <TopNav />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white shadow-sm">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.08fr_0.92fr] lg:p-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Grounded tactical copilot
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                Ask why the agents behave the way they do.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                The Copilot answers questions about SoccerTwos policy behavior, evaluation results,
                side-balanced comparisons, and the baseline replay using retrieved project evidence.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {questionThemes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
                <BrainCircuit className="h-4 w-4" />
                What it knows
              </div>

              <div className="mt-6 space-y-3">
                {copilotStrengths.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <div className="text-sm font-semibold leading-6 text-slate-100">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[380px_1fr]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-black">Suggested questions</h2>
            </div>

            <p className="mb-5 text-sm leading-6 text-slate-600">
              Use these prompts to test whether the app can explain both the RL evaluation and
              the baseline match replay.
            </p>

            <div className="space-y-3">
              {suggestedPrompts.map((sample) => (
                <button
                  key={sample}
                  onClick={() => handleAsk(sample)}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <span className="pr-4">{sample}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <TriangleAlert className="h-4 w-4" />
                Limitations
              </div>
              <p className="mt-2 text-sm leading-6 text-amber-900/80">
                The current results use one trained seed per policy. The side-balanced protocol helps,
                but multiple seeds would make the comparison stronger.
              </p>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-black">Ask your own question</h2>
              </div>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example: Why did aggressive outperform baseline?"
                className="min-h-36 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white"
              />

              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="text-sm text-slate-500">
                  Context:{" "}
                  <span className="font-bold text-slate-800">
                    policies, evaluations, methodology, match_001
                  </span>
                </div>

                <button
                  onClick={() => handleAsk()}
                  disabled={loading || !question.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      Ask Copilot
                      <Bot className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-xl font-black">Copilot answer</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Grounded response
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {answer || "Ask a question and the explanation will appear here."}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-xl font-black">Retrieved evidence</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {grounding.length} source{grounding.length === 1 ? "" : "s"}
                </span>
              </div>

              {grounding.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  Retrieved evidence will appear here after you ask a question.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {grounding.map((item, index) => (
                    <div
                      key={`${item.source}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 line-clamp-1 text-xs font-black uppercase tracking-[0.15em] text-emerald-700">
                        {item.source}
                      </div>
                      <div className="line-clamp-6 text-sm leading-6 text-slate-600">
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center gap-2 font-black text-blue-800">
                <HelpCircle className="h-5 w-5" />
                How to use this in an interview
              </div>
              <p className="mt-3 text-sm leading-7 text-blue-900/80">
                A strong demo flow is: open Arena, show that aggressive ranks first in the
                side-balanced evaluation, ask Copilot why, then open the retrieved evidence to show
                that the answer is grounded in your processed evaluation data.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
