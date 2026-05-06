import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { loadSavedIds, toggleSaved } from "@/lib/storage";
import AppScreen from "@/components/layout/AppScreen";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkX, Building2, Coins, Calendar, ChevronRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { ApplicationStatusBadge } from "@/components/StatusBadge";

export default function Saved() {
  const t = useT();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setIds(loadSavedIds());
    refresh();
    window.addEventListener("stipendia:update", refresh);
    return () => window.removeEventListener("stipendia:update", refresh);
  }, []);

  const items = ids.map((id) => SCHOLARSHIPS.find((s) => s.id === id)).filter(Boolean) as typeof SCHOLARSHIPS;

  return (
    <AppScreen title={t("saved.title")}>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-8 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-accent-soft text-accent-foreground flex items-center justify-center mb-3">
            <Bookmark className="h-7 w-7" />
          </div>
          <p className="text-sm text-muted-foreground">{t("saved.empty")}</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/stipendier">{t("saved.cta")}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((s) => {
            const deadline = new Date(s.deadline).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
            return (
              <div key={s.id} className="block p-4 bg-card rounded-2xl border border-border/70 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[15px] leading-snug">{s.name}</h3>
                  <button onClick={() => toggleSaved(s.id)} className="text-muted-foreground hover:text-destructive" aria-label={t("common.delete")}>
                    <BookmarkX className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[12px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3 w-3" /> {s.organization}
                </p>
                <div className="mt-2.5 flex items-center gap-3 text-xs flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-foreground"><Coins className="h-3.5 w-3.5 text-primary" />{s.amount.toLocaleString("sv-SE")} kr</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3.5 w-3.5" />{deadline}</span>
                  <ApplicationStatusBadge scholarship={s} />
                </div>
                <Button asChild size="sm" variant="outline" className="mt-3 w-full rounded-xl gap-1">
                  <Link to={`/stipendier/${s.id}`}>{t("sch.details")} <ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </AppScreen>
  );
}
