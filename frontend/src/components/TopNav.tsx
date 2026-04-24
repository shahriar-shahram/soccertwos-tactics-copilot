import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/replay", label: "Replay" },
  { to: "/copilot", label: "Copilot" },
  { to: "/compare", label: "Compare" },
  { to: "/runs", label: "Runs" },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <div className="text-xl font-semibold tracking-tight text-white">
            SoccerTwos Tactics Copilot
          </div>
          <div className="text-xs text-slate-400">
            Azure AI Search + Azure OpenAI + RL analytics
          </div>
        </div>

        <div className="flex gap-3">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
