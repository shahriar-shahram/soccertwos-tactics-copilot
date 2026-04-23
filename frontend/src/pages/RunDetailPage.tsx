import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import { getRunById } from "../lib/api";

type RunDetail = {
  run_id: string;
  files: string[];
};

export default function RunDetailPage() {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get("id") || "soccertwos_poca_v1";
  const [run, setRun] = useState<RunDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRunById(runId)
      .then(setRun)
      .finally(() => setLoading(false));
  }, [runId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <p className="text-slate-400">Loading run detail...</p>
        ) : !run ? (
          <p className="text-red-400">Run not found.</p>
        ) : (
          <>
            <h1 className="mb-4 text-3xl font-bold">{run.run_id}</h1>
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-4 text-2xl font-semibold">Artifacts</h2>
              <div className="space-y-2">
                {run.files.map((file, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-800 p-3 text-sm text-slate-300">
                    {file}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
