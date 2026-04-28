import { Scholarship } from "@/data/scholarships";
import { StudentProfile } from "@/types/profile";
import { MatchResult } from "./matching";

export function generateDraft(profile: StudentProfile, scholarship: Scholarship, match?: MatchResult): string {
  const today = new Date().toLocaleDateString("sv-SE");
  const namn = profile.namn || "[Ditt namn]";
  const program = profile.program || "min utbildning";
  const universitet = profile.universitet || "mitt lärosäte";
  const termin = profile.termin || "innevarande termin";
  const syfte = profile.syfte?.trim() || "vidareutveckla mig inom mitt ämnesområde";
  const engagemang = profile.engagemang?.trim();
  const intressen = profile.intressen?.trim();
  const bakgrund = profile.bakgrund?.trim();

  const matchSats = match && match.matched.length > 0
    ? `Jag bedömer att jag passar väl in på stipendiets kriterier: ${match.matched.slice(0, 3).join("; ").toLowerCase()}.`
    : `Jag uppfyller stipendiets kriterier och vill med denna ansökan visa varför jag är en lämplig kandidat.`;

  return `${today}

Till ${scholarship.organization}

Ansökan om ${scholarship.name}

Hej,

Mitt namn är ${namn} och jag studerar ${program} vid ${universitet}, för närvarande ${termin}. Jag ansöker härmed om ${scholarship.name} på ${scholarship.amount.toLocaleString("sv-SE")} kr.

${bakgrund ? bakgrund + "\n\n" : ""}Min utbildning har gett mig en stabil grund inom ${profile.amnesomrade || "mitt ämnesområde"}, och jag har under studietiden utvecklat både ämneskunskap och praktiska färdigheter. ${intressen ? `Jag har ett särskilt intresse för ${intressen.toLowerCase()}.` : ""}

${engagemang ? `Vid sidan av studierna är jag engagerad i ${engagemang.toLowerCase()}, vilket har lärt mig att ta ansvar och samarbeta med andra.` : ""}

${matchSats}

Om jag tilldelas stipendiet kommer medlen att användas till att ${syfte.toLowerCase()}. Det skulle göra det möjligt för mig att fokusera fullt ut på mina studier och ta nästa steg i min utveckling.

Tack för att ni tar er tid att läsa min ansökan. Jag bifogar gärna kompletterande underlag vid behov och svarar gärna på frågor.

Med vänliga hälsningar,
${namn}
`;
}
