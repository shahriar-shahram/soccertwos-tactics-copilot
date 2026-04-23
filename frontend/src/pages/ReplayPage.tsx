import TopNav from "../components/TopNav";

export default function ReplayPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-3xl font-bold">Replay Viewer</h1>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          Replay canvas and timeline will go here.
        </div>
      </main>
    </div>
  );
}
