import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadDrafts, loadProfile, loadSavedIds } from "@/lib/storage";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { matchAll } from "@/lib/matching";
import { StudentProfile, SavedDraft } from "@/types/profile";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Search, FilePlus, FileText, ChevronRight, Sparkles, Calendar, Bell, GraduationCap } from "lucide-react";
import { CompactScholarshipRow } from "@/components/ScholarshipRow";

function profileCompleteness(p: StudentProfile | null): number {
  if (!p) return 0;
  const fields = [p.namn, p.universitet, p.program, p.amnesomrade, p.termin, p.studieort, p.hemort, p.engagemang, p.intressen, p.syfte, p.bakgrund];
  const filled = fields.filter((f) => f && f.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

export default function Home() {
  const navigate = useNavigate();
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

  const completeness = profileCompleteness(profile);
  const matches = profile ? matchAll(profile, SCHOLARSHIPS).slice(0, 3) : [];
  const upcoming = [...SCHOLARSHIPS]
    .filter((s) => savedIds.includes(s.id) || drafts.some((d) => d.scholarshipId === s.id))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);
  const fallbackUpcoming = upcoming.length === 0
    ? [...SCHOLARSHIPS].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 3)
    : upcoming;

  return (
    <div className="px-4 pt-5 space-y-4">
      {/* Greeting header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold leading-tight">Hej{profile?.namn ? `, ${profile.namn.split(" ")[0]}` : ""}! 👋</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Redo att hitta stipendier som passar dig?</p>
        </div>
        <button
          aria-label="Notiser"
          className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
      </header>

      {/* Profile completion card */}
      <div className="rounded-3xl bg-warm-gradient text-primary-foreground p-4 shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider opacity-80 font-semibold">Din profil</p>
            <p className="font-bold text-lg leading-tight mt-0.5">Profil {completeness}% klar</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3">
          <Progress value={completeness} className="h-1.5 bg-white/20 [&>div]:bg-white" />
        </div>
        <Button
          onClick={() => navigate("/profil")}
          className="mt-3 w-full rounded-xl bg-white text-primary hover:bg-white/90 font-semibold h-10"
        >
          {completeness === 0 ? "Skapa profil" : completeness === 100 ? "Uppdatera profil" : "Fortsätt skapa profil"}
        </Button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2">
        <QuickAction icon={Search} label="Sök stipendier" to="/stipendier" />
        <QuickAction icon={FilePlus} label="Skapa profil" to="/profil" />
        <QuickAction icon={FileText} label="Mina utkast" to="/ansokningar" />
      </div>

      {/* Best matches */}
      <SectionCard
        icon={Sparkles}
        title="Bästa matchningar"
        action={profile ? { label: "Se alla", to: "/matchningar" } : undefined}
      >
        {profile ? (
          matches.length > 0 ? (
            <div className="-mx-1.5">
              {matches.map((m) => (
                <CompactScholarshipRow key={m.scholarship.id} scholarship={m.scholarship} match={m} />
              ))}
            </div>
          ) : (
            <Empty text="Inga matchningar än." />
          )
        ) : (
          <Empty text="Skapa din profil för personliga matchningar." cta="Kom igång" to="/profil" />
        )}
      </SectionCard>

      {/* Deadlines */}
      <SectionCard icon={Calendar} title="Kommande deadlines">
        <ul className="space-y-1.5">
          {fallbackUpcoming.map((s) => {
            const d = new Date(s.deadline);
            const days = Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
            return (
              <li key={s.id}>
                <Link
                  to={`/stipendier/${s.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/60"
                >
                  <div className="h-10 w-10 rounded-xl bg-accent-soft text-accent flex flex-col items-center justify-center leading-none">
                    <span className="text-[10px] font-semibold uppercase">{d.toLocaleDateString("sv-SE", { month: "short" }).slice(0, 3)}</span>
                    <span className="text-sm font-bold">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">Om {days} dagar</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      {/* Drafts */}
      <SectionCard
        icon={FileText}
        title="Ansökningsutkast"
        action={drafts.length > 0 ? { label: "Se alla", to: "/ansokningar" } : undefined}
      >
        {drafts.length === 0 ? (
          <Empty text="Du har inga utkast ännu." cta="Bläddra stipendier" to="/stipendier" />
        ) : (
          <ul className="space-y-1.5">
            {drafts.slice(0, 3).map((d) => (
              <li key={d.scholarshipId}>
                <Link
                  to={`/utkast/${d.scholarshipId}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/60"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{d.scholarshipName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Uppdaterad {new Date(d.updatedAt).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <p className="text-[10px] text-center text-muted-foreground/80 px-4 py-2">
        Din profil sparas endast lokalt i din webbläsare.
      </p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-1.5 p-3 bg-card rounded-2xl border border-border/60 shadow-soft hover:shadow-card active:scale-95 transition-all"
    >
      <span className="h-9 w-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="text-[11px] font-medium text-center leading-tight">{label}</span>
    </Link>
  );
}

function SectionCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: any;
  title: string;
  action?: { label: string; to: string };
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card rounded-3xl border border-border/60 shadow-soft p-3">
      <div className="flex items-center justify-between px-1.5 pt-0.5 pb-2">
        <h2 className="font-semibold text-sm flex items-center gap-1.5">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </h2>
        {action && (
          <Link to={action.to} className="text-[11px] font-semibold text-primary flex items-center">
            {action.label} <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ text, cta, to }: { text: string; cta?: string; to?: string }) {
  return (
    <div className="px-2 py-4 text-center">
      <p className="text-xs text-muted-foreground">{text}</p>
      {cta && to && (
        <Link to={to} className="inline-block mt-2 text-xs font-semibold text-primary">
          {cta} →
        </Link>
      )}
    </div>
  );
}
