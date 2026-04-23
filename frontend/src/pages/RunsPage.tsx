import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { getRuns } from "../lib/api";

type Run = {
  run_id: string;
  has_top_level_onnx: boolean;
  has_checkpoint: boolean;
  has_config: boolean;
  has_readme: boolean;
  has_timers: boolean;
  has_status: boolean;
  latest_snapshot: string | null;
  artifact_count: number;
};

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRuns()
      .then(setRuns)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-3xl font-bold">Training Runs</h1>
        <p className="mb-8 max-w-3xl text-slate-300">
          Available model artifacts and experiment outputs for the SoccerTwos copilot.
        </p>

        {loading ? (
          <p className="text-slate-400">Loading runs...</p>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <Link
                key={run.run_id}
                to={`/run?id=${run.run_id}`}
                className="block rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:bg-slate-800"
              >
                <h2 className="mb-3 text-2xl font-semibold">{run.run_id}</h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-xl bg-slate-800 p-3">Top ONNX: {run.has_top_level_onnx ? "Yes" : "No"}</div>
                  <div className="rounded-xl bg-slate-800 p-3">Checkpoint: {run.has_checkpoint ? "Yes" : "No"}</div>
                  <div className="rounded-xl bg-slate-800 p-3">Config: {run.has_config ? "Yes" : "No"}</div>
                  <div className="rounded-xl bg-slate-800 p-3">README: {run.has_readme ? "Yes" : "No"}</div>
                  <div className="rounded-xl bg-slate-800 p-3">Timers: {run.has_timers ? "Yes" : "No"}</div>
                  <div className="rounded-xl bg-slate-800 p-3">Status: {run.has_status ? "Yes" : "No"}</div>
                  <div className="rounded-xl bg-slate-800 p-3">Artifacts: {run.artifact_count}</div>
                  <div className="rounded-xl bg-slate-800 p-3">Latest Snapshot: {run.latest_snapshot ?? "N/A"}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
