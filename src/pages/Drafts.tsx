import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadDrafts, loadProfile, loadSavedIds, deleteDraft } from "@/lib/storage";
import { SCHOLARSHIPS } from "@/data/scholarships";
import AppScreen from "@/components/layout/AppScreen";
import { Button } from "@/components/ui/button";
import { FileText, Bookmark, Calendar, AlertCircle, Trash2, ChevronRight } from "lucide-react";
import { StudentProfile, SavedDraft } from "@/types/profile";

export default function Drafts() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);

  useEffect(() => {
    const refresh = () => {
      setProfile(loadProfile());
      setSavedIds(loadSavedIds());
      setDrafts(loadDrafts());
    };
    refresh();
    window.addEventListener("stipendia:update", refresh);
    return () => window.removeEventListener("stipendia:update", refresh);
  }, []);

  const savedScholarships = SCHOLARSHIPS.filter((s) => savedIds.includes(s.id));
  const upcoming = [...SCHOLARSHIPS]
    .filter((s) => savedIds.includes(s.id) || drafts.some((d) => d.scholarshipId === s.id))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const missingDocs: string[] = [];
  if (profile) {
    const d = profile.dokument;
    if (!d.studieintyg) missingDocs.push("Studieintyg");
    if (!d.cv) missingDocs.push("CV");
    if (!d.personligtBrev) missingDocs.push("Personligt brev");
    if (!d.rekommendationsbrev) missingDocs.push("Rekommendationsbrev");
  }

  return (
    <AppScreen title="Mina ansökningar" subtitle="Sparade stipendier & utkast">
      <div className="space-y-3">
        {/* Drafts */}
        <Section icon={FileText} title="Sparade utkast" count={drafts.length}>
          {drafts.length === 0 ? (
            <Empty text="Inga utkast sparade ännu." cta="Bläddra stipendier" to="/stipendier" />
          ) : (
            <ul className="space-y-1.5">
              {drafts.map((d) => (
                <li key={d.scholarshipId} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-secondary/60">
                  <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{d.scholarshipName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(d.updatedAt).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost" className="rounded-lg h-8 px-2 text-xs">
                    <Link to={`/utkast/${d.scholarshipId}`}>Öppna</Link>
                  </Button>
                  <button
                    onClick={() => deleteDraft(d.scholarshipId)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Ta bort"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Saved */}
        <Section icon={Bookmark} title="Sparade stipendier" count={savedScholarships.length}>
          {savedScholarships.length === 0 ? (
            <Empty text="Du har inte sparat några stipendier." cta="Utforska" to="/stipendier" />
          ) : (
            <ul className="space-y-1">
              {savedScholarships.map((s) => (
                <li key={s.id}>
                  <Link to={`/stipendier/${s.id}`} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-secondary/60">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {s.amount.toLocaleString("sv-SE")} kr · {new Date(s.deadline).toLocaleDateString("sv-SE")}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Deadlines */}
        <Section icon={Calendar} title="Kommande deadlines">
          {upcoming.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-2">Spara stipendier för att se deadlines här.</p>
          ) : (
            <ul className="space-y-1.5">
              {upcoming.map((s) => {
                const d = new Date(s.deadline);
                return (
                  <li key={s.id}>
                    <Link to={`/stipendier/${s.id}`} className="flex items-center gap-2 p-2 rounded-xl hover:bg-secondary/60">
                      <div className="h-9 w-9 rounded-lg bg-accent-soft text-accent flex flex-col items-center justify-center leading-none shrink-0">
                        <span className="text-[9px] font-semibold uppercase">{d.toLocaleDateString("sv-SE", { month: "short" }).slice(0, 3)}</span>
                        <span className="text-xs font-bold">{d.getDate()}</span>
                      </div>
                      <p className="text-sm font-medium truncate flex-1">{s.name}</p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {/* Missing docs */}
        <Section icon={AlertCircle} title="Dokument att fixa">
          {!profile ? (
            <Empty text="Skapa profil för att se dina dokument." cta="Skapa profil" to="/profil" />
          ) : missingDocs.length === 0 ? (
            <p className="text-sm text-success font-medium px-2 py-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Du har alla standarddokument.</p>
          ) : (
            <ul className="space-y-1 px-2 py-1">
              {missingDocs.map((d) => (
                <li key={d} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" /> {d}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </AppScreen>
  );
}

function Section({
  icon: Icon,
  title,
  count,
  children,
}: {
  icon: any;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card rounded-3xl border border-border/60 shadow-soft p-3">
      <div className="flex items-center justify-between px-1.5 pt-0.5 pb-2">
        <h2 className="font-semibold text-sm flex items-center gap-1.5">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </h2>
        {typeof count === "number" && count > 0 && (
          <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ text, cta, to }: { text: string; cta: string; to: string }) {
  return (
    <div className="px-2 py-3 text-center">
      <p className="text-xs text-muted-foreground">{text}</p>
      <Link to={to} className="inline-block mt-1.5 text-xs font-semibold text-primary">
        {cta} →
      </Link>
    </div>
  );
}
