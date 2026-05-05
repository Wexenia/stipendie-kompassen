import { NavLink } from "react-router-dom";
import { Home, User, Search, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export default function BottomTabs() {
  const t = useT();
  const TABS = [
    { to: "/", label: t("nav.home"), icon: Home, end: true },
    { to: "/profil", label: t("nav.profile"), icon: User },
    { to: "/stipendier", label: t("nav.scholarships"), icon: Search },
    { to: "/matchningar", label: t("nav.matches"), icon: Sparkles },
    { to: "/installningar", label: t("nav.settings"), icon: Settings },
  ];
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
