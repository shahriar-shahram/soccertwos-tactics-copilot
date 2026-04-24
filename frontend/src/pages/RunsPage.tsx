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
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
              Experiment Tracking
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Training Runs</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Available model artifacts and experiment outputs for the SoccerTwos tactics copilot.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading runs...</p>
        ) : (
          <div className="space-y-5">
            {runs.map((run) => (
              <Link
                key={run.run_id}
                to={`/run?id=${run.run_id}`}
                className="block rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/30 transition hover:bg-slate-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{run.run_id}</h2>
                  <div className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    {run.artifact_count} artifacts
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-slate-800 p-4">
                    <div className="text-sm text-slate-400">Top ONNX</div>
                    <div className="mt-2 font-medium">{run.has_top_level_onnx ? "Available" : "Missing"}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-800 p-4">
                    <div className="text-sm text-slate-400">Checkpoint</div>
                    <div className="mt-2 font-medium">{run.has_checkpoint ? "Available" : "Missing"}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-800 p-4">
                    <div className="text-sm text-slate-400">Config</div>
                    <div className="mt-2 font-medium">{run.has_config ? "Available" : "Missing"}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-800 p-4">
                    <div className="text-sm text-slate-400">Latest Snapshot</div>
                    <div className="mt-2 font-medium">{run.latest_snapshot ?? "N/A"}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
