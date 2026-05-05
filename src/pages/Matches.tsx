import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { matchAll, MatchResult } from "@/lib/matching";
import { loadProfile } from "@/lib/storage";
import AppScreen from "@/components/layout/AppScreen";
import { Button } from "@/components/ui/button";
import { Sparkles, Building2, Coins, Calendar, CheckCircle2, FileEdit, ExternalLink, UserPlus } from "lucide-react";
import { StudentProfile } from "@/types/profile";

export default function Matches() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const refresh = () => setProfile(loadProfile());
    refresh();
    window.addEventListener("stipendia:update", refresh);
    return () => window.removeEventListener("stipendia:update", refresh);
  }, []);

  const matches = useMemo(() => {
    if (!profile) return [] as MatchResult[];
    return matchAll(profile, SCHOLARSHIPS).filter((m) => m.score >= 30);
  }, [profile]);

  const best = matches.filter((m) => m.score >= 70);
  const possible = matches.filter((m) => m.score < 70);

  if (!profile) {
    return (
      <AppScreen title="Mina matchningar" subtitle="Personliga rekommendationer">
        <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-8 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-3">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="font-semibold text-base">Fyll i din profil för att få personliga matchningar</h2>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            När du beskrivit dina studier och intressen analyserar vi vilka stipendier som passar
            dig bäst — och förklarar varför.
          </p>
          <Button onClick={() => navigate("/profil")} className="mt-4 rounded-xl gap-2">
            <UserPlus className="h-4 w-4" /> Skapa profil
          </Button>
        </div>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      title="Mina matchningar"
      subtitle={`${matches.length} stipendier för din profil`}
    >
      <div className="space-y-5">
        {matches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Vi hittade inga starka matchningar än. Komplettera din profil för bättre resultat.
            </p>
            <Button onClick={() => navigate("/profil")} variant="outline" className="mt-3 rounded-xl">
              Uppdatera profil
            </Button>
          </div>
        )}

        {best.length > 0 && (
          <Group title="Bästa matchningar" subtitle="Stipendier som passar dig särskilt väl">
            {best.map((m) => (
              <MatchCard key={m.scholarship.id} match={m} />
            ))}
          </Group>
        )}

        {possible.length > 0 && (
          <Group title="Möjliga matchningar" subtitle="Värt att kolla — du uppfyller delvis kriterierna">
            {possible.map((m) => (
              <MatchCard key={m.scholarship.id} match={m} />
            ))}
          </Group>
        )}
      </div>
    </AppScreen>
  );
}

function Group({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="px-1 mb-2">
        <h2 className="font-semibold text-[15px]">{title}</h2>
        <p className="text-[12px] text-muted-foreground">{subtitle}</p>
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function MatchCard({ match: m }: { match: MatchResult }) {
  const s = m.scholarship;
  const deadline = new Date(s.deadline).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  return (
    <div className="p-4 bg-card rounded-2xl border border-border/70 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/stipendier/${s.id}`} className="block">
            <h3 className="font-semibold text-[15px] leading-snug hover:text-primary transition-colors">{s.name}</h3>
          </Link>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Building2 className="h-3 w-3" /> {s.organization}
          </p>
        </div>
        <div className="shrink-0 h-12 w-12 rounded-2xl bg-primary text-primary-foreground text-sm font-bold flex flex-col items-center justify-center leading-none">
          <span>{m.score}%</span>
          <span className="text-[8px] font-medium opacity-80 mt-0.5">match</span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 font-semibold">
          <Coins className="h-3.5 w-3.5 text-accent" />
          {s.amount.toLocaleString("sv-SE")} kr
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {deadline}
        </span>
      </div>

      {m.matched.length > 0 && (
        <div className="mt-3 rounded-xl bg-primary-soft/60 border border-primary/10 p-2.5">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Varför matchar du?
          </p>
          <ul className="mt-1.5 space-y-1">
            {m.matched.slice(0, 3).map((reason, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-foreground/80">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button asChild size="sm" className="rounded-xl gap-1">
          <a href={s.applicationUrl} target="_blank" rel="noreferrer">
            Ansök <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="rounded-xl gap-1">
          <Link to={`/utkast/${s.id}`}>
            <FileEdit className="h-3.5 w-3.5" /> Skapa utkast
          </Link>
        </Button>
      </div>
    </div>
  );
}
