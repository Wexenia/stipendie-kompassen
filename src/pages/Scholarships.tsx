import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SCHOLARSHIPS, Scholarship } from "@/data/scholarships";
import AppScreen from "@/components/layout/AppScreen";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2, Coins, Calendar, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet";

const DEADLINE_OPTIONS = [
  { id: "all", label: "Alla" },
  { id: "30", label: "Inom 30 dagar" },
  { id: "90", label: "Inom 3 mån" },
  { id: "365", label: "Inom 1 år" },
] as const;

const AMOUNT_OPTIONS = [
  { id: "all", label: "Alla", min: 0 },
  { id: "10000", label: "10 000+", min: 10000 },
  { id: "25000", label: "25 000+", min: 25000 },
  { id: "50000", label: "50 000+", min: 50000 },
] as const;

const SORT_OPTIONS = [
  { id: "deadline", label: "Deadline" },
  { id: "amount", label: "Belopp" },
  { id: "name", label: "Namn" },
] as const;

export default function Scholarships() {
  const t = useT();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("Alla");
  const [deadlineFilter, setDeadlineFilter] = useState<typeof DEADLINE_OPTIONS[number]["id"]>("all");
  const [amountFilter, setAmountFilter] = useState<typeof AMOUNT_OPTIONS[number]["id"]>("all");
  const [universityFilter, setUniversityFilter] = useState<string>("Alla");
  const [locationFilter, setLocationFilter] = useState<string>("Alla");
  const [purposeFilter, setPurposeFilter] = useState<string>("Alla");
  const [sort, setSort] = useState<typeof SORT_OPTIONS[number]["id"]>("deadline");
  const [open, setOpen] = useState(false);

  const allTags = useMemo(() => ["Alla", ...Array.from(new Set(SCHOLARSHIPS.flatMap((s) => s.tags))).sort()], []);
  const allUnis = useMemo(() => ["Alla", ...Array.from(new Set(SCHOLARSHIPS.flatMap((s) => s.eligibleUniversities))).sort()], []);
  const allLocs = useMemo(() => ["Alla", ...Array.from(new Set(SCHOLARSHIPS.flatMap((s) => s.eligibleLocations))).sort()], []);
  const allPurposes = useMemo(() => ["Alla", ...Array.from(new Set(SCHOLARSHIPS.flatMap((s) => s.purposes ?? []))).sort()], []);

  const filtered = useMemo(() => {
    const now = Date.now();
    let list: Scholarship[] = SCHOLARSHIPS.filter((s) => {
      if (tag !== "Alla" && !s.tags.includes(tag)) return false;
      if (universityFilter !== "Alla" && !s.eligibleUniversities.includes(universityFilter)) return false;
      if (locationFilter !== "Alla" && !s.eligibleLocations.includes(locationFilter)) return false;
      if (purposeFilter !== "Alla" && !(s.purposes ?? []).includes(purposeFilter)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hit = s.name.toLowerCase().includes(q) || s.organization.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (deadlineFilter !== "all") {
        const days = parseInt(deadlineFilter);
        const diff = (new Date(s.deadline).getTime() - now) / 86400000;
        if (diff < 0 || diff > days) return false;
      }
      const minAmount = AMOUNT_OPTIONS.find((a) => a.id === amountFilter)?.min ?? 0;
      if (s.amount < minAmount) return false;
      return true;
    });

    if (sort === "amount") list = [...list].sort((a, b) => b.amount - a.amount);
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "sv"));
    else list = [...list].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return list;
  }, [query, tag, deadlineFilter, amountFilter, universityFilter, locationFilter, purposeFilter, sort]);

  const activeFilterCount =
    (tag !== "Alla" ? 1 : 0) +
    (deadlineFilter !== "all" ? 1 : 0) +
    (amountFilter !== "all" ? 1 : 0) +
    (universityFilter !== "Alla" ? 1 : 0) +
    (locationFilter !== "Alla" ? 1 : 0) +
    (purposeFilter !== "Alla" ? 1 : 0);

  const resetFilters = () => {
    setTag("Alla"); setDeadlineFilter("all"); setAmountFilter("all");
    setUniversityFilter("Alla"); setLocationFilter("Alla"); setPurposeFilter("Alla");
  };

  const total = SCHOLARSHIPS.length;
  const hasFilter = activeFilterCount > 0 || query.length > 0;
  const subtitle = hasFilter
    ? t("sch.showFiltered", { n: filtered.length, t: total })
    : t("sch.showAll", { n: total });

  return (
    <AppScreen title={t("sch.title")} subtitle={subtitle}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("sch.searchPh")} className="pl-9 rounded-2xl h-11 bg-secondary border-transparent" />
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 rounded-2xl px-3 relative shrink-0" aria-label={t("sch.filter")}>
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left">{t("sch.filterTitle")}</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 py-4">
                <FilterGroup label={t("sch.f.category")}>
                  <ChipRow options={allTags.map((t) => ({ id: t, label: t }))} value={tag} onChange={setTag} />
                </FilterGroup>
                <FilterGroup label={t("sch.f.deadline")}>
                  <ChipRow options={DEADLINE_OPTIONS.map((o) => ({ id: o.id, label: o.label }))} value={deadlineFilter} onChange={(v) => setDeadlineFilter(v as any)} />
                </FilterGroup>
                <FilterGroup label={t("sch.f.amount")}>
                  <ChipRow options={AMOUNT_OPTIONS.map((o) => ({ id: o.id, label: o.label }))} value={amountFilter} onChange={(v) => setAmountFilter(v as any)} />
                </FilterGroup>
                <FilterGroup label={t("sch.f.university")}>
                  <ChipRow options={allUnis.map((u) => ({ id: u, label: u }))} value={universityFilter} onChange={setUniversityFilter} />
                </FilterGroup>
                <FilterGroup label={t("sch.f.location")}>
                  <ChipRow options={allLocs.map((l) => ({ id: l, label: l }))} value={locationFilter} onChange={setLocationFilter} />
                </FilterGroup>
                <FilterGroup label={t("sch.f.purpose")}>
                  <ChipRow options={allPurposes.map((p) => ({ id: p, label: p }))} value={purposeFilter} onChange={setPurposeFilter} />
                </FilterGroup>
                <FilterGroup label={t("sch.f.sort")}>
                  <ChipRow options={SORT_OPTIONS.map((o) => ({ id: o.id, label: o.label }))} value={sort} onChange={(v) => setSort(v as any)} />
                </FilterGroup>
              </div>
              <SheetFooter className="flex-row gap-2 sm:flex-row">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={resetFilters}>{t("sch.f.clear")}</Button>
                <Button className="flex-1 rounded-xl" onClick={() => setOpen(false)}>{t("sch.f.show")} {filtered.length}</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {tag !== "Alla" && <ActiveChip label={tag} onRemove={() => setTag("Alla")} />}
            {deadlineFilter !== "all" && <ActiveChip label={DEADLINE_OPTIONS.find((d) => d.id === deadlineFilter)!.label} onRemove={() => setDeadlineFilter("all")} />}
            {amountFilter !== "all" && <ActiveChip label={AMOUNT_OPTIONS.find((a) => a.id === amountFilter)!.label} onRemove={() => setAmountFilter("all")} />}
            {universityFilter !== "Alla" && <ActiveChip label={universityFilter} onRemove={() => setUniversityFilter("Alla")} />}
            {locationFilter !== "Alla" && <ActiveChip label={locationFilter} onRemove={() => setLocationFilter("Alla")} />}
            {purposeFilter !== "Alla" && <ActiveChip label={purposeFilter} onRemove={() => setPurposeFilter("Alla")} />}
            <button onClick={resetFilters} className="text-[11px] font-semibold text-primary px-2 py-1">{t("sch.f.clear")}</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("sch.noMatch")}</p>
            <button onClick={resetFilters} className="mt-2 text-sm font-semibold text-primary">{t("sch.f.clear")}</button>
          </div>
        ) : (
          <div className="space-y-2.5">{filtered.map((s) => <BrowseCard key={s.id} scholarship={s} />)}</div>
        )}
      </div>
    </AppScreen>
  );
}

