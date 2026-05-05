import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadProfile } from "@/lib/storage";
import { StudentProfile } from "@/types/profile";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sparkles,
  FileText,
  GraduationCap,
  Wallet,
  Plane,
  BookOpen,
  ChevronRight,
  HelpCircle,
  UserPlus,
  Send,
} from "lucide-react";

function profileCompleteness(p: StudentProfile | null): number {
  if (!p) return 0;
  const fields = [p.namn, p.universitet, p.program, p.amnesomrade, p.termin, p.studieort, p.hemort, p.engagemang, p.intressen, p.syfte, p.bakgrund];
  const filled = fields.filter((f) => f && f.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const refresh = () => setProfile(loadProfile());
    refresh();
    window.addEventListener("stipendia:update", refresh);
    return () => window.removeEventListener("stipendia:update", refresh);
  }, []);

  const completeness = profileCompleteness(profile);

  return (
    <div className="px-4 pt-6 pb-2 space-y-5">
      {/* Hero */}
      <header>
        <h1 className="text-[24px] font-bold leading-tight">Hitta stipendier som passar dig</h1>
        <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
          Stipendier är pengar du kan söka för att finansiera dina studier. Många studenter
          missar möjligheter eftersom informationen är utspridd. Stipendia hjälper dig hitta
          relevanta stipendier och komma igång med din ansökan.
        </p>
      </header>

      {/* Profile / CTA card */}
      <div className="rounded-3xl bg-warm-gradient text-primary-foreground p-4 shadow-glow">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider opacity-80 font-semibold">Din profil</p>
            <p className="font-bold text-lg leading-tight mt-0.5">
              {completeness === 0 ? "Kom igång på 2 minuter" : `Profil ${completeness}% klar`}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3">
          <Progress value={Math.max(completeness, 4)} className="h-1.5 bg-white/20 [&>div]:bg-white" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            onClick={() => navigate("/profil")}
            className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold h-10"
          >
            {completeness === 0 ? "Skapa profil" : "Uppdatera"}
          </Button>
          <Button
            onClick={() => navigate(profile ? "/matchningar" : "/stipendier")}
            variant="outline"
            className="rounded-xl bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white font-semibold h-10"
          >
            {profile ? "Mina matchningar" : "Bläddra stipendier"}
          </Button>
        </div>
      </div>

      {/* How it works */}
      <Section title="Hur det fungerar">
        <ol className="space-y-2">
          <Step n={1} icon={UserPlus} title="Skapa profil" desc="Berätta om dina studier och intressen." />
          <Step n={2} icon={Sparkles} title="Få matchningar" desc="Se stipendier som passar din profil." />
          <Step n={3} icon={Send} title="Ansök" desc="Skapa ett ansökningsutkast direkt i appen." />
        </ol>
      </Section>

      {/* Why */}
      <Section title="Varför söka stipendier?">
        <div className="grid grid-cols-1 gap-2">
          <Why icon={Wallet} title="Extra ekonomiskt stöd" desc="Minska studielånet och få mer marginal i vardagen." />
          <Why icon={Plane} title="Finansiera utlandsstudier" desc="Många stipendier täcker resor och utbyte." />
          <Why icon={BookOpen} title="Stöd för examensarbete eller praktik" desc="Få resurser till projekt, material och resor." />
        </div>
      </Section>

      {/* FAQ teaser */}
      <Link
        to="/faq"
        className="flex items-center gap-3 p-4 bg-card rounded-3xl border border-border/60 shadow-soft hover:shadow-card transition-all"
      >
        <span className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
          <HelpCircle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm">Vanliga frågor</p>
          <p className="text-[12px] text-muted-foreground">Vad är ett stipendium? Måste jag ha toppbetyg?</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-2">
        <Quick icon={Search} label="Bläddra alla" to="/stipendier" />
        <Quick icon={FileText} label="Mina ansökningar" to="/ansokningar" />
      </div>

      <p className="text-[10px] text-center text-muted-foreground/80 px-4 py-2">
        Din profil sparas endast lokalt i din webbläsare.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-semibold text-[15px] mb-2 px-0.5">{title}</h2>
      {children}
    </section>
  );
}

function Step({ n, icon: Icon, title, desc }: { n: number; icon: any; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3 p-3 bg-card rounded-2xl border border-border/60 shadow-soft">
      <span className="relative h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
          {n}
        </span>
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-[12px] text-muted-foreground leading-snug">{desc}</p>
      </div>
    </li>
  );
}

function Why({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-card rounded-2xl border border-border/60 shadow-soft">
      <span className="h-10 w-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-[12px] text-muted-foreground leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function Quick({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 p-3 bg-card rounded-2xl border border-border/60 shadow-soft hover:shadow-card active:scale-[0.98] transition-all"
    >
      <span className="h-9 w-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="text-[13px] font-semibold">{label}</span>
    </Link>
  );
}
