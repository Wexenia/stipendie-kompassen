import { Link, useParams } from "react-router-dom";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { loadProfile, loadSavedIds, toggleSaved } from "@/lib/storage";
import { matchScholarship } from "@/lib/matching";
import AppScreen from "@/components/layout/AppScreen";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Coins, ExternalLink, FileText, CheckCircle2, AlertCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScholarshipDetail() {
  const { id } = useParams();
  const s = SCHOLARSHIPS.find((x) => x.id === id);
  const profile = loadProfile();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) setSaved(loadSavedIds().includes(id));
  }, [id]);

  if (!s) {
    return (
      <AppScreen title="Stipendium" back>
        <p className="text-sm text-muted-foreground text-center py-10">Stipendiet hittades inte.</p>
      </AppScreen>
    );
  }

  const match = profile ? matchScholarship(profile, s) : null;
  const ownedDocs = profile?.dokument;
  const docKeyMap: Record<string, keyof NonNullable<typeof ownedDocs>> = {
    "Studieintyg": "studieintyg",
    "CV": "cv",
    "Personligt brev": "personligtBrev",
    "Rekommendationsbrev": "rekommendationsbrev",
  };

  const deadline = new Date(s.deadline).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <AppScreen
      title={s.name}
      back
      right={
        <button
          onClick={() => setSaved(toggleSaved(s.id).includes(s.id))}
          className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary text-foreground"
          aria-label="Spara"
        >
          {saved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
        </button>
      }
    >
      <div className="space-y-3">
        {/* Hero card */}
        <div className="rounded-3xl bg-warm-gradient text-primary-foreground p-4">
          <p className="text-[11px] opacity-80 flex items-center gap-1">
            <Building2 className="h-3 w-3" /> {s.organization}
          </p>
          <h2 className="font-bold text-lg mt-0.5 leading-tight">{s.name}</h2>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] opacity-80 uppercase font-semibold">Belopp</p>
              <p className="text-2xl font-bold leading-none">{s.amount.toLocaleString("sv-SE")} kr</p>
            </div>
            {match && (
              <div className="text-right">
                <p className="text-[10px] opacity-80 uppercase font-semibold">Matchning</p>
                <p className="text-2xl font-bold leading-none">{match.score}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-2 gap-2">
          <InfoTile icon={Calendar} label="Sista ansökan" value={deadline} />
          <InfoTile icon={FileText} label="Dokument" value={`${s.requiredDocuments.length} st krävs`} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {s.tags.map((t) => (
            <span key={t} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        {/* Description */}
        <Section title="Beskrivning">
          <p className="text-sm text-foreground/85 leading-relaxed">{s.description}</p>
        </Section>

        {/* Criteria */}
        <Section title="Behörighetskriterier">
          <ul className="space-y-1.5">
            {s.criteria.map((c) => (
              <li key={c} className="flex gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/85">{c}</span>
              </li>
            ))}
          </ul>
        </Section>

        {match && (
          <>
            <Section title="Varför du matchar" tone="success">
              {match.matched.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {match.matched.map((m) => (
                    <li key={m} className="text-foreground/85">• {m}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Begränsad matchning på din profil.</p>
              )}
            </Section>

            {match.missing.length > 0 && (
              <Section title="Att kontrollera" tone="warning">
                <ul className="space-y-1 text-sm">
                  {match.missing.map((m) => (
                    <li key={m} className="text-foreground/85">• {m}</li>
                  ))}
                </ul>
              </Section>
            )}
          </>
        )}

        {/* Required docs checklist */}
        <Section title="Checklista – dokument">
          <div className="space-y-1.5">
            {s.requiredDocuments.map((d) => {
              const key = docKeyMap[d];
              const owned = key && ownedDocs ? ownedDocs[key] : false;
              return (
                <div key={d} className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2.5">
                  <span className="text-sm font-medium">{d}</span>
                  {owned ? (
                    <span className="text-[11px] font-semibold text-success flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Du har detta
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-muted-foreground">Saknas</span>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* CTAs */}
        <div className="space-y-2 pt-1">
          <Button asChild className="w-full rounded-xl shadow-glow h-12">
            <Link to={`/utkast/${s.id}`}>
              <FileText className="h-4 w-4 mr-1.5" /> Skapa ansökningsutkast
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-xl h-11">
            <a href={s.applicationUrl} target="_blank" rel="noreferrer">
              Till officiell ansökan <ExternalLink className="h-4 w-4 ml-1.5" />
            </a>
          </Button>
        </div>
      </div>
    </AppScreen>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-3">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-semibold">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 font-semibold text-sm leading-tight">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "success" | "warning";
}) {
  const toneCls =
    tone === "success"
      ? "border-success/30 bg-success-soft/40"
      : tone === "warning"
      ? "border-warning/40 bg-warning/10"
      : "border-border/60 bg-card";
  const iconCls =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
  return (
    <section className={`rounded-3xl border p-4 ${toneCls}`}>
      <h3 className={`font-semibold text-sm mb-2 flex items-center gap-1.5 ${iconCls}`}>
        {tone === "success" && <CheckCircle2 className="h-4 w-4" />}
        {tone === "warning" && <AlertCircle className="h-4 w-4" />}
        <span className={tone ? "" : "text-foreground"}>{title}</span>
      </h3>
      {children}
    </section>
  );
}
