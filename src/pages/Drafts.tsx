import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadDrafts, deleteDraft, setApplicationStatus } from "@/lib/storage";
import AppScreen from "@/components/layout/AppScreen";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, FolderOpen } from "lucide-react";
import { SavedApplication, ApplicationStatus } from "@/types/profile";
import { StatusBadge } from "@/components/StatusBadge";
import { useT } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Drafts() {
  const t = useT();
  const [drafts, setDrafts] = useState<SavedApplication[]>([]);

  useEffect(() => {
    const refresh = () => setDrafts(loadDrafts());
    refresh();
    window.addEventListener("stipendia:update", refresh);
    return () => window.removeEventListener("stipendia:update", refresh);
  }, []);

  const sorted = [...drafts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <AppScreen title={t("app.title")}>
      <div className="bg-card rounded-3xl border border-border/60 shadow-soft p-3">
        {sorted.length === 0 ? (
          <div className="px-2 py-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-accent-soft text-accent-foreground flex items-center justify-center mb-2">
              <FolderOpen className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">{t("app.empty")}</p>
            <Button asChild variant="outline" className="mt-3 rounded-xl">
              <Link to="/stipendier">{t("sch.title")}</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {sorted.map((d) => (
              <li key={d.scholarshipId} className="px-1 py-2.5">
                <div className="flex items-start gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{d.scholarshipName}</p>
                      <StatusBadge status={d.status} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {t("app.created")}: {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Button asChild size="sm" variant="outline" className="rounded-lg h-8 text-xs flex-1">
                        <Link to={`/utkast/${d.scholarshipId}`}>{t("common.open")}</Link>
                      </Button>
                      <Select value={d.status} onValueChange={(v) => setApplicationStatus(d.scholarshipId, v as ApplicationStatus)}>
                        <SelectTrigger className="h-8 text-xs rounded-lg w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utkast">{t("app.status.utkast")}</SelectItem>
                          <SelectItem value="paborjad">{t("app.status.paborjad")}</SelectItem>
                          <SelectItem value="skickad">{t("app.status.skickad")}</SelectItem>
                          <SelectItem value="arkiverad">{t("app.status.arkiverad")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        onClick={() => deleteDraft(d.scholarshipId)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label={t("common.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppScreen>
  );
}
