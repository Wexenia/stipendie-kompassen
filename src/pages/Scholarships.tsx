import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { matchAll } from "@/lib/matching";
import { loadProfile } from "@/lib/storage";
import ScholarshipCard from "@/components/ScholarshipCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { StudentProfile } from "@/types/profile";

interface Props { matchedMode?: boolean }

export default function Scholarships({ matchedMode = false }: Props) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"match" | "deadline" | "amount">(matchedMode ? "match" : "deadline");
  const [tag, setTag] = useState<string>("all");

  useEffect(() => {
    const refresh = () => setProfile(loadProfile());
    refresh();
    window.addEventListener("stipendia:update", refresh);
    return () => window.removeEventListener("stipendia:update", refresh);
  }, []);

  const allTags = useMemo(() => Array.from(new Set(SCHOLARSHIPS.flatMap((s) => s.tags))).sort(), []);

  const matches = useMemo(() => {
    if (!profile) {
      return SCHOLARSHIPS.map((s) => ({ scholarship: s, score: 0, matched: [], missing: [], explanation: "" }));
    }
    return matchAll(profile, SCHOLARSHIPS);
  }, [profile]);

  const filtered = useMemo(() => {
    let list = matches.filter((m) => {
      if (tag !== "all" && !m.scholarship.tags.includes(tag)) return false;
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
      list = [...list].sort(
        (a, b) => new Date(a.scholarship.deadline).getTime() - new Date(b.scholarship.deadline).getTime()
      );

    return list;
  }, [matches, query, sort, tag]);

  return (
    <div className="container py-10 md:py-14">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {matchedMode ? "Mina matchningar" : "Stipendier"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {profile
              ? `Vi visar ${filtered.length} stipendier sorterade efter ${
                  sort === "match" ? "matchning" : sort === "amount" ? "belopp" : "deadline"
                }.`
              : "Skapa din profil för att se personliga matchningar med förklaring."}
          </p>
        </div>
        {!profile && (
          <Button asChild className="rounded-xl">
            <Link to="/profil">Skapa profil</Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök stipendium, organisation eller tagg..."
            className="pl-9 rounded-xl h-11"
          />
        </div>
        <Select value={sort} onValueChange={(v: any) => setSort(v)}>
          <SelectTrigger className="w-full md:w-[200px] rounded-xl h-11">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match" disabled={!profile}>Högst matchning</SelectItem>
            <SelectItem value="deadline">Deadline snarast</SelectItem>
            <SelectItem value="amount">Högst belopp</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tag} onValueChange={setTag}>
          <SelectTrigger className="w-full md:w-[200px] rounded-xl h-11">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla kategorier</SelectItem>
            {allTags.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-12 text-center">
          <p className="text-muted-foreground">Inga stipendier matchar dina filter.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <ScholarshipCard
              key={m.scholarship.id}
              scholarship={m.scholarship}
              match={profile ? m : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
