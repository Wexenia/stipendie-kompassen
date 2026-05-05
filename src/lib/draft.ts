import { Scholarship } from "@/data/scholarships";
import { StudentProfile } from "@/types/profile";
import { MatchResult } from "./matching";
import { getLang } from "./i18n";

export function generateDraft(profile: StudentProfile, scholarship: Scholarship, match?: MatchResult): string {
  const today = new Date().toLocaleDateString(getLang() === "en" ? "en-GB" : "sv-SE");
  const fullName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "[Ditt namn]";
  const program = profile.program || "min utbildning";
  const universitet = profile.universitet || "mitt lärosäte";
  const termin = profile.termin || "innevarande termin";
  const syfte = profile.syfte?.trim() || "vidareutveckla mig inom mitt ämnesområde";
  const engagemang = profile.engagemang?.trim();
  const intressen = profile.intressen?.trim();

  if (getLang() === "en") {
    const matchSentence = match && match.matched.length > 0
      ? `I believe I fit the criteria well: ${match.matched.slice(0, 3).join("; ").toLowerCase()}.`
      : `I meet the criteria and would like to use this application to show why I am a suitable candidate.`;
    return `${today}

To ${scholarship.organization}

Application for ${scholarship.name}

Hello,

My name is ${fullName} and I study ${program} at ${universitet}, currently in ${termin}. I am applying for ${scholarship.name} of ${scholarship.amount.toLocaleString("en-GB")} SEK.

My education has given me a strong foundation in ${profile.amnesomrade || "my field"}. ${intressen ? `I have a particular interest in ${intressen.toLowerCase()}.` : ""}

${engagemang ? `Alongside my studies I am engaged in ${engagemang.toLowerCase()}, which has taught me responsibility and teamwork.` : ""}

${matchSentence}

If awarded, the funds will be used to ${syfte.toLowerCase()}. It would let me focus on my studies and take the next step in my development.

Thank you for considering my application.

Best regards,
${fullName}
`;
  }

  const matchSats = match && match.matched.length > 0
    ? `Jag bedömer att jag passar väl in på stipendiets kriterier: ${match.matched.slice(0, 3).join("; ").toLowerCase()}.`
    : `Jag uppfyller stipendiets kriterier och vill med denna ansökan visa varför jag är en lämplig kandidat.`;

  return `${today}

Till ${scholarship.organization}

Ansökan om ${scholarship.name}

Hej,

Mitt namn är ${fullName} och jag studerar ${program} vid ${universitet}, för närvarande ${termin}. Jag ansöker härmed om ${scholarship.name} på ${scholarship.amount.toLocaleString("sv-SE")} kr.

Min utbildning har gett mig en stabil grund inom ${profile.amnesomrade || "mitt ämnesområde"}, och jag har under studietiden utvecklat både ämneskunskap och praktiska färdigheter. ${intressen ? `Jag har ett särskilt intresse för ${intressen.toLowerCase()}.` : ""}

${engagemang ? `Vid sidan av studierna är jag engagerad i ${engagemang.toLowerCase()}, vilket har lärt mig att ta ansvar och samarbeta med andra.` : ""}

${matchSats}

Om jag tilldelas stipendiet kommer medlen att användas till att ${syfte.toLowerCase()}. Det skulle göra det möjligt för mig att fokusera fullt ut på mina studier och ta nästa steg i min utveckling.

Tack för att ni tar er tid att läsa min ansökan. Jag bifogar gärna kompletterande underlag vid behov och svarar gärna på frågor.

Med vänliga hälsningar,
${fullName}
`;
}
