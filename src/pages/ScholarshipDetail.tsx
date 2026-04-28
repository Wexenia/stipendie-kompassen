import { Link, useNavigate, useParams } from "react-router-dom";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { loadProfile, loadSavedIds, toggleSaved } from "@/lib/storage";
import { matchScholarship } from "@/lib/matching";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Calendar, Coins, ExternalLink, FileText, CheckCircle2, AlertCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { MatchBadge } from "@/components/MatchBadge";
import { useEffect, useState } from "react";

export default function ScholarshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const s = SCHOLARSHIPS.find((x) => x.id === id);
  const profile = loadProfile();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) setSaved(loadSavedIds().includes(id));
  }, [id]);

  if (!s) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Stipendiet hittades inte.</p>
        <Button asChild variant="outline" className="mt-4 rounded-xl">
          <Link to="/stipendier">Tillbaka</Link>
        </Button>
      </div>
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
    <div className="container py-8 md:py-12 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-3">
        <ArrowLeft className="mr-1 h-4 w-4" /> Tillbaka
      </Button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{s.name}</h1>
          <p className="mt-2 text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> {s.organization}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {s.tags.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => setSaved(toggleSaved(s.id).includes(s.id))}
        >
          {saved ? <><BookmarkCheck className="h-4 w-4 mr-1.5 text-primary" /> Sparat</> : <><Bookmark className="h-4 w-4 mr-1.5" /> Spara</>}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <InfoTile icon={Coins} label="Belopp" value={`${s.amount.toLocaleString("sv-SE")} kr`} accent />
        <InfoTile icon={Calendar} label="Sista ansökan" value={deadline} />
        <InfoTile icon={FileText} label="Dokument" value={`${s.requiredDocuments.length} st krävs`} />
      </div>

      {match && (
        <Card className="rounded-2xl shadow-soft mb-6 border-primary/20 bg-primary-soft/40">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-semibold text-lg">Din matchning</h2>
                <p className="text-sm text-muted-foreground mt-1">{match.explanation}</p>
              </div>
              <MatchBadge score={match.score} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl shadow-soft mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">Beskrivning</h2>
          <p className="text-foreground/80 leading-relaxed">{s.description}</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">Behörighetskriterier</h2>
          <ul className="space-y-2">
            {s.criteria.map((c) => (
              <li key={c} className="flex gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {match && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="rounded-2xl shadow-soft border-success/30">
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" /> Varför du matchar</h3>
              {match.matched.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {match.matched.map((m) => <li key={m} className="text-foreground/80">• {m}</li>)}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Begränsad matchning på din profil.</p>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-soft border-warning/30">
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2"><AlertCircle className="h-5 w-5 text-warning" /> Att kontrollera</h3>
              {match.missing.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {match.missing.map((m) => <li key={m} className="text-foreground/80">• {m}</li>)}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Inga uppenbara hinder identifierade.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="rounded-2xl shadow-soft mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg">Checklista – dokument som krävs</h2>
          <div className="mt-4 space-y-2">
            {s.requiredDocuments.map((d) => {
              const key = docKeyMap[d];
              const owned = key && ownedDocs ? ownedDocs[key] : false;
              return (
                <div key={d} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
                  <span className="text-sm font-medium">{d}</span>
                  {owned ? (
                    <span className="text-xs font-semibold text-success flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Du har detta
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">Saknas</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="rounded-xl flex-1 shadow-glow">
          <Link to={`/utkast/${s.id}`}>
            <FileText className="h-4 w-4 mr-1.5" /> Skapa ansökningsutkast
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-xl flex-1">
          <a href={s.applicationUrl} target="_blank" rel="noreferrer">
            Till officiell ansökan <ExternalLink className="h-4 w-4 ml-1.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, accent }: any) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "bg-accent-soft border-accent/20" : "bg-card border-border"}`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-1 font-semibold text-foreground">{value}</div>
    </div>
  );
}
