import TopNav from "../components/TopNav";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-4xl font-bold">Azure SoccerTwos Tactics Copilot</h1>
        <p className="max-w-3xl text-slate-300">
          A product project combining Deep RL, replay analytics, and RAG-based tactical explanations.
        </p>
      </main>
    </div>
  );
}
