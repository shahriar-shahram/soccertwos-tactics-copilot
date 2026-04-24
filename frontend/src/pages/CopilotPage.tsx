import { useState } from "react";
import TopNav from "../components/TopNav";
import { askCopilot } from "../lib/api";

type GroundingItem = {
  source: string;
  content: string;
};

export default function CopilotPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [grounding, setGrounding] = useState<GroundingItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await askCopilot("match_001", question);
      setAnswer(result.answer);
      setGrounding(result.grounding || []);
    } catch (err) {
      setAnswer("Failed to get a grounded answer.");
      setGrounding([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
              Azure OpenAI + Azure AI Search
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Copilot</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Ask grounded questions about the current SoccerTwos match, tactics notes, and indexed replay events.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300">
            Live grounded answer generation
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
          <div className="mb-3 text-sm text-slate-400">Suggested prompts</div>
          <div className="mb-5 flex flex-wrap gap-2">
            {[
              "Why did blue win?",
              "What was Orange's biggest mistake?",
              "What tactical pattern mattered most?",
              "Summarize this match in coaching language.",
            ].map((sample) => (
              <button
                key={sample}
                onClick={() => setQuestion(sample)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
              >
                {sample}
              </button>
            ))}
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the match..."
            className="mb-4 min-h-36 w-full rounded-2xl border border-white/10 bg-slate-950 p-4 text-slate-100 outline-none placeholder:text-slate-500"
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Match context: <span className="text-slate-300">match_001</span>
            </div>
            <button
              onClick={handleAsk}
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask Copilot"}
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Answer</h2>
            <div className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              Grounded response
            </div>
          </div>
          <p className="whitespace-pre-wrap leading-7 text-slate-200">
            {answer || "Your grounded answer will appear here."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Grounding Sources</h2>
            <div className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              Retrieved {grounding.length} source{grounding.length === 1 ? "" : "s"}
            </div>
          </div>

          {grounding.length === 0 ? (
            <p className="text-slate-400">No sources shown yet.</p>
          ) : (
            <div className="space-y-4">
              {grounding.map((item, index) => (
                <div key={index} className="rounded-2xl border border-white/5 bg-slate-800/80 p-4">
                  <div className="mb-2 inline-flex rounded-full bg-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-blue-300">
                    {item.source}
                  </div>
                  <div className="whitespace-pre-wrap leading-7 text-slate-300">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
