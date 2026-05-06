import { Link, useParams } from "react-router-dom";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { loadDrafts, loadProfile, saveDraft } from "@/lib/storage";
import { checkEligibility } from "@/lib/eligibility";
import { generateDraft } from "@/lib/draft";
import { useState, useEffect } from "react";
import AppScreen from "@/components/layout/AppScreen";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RotateCw, Save, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";

export default function DraftPage() {
  const t = useT();
  const { id } = useParams();
  const scholarship = SCHOLARSHIPS.find((s) => s.id === id);
  const profile = loadProfile();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!scholarship) return;
    const existing = loadDrafts().find((d) => d.scholarshipId === scholarship.id);
    if (existing) {
      setText(existing.text);
      setLoading(false);
    } else if (profile) {
      setLoading(true);
      const tt = setTimeout(() => {
        const elig = checkEligibility(profile, scholarship);
        const generated = generateDraft(profile, scholarship, elig);
        setText(generated);
        // Auto-save as draft on first generation
        saveDraft({
          scholarshipId: scholarship.id,
          scholarshipName: scholarship.name,
          text: generated,
          updatedAt: new Date().toISOString(),
        });
        setLoading(false);
      }, 400);
      return () => clearTimeout(tt);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!scholarship) {
    return <AppScreen title={t("draft.title")} back><p className="text-sm text-muted-foreground text-center py-10">—</p></AppScreen>;
  }

  if (!profile) {
    return (
      <AppScreen title={t("draft.title")} back>
        <div className="text-center py-10">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
          <h2 className="mt-3 text-base font-semibold">{t("draft.profileFirst")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("draft.profileFirstDesc")}</p>
          <Button asChild className="mt-4 rounded-xl"><Link to="/profil">{t("home.startProfile")}</Link></Button>
        </div>
      </AppScreen>
    );
  }

  const regenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const elig = checkEligibility(profile, scholarship);
      const generated = generateDraft(profile, scholarship, elig);
      setText(generated);
      saveDraft({ scholarshipId: scholarship.id, scholarshipName: scholarship.name, text: generated, updatedAt: new Date().toISOString() });
      setLoading(false);
      toast.success(t("draft.regenerated"));
    }, 300);
  };

  const copy = async () => { await navigator.clipboard.writeText(text); toast.success(t("draft.copied")); };

  const save = () => {
    saveDraft({ scholarshipId: scholarship.id, scholarshipName: scholarship.name, text, updatedAt: new Date().toISOString() });
    toast.success(t("draft.saved"));
  };

  return (
    <AppScreen title={t("draft.title")} subtitle={scholarship.name} back>
      <div className="space-y-3">
        <div className="flex items-start gap-2 rounded-2xl bg-warning/10 border border-warning/30 p-3">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/85 leading-relaxed">
            <span className="font-semibold">{t("draft.warning")}</span> {t("draft.warningDesc")}
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border/60 p-3 shadow-soft">
          {loading ? (
            <div className="space-y-2 animate-pulse py-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-2.5 bg-secondary rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
              ))}
            </div>
          ) : (
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={18} className="font-mono text-[12px] leading-relaxed border-0 focus-visible:ring-0 resize-none p-1 bg-transparent" />
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button onClick={save} className="rounded-xl h-11 text-xs"><Save className="h-3.5 w-3.5 mr-1" /> {t("draft.save")}</Button>
          <Button variant="outline" onClick={copy} className="rounded-xl h-11 text-xs"><Copy className="h-3.5 w-3.5 mr-1" /> {t("draft.copy")}</Button>
          <Button variant="outline" onClick={regenerate} className="rounded-xl h-11 text-xs"><RotateCw className="h-3.5 w-3.5 mr-1" /> {t("draft.regenerate")}</Button>
        </div>
      </div>
    </AppScreen>
  );
}
