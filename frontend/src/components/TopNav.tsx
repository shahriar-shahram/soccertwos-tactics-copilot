import { Link, useLocation } from "react-router-dom";
import {
  BrainCircuit,
  GitCompare,
  HelpCircle,
  Home,
  MessageSquare,
  PlayCircle,
  Trophy,
} from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/how-it-works", label: "How It Works", icon: HelpCircle },
  { to: "/compare", label: "Compare", icon: GitCompare },
  { to: "/replay", label: "Replay", icon: PlayCircle },
  { to: "/copilot", label: "Ask AI", icon: MessageSquare },
  { to: "/runs", label: "Runs", icon: Trophy },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-5 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>

          <div className="leading-tight">
            <div className="font-display text-sm font-black text-white">SoccerTwos</div>
            <div className="text-xs text-slate-400">Policy Arena</div>
          </div>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center justify-center overflow-x-auto">
          <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-white/[0.035] p-1">
            {links.map((link) => {
              const active = location.pathname === link.to;
              const Icon = link.icon;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={[
                    "inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-white text-slate-950 shadow-lg shadow-white/10"
                      : "text-slate-300 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <Icon className={active ? "h-4 w-4 text-slate-950" : "h-4 w-4 text-slate-400"} />
                  <span className="font-display tracking-tight">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <Link
          to="/copilot"
          className="hidden shrink-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:scale-[1.02] md:inline-flex"
        >
          <span className="font-display tracking-tight">Try Copilot</span>
        </Link>
      </div>
    </header>
  );
}
