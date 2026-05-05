import { MatchResult } from "@/lib/matching";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, AlertCircle, Minus } from "lucide-react";
import { useT } from "@/lib/i18n";

export function MatchExplainer({ match }: { match: MatchResult }) {
  const t = useT();
  return (
    <Accordion type="single" collapsible className="mt-3">
      <AccordionItem value="how" className="border-0">
        <AccordionTrigger className="text-xs font-semibold py-2 hover:no-underline">{t("match.howCalc")}</AccordionTrigger>
        <AccordionContent className="space-y-3 pt-1">
          <Group icon={CheckCircle2} tone="success" title={t("match.matched")} items={match.matched} empty={t("match.noneMatched")} />
          <Group icon={AlertCircle} tone="warning" title={t("match.missing")} items={match.missing} empty={t("match.noneMissing")} />
          <Group icon={Minus} tone="muted" title={t("match.notRelevant")} items={match.notRelevant} empty="—" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function Group({ icon: Icon, tone, title, items, empty }: { icon: any; tone: "success" | "warning" | "muted"; title: string; items: string[]; empty: string }) {
  const toneCls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-muted-foreground";
  return (
    <div>
      <p className={`text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1 ${toneCls}`}>
        <Icon className="h-3 w-3" /> {title}
      </p>
      {items.length === 0 ? (
        <p className="text-[12px] text-muted-foreground/70 mt-1">{empty}</p>
      ) : (
        <ul className="mt-1 space-y-0.5">
          {items.map((it, i) => <li key={i} className="text-[12px] text-foreground/80">• {it}</li>)}
        </ul>
      )}
    </div>
  );
}
