import { cn } from "@/lib/utils";

export function MatchBadge({ score, className }: { score: number; className?: string }) {
  const tone =
    score >= 75
      ? "bg-success-soft text-success border-success/20"
      : score >= 50
      ? "bg-primary-soft text-primary border-primary/20"
      : "bg-accent-soft text-accent border-accent/20";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        tone,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {score}% matchning
    </div>
  );
}
