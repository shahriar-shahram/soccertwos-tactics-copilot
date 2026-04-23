import { useState } from "react";
import TopNav from "../components/TopNav";
import { askCopilot } from "../lib/api";

export default function CopilotPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await askCopilot("match_001", question);
      setAnswer(result.answer);
    } catch (err) {
      setAnswer("Failed to get a grounded answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-4 text-3xl font-bold">Copilot</h1>
        <p className="mb-6 text-slate-300">
          Ask grounded questions about the current SoccerTwos match and tactics notes.
        </p>

        <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900 p-6">
          <div className="mb-3 text-sm text-slate-400">Try one of these:</div>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              "Why did blue win?",
              "What was Orange's biggest mistake?",
              "What tactical pattern mattered most?",
              "Summarize this match in coaching language."
            ].map((sample) => (
              <button
                key={sample}
                onClick={() => setQuestion(sample)}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
              >
                {sample}
              </button>
            ))}
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the match..."
            className="mb-4 min-h-32 w-full rounded-xl border border-white/10 bg-slate-950 p-4 text-slate-100 outline-none"
          />

          <button
            onClick={handleAsk}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask Copilot"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Answer</h2>
          <p className="text-slate-300">
            {answer || "Your grounded answer will appear here."}
          </p>
        </div>
      </main>
    </div>
  );
}
