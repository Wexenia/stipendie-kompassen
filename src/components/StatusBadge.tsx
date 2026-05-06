import { useT } from "@/lib/i18n";
import { Scholarship } from "@/data/scholarships";
import { isApplied } from "@/lib/storage";
import { deadlineState } from "@/lib/eligibility";
import { cn } from "@/lib/utils";

export function ApplicationStatusBadge({ scholarship, className }: { scholarship: Scholarship; className?: string }) {
  const t = useT();
  const state = deadlineState(scholarship, isApplied(scholarship.id));
  const map = {
    "open-not-applied": { label: t("sch.statusOpenNot"), cls: "bg-primary-soft text-primary border-primary/20" },
    "open-applied": { label: t("sch.statusOpenApplied"), cls: "bg-success-soft text-success border-success/30" },
    "closed": { label: t("sch.statusClosed"), cls: "bg-muted text-muted-foreground border-border" },
  } as const;
  const { label, cls } = map[state];
  return <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", cls, className)}>{label}</span>;
}

export function EligibilityBadge({ eligible, className }: { eligible: boolean; className?: string }) {
  const t = useT();
  return (
    <span className={cn(
      "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
      eligible ? "bg-success-soft text-success border-success/30" : "bg-muted text-muted-foreground border-border",
      className
    )}>
      {eligible ? t("sch.eligible") : t("sch.notEligible")}
    </span>
  );
}