function BrowseCard({ scholarship: s }: { scholarship: Scholarship }) {
  const t = useT();
  const deadline = new Date(s.deadline).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="block p-4 bg-card rounded-2xl border border-border/70 shadow-soft">
      <h3 className="font-semibold text-[15px] leading-snug">{s.name}</h3>
      <p className="text-[12px] text-muted-foreground flex items-center gap-1 mt-0.5">
        <Building2 className="h-3 w-3" /> {s.organization}
      </p>
      <div className="mt-2.5 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 font-semibold text-foreground">
          <Coins className="h-3.5 w-3.5 text-primary" />
          {s.amount.toLocaleString("sv-SE")} kr
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />{deadline}
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {s.tags.slice(0, 3).map((tg) => (
          <span key={tg} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{tg}</span>
        ))}
      </div>
      <Button asChild size="sm" variant="outline" className="mt-3 w-full rounded-xl gap-1">
        <Link to={`/stipendier/${s.id}`}>{t("sch.details")} <ChevronRight className="h-4 w-4" /></Link>
      </Button>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

function ChipRow({ options, value, onChange }: { options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
          value === o.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
        )}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-semibold">
      {label}
      <button onClick={onRemove} aria-label="Ta bort" className="hover:opacity-70"><X className="h-3 w-3" /></button>
    </span>
  );
}
