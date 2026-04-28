import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadDrafts, loadProfile, loadSavedIds, deleteDraft } from "@/lib/storage";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { matchAll } from "@/lib/matching";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Bookmark, Calendar, AlertCircle, Trash2, ChevronRight } from "lucide-react";
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
    .slice(0, 4);

  const missingDocs: string[] = [];
  if (profile) {
    const d = profile.dokument;
    if (!d.studieintyg) missingDocs.push("Studieintyg");
    if (!d.cv) missingDocs.push("CV");
    if (!d.personligtBrev) missingDocs.push("Personligt brev");
    if (!d.rekommendationsbrev) missingDocs.push("Rekommendationsbrev");
  }

  const topMatch = profile ? matchAll(profile, SCHOLARSHIPS)[0] : null;

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Mina ansökningar</h1>
        <p className="mt-2 text-muted-foreground">Översikt över din profil, sparade stipendier och pågående utkast.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card className="rounded-2xl shadow-soft lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><User className="h-4 w-4" /> Min profil</div>
            {profile ? (
              <>
                <h3 className="mt-2 font-semibold text-lg">{profile.namn || "Ingen profil"}</h3>
                <p className="text-sm text-muted-foreground">{profile.program}</p>
                <p className="text-sm text-muted-foreground">{profile.universitet}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {profile.amnesomrade && <Badge variant="secondary" className="rounded-full">{profile.amnesomrade}</Badge>}
                  {profile.studieort && <Badge variant="secondary" className="rounded-full">{profile.studieort}</Badge>}
                  {profile.termin && <Badge variant="secondary" className="rounded-full">{profile.termin}</Badge>}
                </div>
                <Button asChild variant="outline" size="sm" className="mt-4 rounded-lg w-full">
                  <Link to="/profil">Redigera profil</Link>
                </Button>
              </>
            ) : (
              <EmptyInline label="Du har ingen profil ännu." cta="Skapa profil" to="/profil" />
            )}
          </CardContent>
        </Card>

        {/* Top match teaser */}
        <Card className="rounded-2xl shadow-soft lg:col-span-2 bg-primary-gradient text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm opacity-90">Bästa matchning</div>
            {topMatch ? (
              <>
                <h3 className="mt-1 text-2xl font-bold">{topMatch.scholarship.name}</h3>
                <p className="opacity-90 mt-1 text-sm">{topMatch.explanation}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-3xl font-bold">{topMatch.score}%</span>
                  <Button asChild variant="secondary" className="rounded-lg ml-auto">
                    <Link to={`/stipendier/${topMatch.scholarship.id}`}>Visa <ChevronRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="mt-2 opacity-90">Skapa profil för att se din bästa matchning.</p>
            )}
          </CardContent>
        </Card>

        {/* Saved */}
        <Card className="rounded-2xl shadow-soft lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><Bookmark className="h-4 w-4" /> Sparade stipendier</div>
            {savedScholarships.length === 0 ? (
              <EmptyInline label="Du har inte sparat några stipendier." cta="Utforska stipendier" to="/stipendier" />
            ) : (
              <ul className="divide-y divide-border">
                {savedScholarships.map((s) => (
                  <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/stipendier/${s.id}`} className="font-medium hover:text-primary truncate block">{s.name}</Link>
                      <p className="text-xs text-muted-foreground">{s.amount.toLocaleString("sv-SE")} kr · {new Date(s.deadline).toLocaleDateString("sv-SE")}</p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="rounded-lg shrink-0">
                      <Link to={`/utkast/${s.id}`}>Skriv utkast</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Deadlines */}
        <Card className="rounded-2xl shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><Calendar className="h-4 w-4" /> Kommande deadlines</div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">Spara stipendier för att se deadlines här.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((s) => (
                  <li key={s.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                    <Link to={`/stipendier/${s.id}`} className="text-sm font-medium hover:text-primary truncate pr-2">{s.name}</Link>
                    <span className="text-xs text-muted-foreground shrink-0">{new Date(s.deadline).toLocaleDateString("sv-SE")}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Drafts */}
        <Card className="rounded-2xl shadow-soft lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><FileText className="h-4 w-4" /> Sparade utkast</div>
            {drafts.length === 0 ? (
              <EmptyInline label="Inga utkast sparade ännu." cta="Skapa ett utkast" to="/matchningar" />
            ) : (
              <ul className="divide-y divide-border">
                {drafts.map((d) => (
                  <li key={d.scholarshipId} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{d.scholarshipName}</p>
                      <p className="text-xs text-muted-foreground">Uppdaterad {new Date(d.updatedAt).toLocaleString("sv-SE")}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button asChild size="sm" variant="outline" className="rounded-lg">
                        <Link to={`/utkast/${d.scholarshipId}`}>Öppna</Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteDraft(d.scholarshipId)} className="rounded-lg text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Missing docs */}
        <Card className="rounded-2xl shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><AlertCircle className="h-4 w-4" /> Dokument att fixa</div>
            {!profile ? (
              <p className="text-sm text-muted-foreground">Skapa profil för att se vilka dokument du saknar.</p>
            ) : missingDocs.length === 0 ? (
              <p className="text-sm text-success font-medium">Du har alla standarddokument!</p>
            ) : (
              <ul className="space-y-2">
                {missingDocs.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" /> {d}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyInline({ label, cta, to }: { label: string; cta: string; to: string }) {
  return (
    <div className="text-sm text-muted-foreground">
      <p>{label}</p>
      <Button asChild size="sm" variant="outline" className="mt-3 rounded-lg">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}
