import { useEffect, useState } from "react";
import AppScreen from "@/components/layout/AppScreen";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Languages, Database, Trash2, RotateCcw } from "lucide-react";
import { getLang, setLang, useT, Lang } from "@/lib/i18n";
import { clearProfile } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NOTIF_KEY = "stipendia.notifs";

interface Notifs {
  deadlines: boolean;
  newScholarships: boolean;
  matchUpdates: boolean;
}

const defaultNotifs: Notifs = { deadlines: true, newScholarships: true, matchUpdates: false };

function loadNotifs(): Notifs {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? { ...defaultNotifs, ...JSON.parse(raw) } : defaultNotifs;
  } catch {
    return defaultNotifs;
  }
}
function saveNotifs(n: Notifs) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(n));
}

export default function SettingsPage() {
  const t = useT();
  const [notifs, setNotifs] = useState<Notifs>(defaultNotifs);
  const [lang, setLangLocal] = useState<Lang>(getLang());

  useEffect(() => setNotifs(loadNotifs()), []);

  const update = (k: keyof Notifs, v: boolean) => {
    const next = { ...notifs, [k]: v };
    setNotifs(next);
    saveNotifs(next);
  };

  const switchLang = (l: Lang) => {
    setLang(l);
    setLangLocal(l);
  };

  const handleReset = () => {
    if (confirm(t("settings.confirmReset"))) {
      clearProfile();
      toast.success(t("settings.done"));
    }
  };

  const handleDeleteAll = () => {
    if (confirm(t("settings.confirmDelete"))) {
      ["stipendia.profile", "stipendia.saved", "stipendia.drafts"].forEach((k) => localStorage.removeItem(k));
      window.dispatchEvent(new Event("stipendia:update"));
      toast.success(t("settings.done"));
    }
  };

  return (
    <AppScreen title={t("settings.title")}>
      <div className="space-y-3">
        <Section icon={Bell} title={t("settings.notifications")}>
          <Row label={t("settings.deadlineReminders")}>
            <Switch checked={notifs.deadlines} onCheckedChange={(v) => update("deadlines", v)} />
          </Row>
          <Row label={t("settings.newScholarships")}>
            <Switch checked={notifs.newScholarships} onCheckedChange={(v) => update("newScholarships", v)} />
          </Row>
          <Row label={t("settings.matchUpdates")} last>
            <Switch checked={notifs.matchUpdates} onCheckedChange={(v) => update("matchUpdates", v)} />
          </Row>
        </Section>

        <Section icon={Languages} title={t("settings.language")}>
          <div className="flex gap-2 p-2">
            {(["sv", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                className={cn(
                  "flex-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                  lang === l ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}
              >
                {l === "sv" ? t("settings.swedish") : t("settings.english")}
              </button>
            ))}
          </div>
        </Section>

        <Section icon={Database} title={t("settings.data")}>
          <div className="p-2 space-y-2">
            <Button onClick={handleReset} variant="outline" className="w-full justify-start rounded-xl gap-2">
              <RotateCcw className="h-4 w-4" /> {t("settings.resetProfile")}
            </Button>
            <Button onClick={handleDeleteAll} variant="outline" className="w-full justify-start rounded-xl gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" /> {t("settings.deleteAll")}
            </Button>
          </div>
        </Section>

        <p className="text-[10px] text-center text-muted-foreground/80 px-4 py-2">
          Stipendia MVP · v0.1
        </p>
      </div>
    </AppScreen>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card rounded-3xl border border-border/60 shadow-soft p-3">
      <h2 className="font-semibold text-sm flex items-center gap-1.5 px-1.5 pt-0.5 pb-2">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between px-2 py-2.5", !last && "border-b border-border/50")}>
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}
