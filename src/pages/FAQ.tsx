import AppScreen from "@/components/layout/AppScreen";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Vad är ett stipendium?",
    a: "Ett stipendium är en summa pengar som delas ut till studenter för att stödja deras studier, forskning, utlandsstudier eller projekt. Till skillnad från lån behöver stipendier inte betalas tillbaka.",
  },
  {
    q: "Måste jag ha toppbetyg?",
    a: "Nej. En del stipendier baseras på studieresultat, men många väger även in engagemang, ekonomiskt behov, ämnesområde eller bakgrund. Det finns stipendier för väldigt många olika profiler.",
  },
  {
    q: "Kan jag söka flera stipendier?",
    a: "Ja, du får söka så många stipendier du vill. Det är ofta klokt att söka flera samtidigt eftersom konkurrensen kan variera.",
  },
  {
    q: "Är stipendier skattefria?",
    a: "Stipendier för studier är oftast skattefria i Sverige om de inte är ersättning för utfört arbete. Kontrollera alltid villkoren och Skatteverkets regler för det enskilda stipendiet.",
  },
  {
    q: "Hur skriver jag en bra ansökan?",
    a: "Var konkret om varför du söker, vad pengarna ska användas till och hur du uppfyller kriterierna. Stipendia hjälper dig skapa ett utkast baserat på din profil.",
  },
  {
    q: "Sparas mina uppgifter?",
    a: "All din profilinformation lagras endast lokalt i din webbläsare. Inget skickas till någon server.",
  },
];

export default function FAQ() {
  return (
    <AppScreen title="Vanliga frågor" subtitle="Svar om stipendier" back>
      <div className="bg-card rounded-3xl border border-border/60 shadow-soft px-4">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className={i === FAQS.length - 1 ? "border-b-0" : ""}>
              <AccordionTrigger className="text-sm text-left hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AppScreen>
  );
}
