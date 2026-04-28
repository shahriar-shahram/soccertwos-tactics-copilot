import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/compare", label: "Arena" },
  { to: "/replay", label: "Baseline Replay" },
  { to: "/copilot", label: "Copilot" },
  { to: "/how-it-works", label: "Methodology" },
];

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-[#f8faf7]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-600/20">
            S2
          </div>
          <div>
            <div className="text-base font-black leading-none text-slate-950">
              SoccerTwos
            </div>
            <div className="text-xs font-semibold text-emerald-700">
              Policy Arena
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-full px-4 py-2 text-sm font-bold transition",
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-600 hover:bg-white hover:text-emerald-700",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
