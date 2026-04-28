import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { matchAll } from "@/lib/matching";
import { loadProfile } from "@/lib/storage";
import AppScreen from "@/components/layout/AppScreen";
import { ScholarshipListCard } from "@/components/ScholarshipRow";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { StudentProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface Props { matchedMode?: boolean }

const SORTS = [
  { id: "match", label: "Matchning" },
  { id: "deadline", label: "Deadline" },
  { id: "amount", label: "Belopp" },
] as const;

export default function Scholarships({ matchedMode = false }: Props) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<typeof SORTS[number]["id"]>(matchedMode ? "match" : "deadline");
  const [tag, setTag] = useState<string>("Alla");

  useEffect(() => {
    const refresh = () => setProfile(loadProfile());
    refresh();
    window.addEventListener("stipendia:update", refresh);
    return () => window.removeEventListener("stipendia:update", refresh);
  }, []);

  const allTags = useMemo(
    () => ["Alla", ...Array.from(new Set(SCHOLARSHIPS.flatMap((s) => s.tags))).sort()],
    []
  );

  const matches = useMemo(() => {
    if (!profile) {
      return SCHOLARSHIPS.map((s) => ({ scholarship: s, score: 0, matched: [], missing: [], explanation: "" }));
    }
    return matchAll(profile, SCHOLARSHIPS);
  }, [profile]);

  const filtered = useMemo(() => {
    let list = matches.filter((m) => {
      if (tag !== "Alla" && !m.scholarship.tags.includes(tag)) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          m.scholarship.name.toLowerCase().includes(q) ||
          m.scholarship.organization.toLowerCase().includes(q) ||
          m.scholarship.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    if (sort === "match") list = [...list].sort((a, b) => b.score - a.score);
    if (sort === "amount") list = [...list].sort((a, b) => b.scholarship.amount - a.scholarship.amount);
    if (sort === "deadline")
      list = [...list].sort((a, b) => new Date(a.scholarship.deadline).getTime() - new Date(b.scholarship.deadline).getTime());

    return list;
  }, [matches, query, sort, tag]);

  return (
    <AppScreen title={matchedMode ? "Mina matchningar" : "Stipendier"} subtitle={`${filtered.length} stipendier`}>
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök stipendium eller organisation..."
            className="pl-9 rounded-2xl h-11 bg-secondary border-transparent"
          />
        </div>

        {/* Sort chips */}
        <div className="flex gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              disabled={s.id === "match" && !profile}
              className={cn(
                "flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                sort === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
                s.id === "match" && !profile && "opacity-40 cursor-not-allowed"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Tag chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={cn(
                "shrink-0 px-3 py-1 rounded-full text-[11px] font-medium border transition-colors",
                tag === t
                  ? "bg-primary-soft text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {!profile && matchedMode && (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-center">
            <p className="text-sm text-muted-foreground">Skapa din profil för personliga matchningar.</p>
            <Link to="/profil" className="inline-block mt-2 text-sm font-semibold text-primary">
              Skapa profil →
            </Link>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">Inga stipendier matchar dina filter.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((m) => (
              <ScholarshipListCard
                key={m.scholarship.id}
                scholarship={m.scholarship}
                match={profile ? m : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </AppScreen>
  );
}
