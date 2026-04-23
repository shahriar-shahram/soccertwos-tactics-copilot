import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/replay", label: "Replay" },
  { to: "/copilot", label: "Copilot" },
  { to: "/compare", label: "Compare" },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <nav className="flex gap-3 border-b border-white/10 bg-slate-900 px-6 py-4">
      <div className="mr-6 font-semibold">SoccerTwos Tactics Copilot</div>
      {links.map((link) => {
        const active = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`rounded-lg px-3 py-2 text-sm ${
              active ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
