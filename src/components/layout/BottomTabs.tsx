import { NavLink } from "react-router-dom";
import { Home, User, Search, Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Hem", icon: Home, end: true },
  { to: "/profil", label: "Profil", icon: User },
  { to: "/stipendier", label: "Stipendier", icon: Search },
  { to: "/matchningar", label: "Matchningar", icon: Sparkles },
  { to: "/ansokningar", label: "Ansökningar", icon: FileText },
];

export default function BottomTabs() {
  return (
    <nav className="absolute bottom-0 inset-x-0 z-30 bg-app/95 backdrop-blur-xl border-t border-border/70 pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-stretch justify-around px-1 pt-1.5 pb-1.5">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-colors min-w-0",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full transition-all",
                      isActive && "bg-primary-soft"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  <span className="text-[10px] font-medium leading-none truncate max-w-full">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
