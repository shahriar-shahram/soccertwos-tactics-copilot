import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  Code2,
  File,
  FileJson,
  FolderOpen,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import TopNav from "../components/TopNav";
import { getRunById } from "../lib/api";

type RunDetail = {
  run_id: string;
  files: string[];
};

function fileIcon(file: string) {
  const lower = file.toLowerCase();
  if (lower.endsWith(".json") || lower.endsWith(".yaml") || lower.endsWith(".yml")) return FileJson;
  if (lower.endsWith(".onnx") || lower.endsWith(".pt") || lower.endsWith(".pth") || lower.endsWith(".ckpt")) return Package;
  if (lower.endsWith(".py")) return Code2;
  return File;
}

function fileKind(file: string) {
  const lower = file.toLowerCase();
  if (lower.includes("checkpoint") || lower.endsWith(".ckpt")) return "checkpoint";
  if (lower.endsWith(".onnx")) return "model";
  if (lower.includes("config") || lower.endsWith(".yaml") || lower.endsWith(".json")) return "config";
  if (lower.includes("readme")) return "docs";
  if (lower.includes("timer") || lower.includes("status")) return "metadata";
  return "artifact";
}

export default function RunDetailPage() {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get("id") || "soccertwos_poca_v1";

  const [run, setRun] = useState<RunDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRunById(runId)
      .then((data) => setRun(data as RunDetail))
      .finally(() => setLoading(false));
  }, [runId]);

  const grouped = useMemo(() => {
    const files = run?.files ?? [];
    return files.reduce<Record<string, string[]>>((acc, file) => {
      const kind = fileKind(file);
      if (!acc[kind]) acc[kind] = [];
      acc[kind].push(file);
      return acc;
    }, {});
  }, [run]);

  const fileCount = run?.files.length ?? 0;
  const modelCount = grouped.model?.length ?? 0;
  const configCount = grouped.config?.length ?? 0;
  const checkpointCount = grouped.checkpoint?.length ?? 0;

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-15rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-16 h-[36rem] w-[36rem] rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative mx-auto max-w-[1500px] px-6 py-8">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-400">
            Loading run detail...
          </div>
        ) : !run ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-200">
            Run not found.
          </div>
        ) : (
          <>
            <section className="mb-6 grid gap-5 xl:grid-cols-[1fr_520px]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-xl shadow-slate-950/20">
                <Link
                  to="/runs"
                  className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to runs
                </Link>

                <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
                  <Sparkles className="h-4 w-4 text-purple-300" />
                  Run detail
                </div>

                <h1 className="break-words text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
                  {run.run_id}
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
                  This page summarizes the saved files for one training run. It is meant to make
                  the ML artifact trail easier to inspect without digging through folders manually.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Artifact summary
                    </div>
                    <h2 className="mt-1 text-lg font-black text-white">What is stored?</h2>
                  </div>
                  <FolderOpen className="h-6 w-6 text-purple-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Files", value: fileCount, Icon: File },
                    { label: "Models", value: modelCount, Icon: Package },
                    { label: "Configs", value: configCount, Icon: FileJson },
                    { label: "Checkpoints", value: checkpointCount, Icon: ShieldCheck },
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

            <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Files
                    </div>
                    <h2 className="mt-1 text-lg font-black text-white">Artifacts by type</h2>
                  </div>

                  <span className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                    {fileCount} total
                  </span>
                </div>

                {fileCount === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm text-slate-500">
                    No files were returned for this run.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {Object.entries(grouped).map(([kind, files]) => (
                      <div key={kind}>
                        <div className="mb-3 flex items-center gap-2">
                          <Box className="h-4 w-4 text-purple-300" />
                          <h3 className="text-sm font-black uppercase tracking-wide text-slate-300">
                            {kind}
                          </h3>
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-slate-400">
                            {files.length}
                          </span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          {files.map((file) => {
                            const Icon = fileIcon(file);

                            return (
                              <div
                                key={file}
                                className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                                    <Icon className="h-5 w-5 text-purple-200" />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="break-words text-sm font-semibold text-white">
                                      {file}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">{fileKind(file)}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <aside className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-5 shadow-xl shadow-slate-950/20">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                    Why it matters
                  </div>
                  <h2 className="text-xl font-black text-white">Evidence for reproducibility</h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    This page helps connect the deployed app to the underlying trained models,
                    configs, checkpoints, and metadata.
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      "Shows saved ML artifacts",
                      "Links product UI to training output",
                      "Prepares for metric-level run comparison",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-950/45 p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                        <span className="text-sm text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                    Next step
                  </div>
                  <h2 className="text-base font-black text-white">Connect evaluation results</h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    After your 50-match evaluations are complete, this page can show run-level
                    win rates, draw rates, average goal difference, and matchup links.
                  </p>
                </div>
              </aside>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
