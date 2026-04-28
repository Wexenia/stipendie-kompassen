import { Scholarship } from "@/data/scholarships";
import { MatchResult } from "@/lib/matching";
import { Link } from "react-router-dom";
import { Building2, Calendar, Coins, ChevronRight } from "lucide-react";

export function CompactScholarshipRow({ scholarship: s, match }: { scholarship: Scholarship; match?: MatchResult }) {
  const deadline = new Date(s.deadline).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  return (
    <Link
      to={`/stipendier/${s.id}`}
      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/60 transition-colors active:scale-[0.99]"
    >
      <div className="h-11 w-11 shrink-0 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
        {match ? `${match.score}%` : <Coins className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm leading-tight truncate">{s.name}</p>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
          <span className="truncate">{s.amount.toLocaleString("sv-SE")} kr</span>
          <span>·</span>
          <Calendar className="h-3 w-3" />
          <span>{deadline}</span>
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </Link>
  );
}

export function ScholarshipListCard({ scholarship: s, match }: { scholarship: Scholarship; match?: MatchResult }) {
  const deadline = new Date(s.deadline).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  return (
    <Link
      to={`/stipendier/${s.id}`}
      className="block p-4 bg-card rounded-2xl border border-border/70 shadow-soft hover:shadow-card active:scale-[0.99] transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] leading-snug">{s.name}</h3>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Building2 className="h-3 w-3" /> {s.organization}
          </p>
        </div>
        {match && (
          <div className="shrink-0 h-10 w-10 rounded-full bg-primary-soft text-primary text-[11px] font-bold flex items-center justify-center">
            {match.score}%
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 font-semibold text-foreground">
          <Coins className="h-3.5 w-3.5 text-accent" />
          {s.amount.toLocaleString("sv-SE")} kr
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {deadline}
        </span>
      </div>

      {match?.explanation && (
        <p className="mt-2.5 text-[12px] text-muted-foreground leading-snug line-clamp-2">{match.explanation}</p>
      )}

      <div className="mt-2.5 flex flex-wrap gap-1">
        {s.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
