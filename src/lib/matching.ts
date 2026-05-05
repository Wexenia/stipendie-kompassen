import { Scholarship } from "@/data/scholarships";
import { StudentProfile } from "@/types/profile";

export interface MatchResult {
  scholarship: Scholarship;
  score: number; // 0-100
  matched: string[];
  missing: string[];
  explanation: string;
}

const norm = (s: string) => s.trim().toLowerCase();

const includesAny = (haystack: string, needles: string[]) =>
  needles.some((n) => norm(haystack).includes(norm(n)));

export function matchScholarship(profile: StudentProfile, s: Scholarship): MatchResult {
  const matched: string[] = [];
  const missing: string[] = [];

  let earned = 0;
  let possible = 0;

  // 1. Field
  possible += 25;
  if (s.eligibleFields.length === 0) {
    earned += 18;
    matched.push("Öppet för alla ämnesområden");
  } else if (
    includesAny(profile.amnesomrade, s.eligibleFields) ||
    includesAny(profile.program, s.eligibleFields)
  ) {
    earned += 25;
    matched.push(`Ditt ämnesområde matchar (${s.eligibleFields.join(", ")})`);
  } else {
    missing.push(`Stipendiet riktar sig till: ${s.eligibleFields.join(", ")}`);
  }

  // 2. University
  possible += 20;
  if (s.eligibleUniversities.length === 0) {
    earned += 14;
    matched.push("Öppet för alla lärosäten");
  } else if (
    s.eligibleUniversities.some((u) => {
      const a = norm(profile.universitet);
      const b = norm(u);
      return a === b || a.includes(b) || b.includes(a);
    })
  ) {
    earned += 20;
    matched.push(`Ditt lärosäte (${profile.universitet}) är behörigt`);
  } else {
    missing.push(`Endast för: ${s.eligibleUniversities.join(", ")}`);
  }

  // 3. Location
  possible += 15;
  if (s.eligibleLocations.length === 0) {
    earned += 10;
  } else if (
    includesAny(profile.studieort, s.eligibleLocations) ||
    includesAny(profile.hemort, s.eligibleLocations)
  ) {
    earned += 15;
    matched.push(`Studieort matchar (${s.eligibleLocations.join(", ")})`);
  } else {
    missing.push(`Studieort bör vara: ${s.eligibleLocations.join(", ")}`);
  }

  // 4. Purpose — map syfte option to tags
  possible += 15;
  const syfteTagMap: Record<string, string[]> = {
    "Extra ekonomiskt stöd under studierna": ["ekonomiskt stöd", "levnadskostnader", "fritt", "hyra"],
    "Utlandsstudier eller utbyte": ["utbytesstudier", "utlandsstudier", "resor"],
    "Examensarbete": ["examensarbete"],
    "Praktik": ["praktik"],
    "Forskningsprojekt": ["forskning", "projekt"],
    "Studieresa": ["studieresa", "resor", "konferens"],
    "Kursavgift eller utbildningskostnader": ["kursavgift", "kurslitteratur"],
    "Boende eller levnadsomkostnader": ["levnadskostnader", "hyra"],
    "Annat": ["fritt"],
  };
  const userPurposeTags = syfteTagMap[profile.syfte] ?? (profile.syfte ? [profile.syfte] : []);
  if (!s.purposes || s.purposes.length === 0 || s.purposes.includes("fritt")) {
    earned += 10;
    if (userPurposeTags.some((t) => s.purposes?.includes(t))) {
      earned += 5;
      matched.push("Ditt syfte stämmer med stipendiets ändamål");
    }
  } else if (userPurposeTags.some((t) => s.purposes!.includes(t))) {
    earned += 15;
    matched.push("Ditt syfte stämmer med stipendiets ändamål");
  } else if (profile.syfte) {
    missing.push(`Stipendiet är avsett för: ${s.purposes.join(", ")}`);
  }

  // 5. Engagement / interests
  possible += 15;
  const hasEngagement = profile.engagemang.trim().length > 10 || profile.intressen.trim().length > 10;
  if (s.engagementRequired) {
    if (hasEngagement) {
      earned += 15;
      matched.push("Ditt engagemang är meriterande");
    } else {
      missing.push("Stipendiet kräver dokumenterat engagemang");
    }
  } else if (hasEngagement) {
    earned += 10;
    matched.push("Engagemang och intressen stärker ansökan");
  } else {
    earned += 5;
  }

  // 6. Financial need
  possible += 10;
  if (s.needBased) {
    if (
      profile.ekonomi &&
      /(begränsad|svårt|svag|behov|liten|låg|finansiera)/i.test(profile.ekonomi)
    ) {
      earned += 10;
      matched.push("Behovsprövning kan vara till din fördel");
    } else {
      missing.push("Behovsprövat stipendium – ekonomi vägs in");
    }
  } else {
    earned += 7;
  }

  const score = Math.round((earned / possible) * 100);

  const explanation =
    matched.length > 0
      ? `${matched.slice(0, 2).join(". ")}.`
      : "Begränsad matchning utifrån din profil – läs kriterierna noggrant.";

  return { scholarship: s, score, matched, missing, explanation };
}

export function matchAll(profile: StudentProfile, scholarships: Scholarship[]): MatchResult[] {
  return scholarships
    .map((s) => matchScholarship(profile, s))
    .sort((a, b) => b.score - a.score);
}
