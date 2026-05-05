import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { loadDrafts, loadProfile } from "@/lib/storage";
import { isProfileComplete, profileCompleteness, StudentProfile, SavedApplication } from "@/types/profile";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Sparkles, FileText, GraduationCap, Wallet, Plane, BookOpen, ChevronRight, HelpCircle, UserPlus, Send, FolderOpen,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { StatusBadge } from "@/components/StatusBadge";

export default function Home() {
  const t = useT();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [drafts, setDrafts] = useState<SavedApplication[]>([]);

  useEffect(() => {
    const refresh = () => {
      setProfile(loadProfile());
      setDrafts(loadDrafts());
    };
    refresh();
    window.addEventListener("stipendia:update", refresh);
    return () => window.removeEventListener("stipendia:update", refresh);
  }, []);

  const completeness = profileCompleteness(profile);
  const complete = isProfileComplete(profile);

  const recentApps = useMemo(
    () => [...drafts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4),
    [drafts]
  );

  return (
    <div className="px-4 pt-6 pb-2 space-y-5">
      <header>
        <h1 className="text-[24px] font-bold leading-tight">{t("home.title")}</h1>
        <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">{t("home.intro")}</p>
      </header>

      {/* Profile / CTA card */}
      <div className="rounded-3xl bg-warm-gradient text-primary-foreground p-4 shadow-glow">
        {complete ? (
          <>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider opacity-80 font-semibold">Profil</p>
                <p className="font-bold text-lg leading-tight mt-0.5">{t("home.profileReady")}</p>
                <p className="text-[12px] opacity-90 mt-1">{t("home.profileReadyDesc")}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3">
              <Button onClick={() => navigate("/matchningar")} className="w-full rounded-xl bg-white text-primary hover:bg-white/90 font-semibold h-10">
                {t("home.viewMatches")}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider opacity-80 font-semibold">Profil</p>
                <p className="font-bold text-lg leading-tight mt-0.5">
                  {completeness === 0 ? t("home.startProfile") : t("home.profileProgress", { p: completeness })}
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3">
              <Progress value={Math.max(completeness, 4)} className="h-1.5 bg-white/20 [&>div]:bg-white" />
            </div>
            <div className="mt-3">
              <Button onClick={() => navigate("/profil?edit=1")} className="w-full rounded-xl bg-white text-primary hover:bg-white/90 font-semibold h-10">
                {completeness === 0 ? t("home.startProfile") : t("home.continueProfile")}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* How it works */}
      <Section title={t("home.howItWorks")}>
        <ol className="space-y-2">
          <Step n={1} icon={UserPlus} title={t("home.step1.title")} desc={t("home.step1.desc")} />
          <Step n={2} icon={Sparkles} title={t("home.step2.title")} desc={t("home.step2.desc")} />
          <Step n={3} icon={Send} title={t("home.step3.title")} desc={t("home.step3.desc")} />
        </ol>
      </Section>

      {/* Application history */}
      <Section title={t("home.history")}>
        <div className="bg-card rounded-3xl border border-border/60 shadow-soft p-3">
          {recentApps.length === 0 ? (
            <div className="px-2 py-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-2xl bg-accent-soft text-accent-foreground flex items-center justify-center mb-2">
                <FolderOpen className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground">{t("home.historyEmpty")}</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {recentApps.map((d) => (
                <li key={d.scholarshipId}>
                  <Link to={`/utkast/${d.scholarshipId}`} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-secondary/60">
                    <div className="h-9 w-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{d.scholarshipName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {t("app.created")}: {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={d.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Why */}
      <Section title={t("home.why")}>
        <div className="grid grid-cols-1 gap-2">
          <Why icon={Wallet} title={t("home.why1.t")} desc={t("home.why1.d")} />
          <Why icon={Plane} title={t("home.why2.t")} desc={t("home.why2.d")} />
          <Why icon={BookOpen} title={t("home.why3.t")} desc={t("home.why3.d")} />
        </div>
      </Section>

      <Link to="/faq" className="flex items-center gap-3 p-4 bg-card rounded-3xl border border-border/60 shadow-soft hover:shadow-card transition-all">
        <span className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
          <HelpCircle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm">{t("home.faq")}</p>
          <p className="text-[12px] text-muted-foreground">{t("home.faqDesc")}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <p className="text-[10px] text-center text-muted-foreground/80 px-4 py-2">{t("home.localOnly")}</p>
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
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{n}</span>
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
      <span className="h-10 w-10 rounded-xl bg-accent-soft text-accent-foreground flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-[12px] text-muted-foreground leading-snug">{desc}</p>
      </div>
    </div>
  );
}
