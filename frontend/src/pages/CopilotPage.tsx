import { useState } from "react";
import {
  ArrowRight,
  Bot,
  HelpCircle,
  Loader2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import TopNav from "../components/TopNav";
import { askCopilot } from "../lib/api";

type GroundingItem = {
  source: string;
  content: string;
};

const suggestedPrompts = [
  "Why did Blue win this match?",
  "What was Purple's biggest weakness?",
  "Which moment changed the game the most?",
  "How did Blue and Purple differ tactically?",
  "Explain this match in simple terms.",
  "What did the aggressive policy do well?",
  "Did one team recover better after mistakes?",
  "What patterns kept showing up in the match?",
];

const questionThemes = [
  "Why a team won or lost",
  "Turning points",
  "Mistakes and recoveries",
  "Differences between teams",
  "Simple match summaries",
  "Policy-style behavior inside a replay",
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
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-15rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-16 h-[36rem] w-[36rem] rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative mx-auto max-w-[1500px] px-6 py-8">
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
              <Sparkles className="h-4 w-4 text-purple-300" />
              Tactical copilot
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Ask what happened in a match, and why.
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
              The copilot is designed to turn match context into short, readable explanations.
              It helps you move from raw replay details to a clearer story about
              <span className="text-white"> tactics</span>,
              <span className="text-white"> mistakes</span>,
              <span className="text-white"> turning points</span>,
              and <span className="text-white"> policy behavior</span>.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {questionThemes.map((item) => (
                <span
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20">
            <h2 className="text-lg font-black text-white">What Copilot is for</h2>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-semibold">Good at</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Explaining match outcomes, highlighting key moments, comparing Blue and Purple,
                  and summarizing behavior in plain English.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                <div className="flex items-center gap-2 text-amber-200">
                  <TriangleAlert className="h-4 w-4" />
                  <span className="font-semibold">Limitations</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  It answers based on the retrieved match context. It may not know training details,
                  hidden internal state, or information that was not indexed into the local match data.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                <div className="flex items-center gap-2 text-blue-200">
                  <HelpCircle className="h-4 w-4" />
                  <span className="font-semibold">Recommended questions</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The suggestions below are only examples. You are not limited to them.
                  You can ask your own grounded questions about the selected match.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-300" />
              <h2 className="text-base font-black text-white">Suggested questions</h2>
            </div>

            <p className="mb-4 text-sm leading-6 text-slate-400">
              Starter prompts for the current match. Click one, or write your own.
            </p>

            <div className="space-y-3">
              {suggestedPrompts.map((sample) => (
                <button
                  key={sample}
                  onClick={() => handleAsk(sample)}
                  className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-left text-sm font-semibold text-slate-200 transition hover:border-purple-400/40 hover:bg-purple-500/10"
                >
                  <span className="pr-4">{sample}</span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-purple-200" />
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-300" />
                <h2 className="text-base font-black text-white">Ask your own question</h2>
              </div>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example: Why did Blue control the match better than Purple?"
                className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-purple-400/50"
              />

              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="text-sm text-slate-500">
                  Current match: <span className="font-bold text-slate-200">match_001</span>
                </div>

                <button
                  onClick={() => handleAsk()}
                  disabled={loading || !question.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-300" />
                  <h2 className="text-base font-black text-white">Copilot answer</h2>
                </div>
                <span className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                  Grounded response
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {answer || "Ask a question and the explanation will appear here."}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-black text-white">Retrieved evidence</h2>
                <span className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                  {grounding.length} source{grounding.length === 1 ? "" : "s"}
                </span>
              </div>

              {grounding.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-4 text-sm text-slate-500">
                  Retrieved evidence will appear here after you ask a question.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {grounding.map((item, index) => (
                    <div
                      key={`${item.source}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                    >
                      <div className="mb-2 line-clamp-1 text-xs font-bold uppercase tracking-wide text-blue-300">
                        {item.source}
                      </div>
                      <div className="line-clamp-5 text-sm leading-6 text-slate-300">
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
