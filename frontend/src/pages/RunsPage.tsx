import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  FolderKanban,
  Package,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
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

function Availability({ value }: { value: boolean }) {
  return (
    <span
      className={
        value
          ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300"
          : "inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-bold text-slate-400"
      }
    >
      {value ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {value ? "Ready" : "Missing"}
    </span>
  );
}

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRuns()
      .then((data) => setRuns(data as Run[]))
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    return {
      runs: runs.length,
      artifacts: runs.reduce((acc, run) => acc + run.artifact_count, 0),
      checkpoints: runs.filter((run) => run.has_checkpoint).length,
      configs: runs.filter((run) => run.has_config).length,
    };
  }, [runs]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-15rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-16 h-[36rem] w-[36rem] rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative mx-auto max-w-[1500px] px-6 py-8">
        <section className="mb-6 grid gap-5 xl:grid-cols-[1fr_520px]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-xl shadow-slate-950/20">
            <div className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
              <FolderKanban className="h-4 w-4 text-purple-300" />
              Training artifacts
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Model runs, files, and reproducibility evidence.
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
              This page collects the saved model outputs behind the SoccerTwos product. It is meant
              to show that the app is connected to real training artifacts, not only a static UI.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                  Repository status
                </div>
                <h2 className="mt-1 text-lg font-black text-white">Artifact summary</h2>
              </div>
              <Package className="h-6 w-6 text-purple-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Runs", value: totals.runs, Icon: Trophy },
                { label: "Artifacts", value: totals.artifacts, Icon: Package },
                { label: "Checkpoints", value: totals.checkpoints, Icon: ShieldCheck },
                { label: "Configs", value: totals.configs, Icon: FileText },
              ].map((item) => {
                const Icon = item.Icon;

                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <Icon className="mb-3 h-5 w-5 text-slate-400" />
                    <div className="text-2xl font-black text-white">{String(item.value)}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Available runs
              </div>
              <h2 className="mt-1 text-lg font-black text-white">Experiment gallery</h2>
            </div>

            <span className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
              {loading ? "Loading" : `${runs.length} run${runs.length === 1 ? "" : "s"}`}
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm text-slate-500">
              Loading training runs...
            </div>
          ) : runs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm text-slate-500">
              No runs found yet. Once training artifacts are indexed, they will appear here.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {runs.map((run) => (
                <Link
                  key={run.run_id}
                  to={`/run?id=${run.run_id}`}
                  className="group rounded-3xl border border-white/10 bg-slate-950/45 p-5 transition hover:border-purple-400/40 hover:bg-purple-500/10"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                        <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                        Training run
                      </div>

                      <h3 className="break-words text-lg font-black text-white">{run.run_id}</h3>
                    </div>

                    <ArrowRight className="mt-2 h-5 w-5 flex-shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-purple-200" />
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <div className="text-xs text-slate-500">Artifacts</div>
                      <div className="mt-1 text-lg font-black text-white">{run.artifact_count}</div>
                    </div>
                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <div className="text-xs text-slate-500">Snapshot</div>
                      <div className="mt-1 line-clamp-1 text-sm font-bold text-white">
                        {run.latest_snapshot ?? "N/A"}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <div className="text-xs text-slate-500">Status</div>
                      <div className="mt-1">
                        <Availability value={run.has_status} />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <div className="text-xs text-slate-500">Timers</div>
                      <div className="mt-1">
                        <Availability value={run.has_timers} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Availability value={run.has_top_level_onnx} />
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-300">
                      ONNX
                    </span>

                    <Availability value={run.has_checkpoint} />
                    <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300">
                      Checkpoint
                    </span>

                    <Availability value={run.has_config} />
                    <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-bold text-teal-300">
                      Config
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-5 shadow-xl shadow-slate-950/20">
          <div className="grid gap-5 md:grid-cols-[1fr_340px] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Why this page exists
              </div>
              <h2 className="mt-2 text-xl font-black text-white">
                It connects the product UI back to real ML artifacts.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Recruiters and reviewers can see that the dashboard is tied to trained policies,
                configs, snapshots, and saved outputs rather than being only a visual mockup.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                <Clock className="h-4 w-4 text-purple-300" />
                Next upgrade
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Once evaluation is complete, this page can show run-level metrics and link each run
                to matchup results.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
