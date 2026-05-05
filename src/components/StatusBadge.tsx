import { ApplicationStatus } from "@/types/profile";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: ApplicationStatus; className?: string }) {
  const t = useT();
  const map: Record<ApplicationStatus, string> = {
    utkast: "bg-secondary text-foreground/70 border-border",
    paborjad: "bg-primary-soft text-primary border-primary/20",
    skickad: "bg-success-soft text-success border-success/30",
    arkiverad: "bg-accent-soft text-accent-foreground border-accent/30",
  };
  const label = t(`app.status.${status}` as any);
  return (
    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", map[status], className)}>
      {label}
    </span>
  );
}
