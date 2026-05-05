import { Scholarship } from "@/data/scholarships";
import { StudentProfile } from "@/types/profile";
import { getLang } from "./i18n";

export interface MatchResult {
  scholarship: Scholarship;
  score: number; // 0-100
  matched: string[];
  missing: string[];
  notRelevant: string[];
  explanation: string;
}

const norm = (s: string) => s.trim().toLowerCase();

const includesAny = (haystack: string, needles: string[]) =>
  needles.some((n) => norm(haystack).includes(norm(n)));

interface Strings {
  fieldOpen: string;
  fieldMatch: (f: string) => string;
  fieldNo: (f: string) => string;
  uniOpen: string;
  uniMatch: (u: string) => string;
  uniNo: (u: string) => string;
  locOpen: string;
  locMatch: (l: string) => string;
  locNo: (l: string) => string;
  purposeMatch: string;
  purposeNo: (p: string) => string;
  engBoost: string;
  engReq: string;
  engNoMatter: string;
  needMatch: string;
  needMiss: string;
  needNotRel: string;
  noStrong: string;
}

const SV: Strings = {
  fieldOpen: "Öppet för alla ämnesområden",
  fieldMatch: (f) => `Ditt ämnesområde matchar (${f})`,
  fieldNo: (f) => `Stipendiet riktar sig till: ${f}`,
  uniOpen: "Öppet för alla lärosäten",
  uniMatch: (u) => `Ditt lärosäte (${u}) är behörigt`,
  uniNo: (u) => `Endast för: ${u}`,
  locOpen: "Inga geografiska krav",
  locMatch: (l) => `Studieort matchar (${l})`,
  locNo: (l) => `Studieort bör vara: ${l}`,
  purposeMatch: "Ditt syfte stämmer med stipendiets ändamål",
  purposeNo: (p) => `Stipendiet är avsett för: ${p}`,
  engBoost: "Engagemang och intressen stärker ansökan",
  engReq: "Stipendiet kräver dokumenterat engagemang",
  engNoMatter: "Engagemang krävs ej",
  needMatch: "Behovsprövning kan vara till din fördel",
  needMiss: "Behovsprövat stipendium – ekonomi vägs in",
  needNotRel: "Ej behovsprövat",
  noStrong: "Begränsad matchning utifrån din profil – läs kriterierna noggrant.",
};

const EN: Strings = {
  fieldOpen: "Open to all study fields",
  fieldMatch: (f) => `Your study field matches (${f})`,
  fieldNo: (f) => `Scholarship targets: ${f}`,
  uniOpen: "Open to all universities",
  uniMatch: (u) => `Your university (${u}) is eligible`,
  uniNo: (u) => `Only for: ${u}`,
  locOpen: "No geographic requirements",
  locMatch: (l) => `Study city matches (${l})`,
  locNo: (l) => `Study city should be: ${l}`,
  purposeMatch: "Your purpose aligns with the scholarship",
  purposeNo: (p) => `Intended for: ${p}`,
  engBoost: "Engagement and interests strengthen the application",
  engReq: "Scholarship requires documented engagement",
  engNoMatter: "Engagement not required",
  needMatch: "Needs-based — may be in your favour",
  needMiss: "Needs-based scholarship — finances are considered",
  needNotRel: "Not needs-based",
  noStrong: "Limited match for your profile — read the criteria carefully.",
};

const S = () => (getLang() === "en" ? EN : SV);

export function matchScholarship(profile: StudentProfile, s: Scholarship): MatchResult {
  const t = S();
  const matched: string[] = [];
  const missing: string[] = [];
  const notRelevant: string[] = [];

  let earned = 0;
  let possible = 0;

  // 1. Field
  possible += 25;
  if (s.eligibleFields.length === 0) {
    earned += 18;
    notRelevant.push(t.fieldOpen);
  } else if (includesAny(profile.amnesomrade, s.eligibleFields) || includesAny(profile.program, s.eligibleFields)) {
    earned += 25;
    matched.push(t.fieldMatch(s.eligibleFields.join(", ")));
  } else {
    missing.push(t.fieldNo(s.eligibleFields.join(", ")));
  }

  // 2. University
  possible += 20;
  if (s.eligibleUniversities.length === 0) {
    earned += 14;
    notRelevant.push(t.uniOpen);
  } else if (
    s.eligibleUniversities.some((u) => {
      const a = norm(profile.universitet);
      const b = norm(u);
      return a === b || a.includes(b) || b.includes(a);
    })
  ) {
    earned += 20;
    matched.push(t.uniMatch(profile.universitet));
  } else {
    missing.push(t.uniNo(s.eligibleUniversities.join(", ")));
  }

  // 3. Location
  possible += 15;
  if (s.eligibleLocations.length === 0) {
    earned += 10;
    notRelevant.push(t.locOpen);
  } else if (includesAny(profile.studieort, s.eligibleLocations) || includesAny(profile.hemort, s.eligibleLocations)) {
    earned += 15;
    matched.push(t.locMatch(s.eligibleLocations.join(", ")));
  } else {
    missing.push(t.locNo(s.eligibleLocations.join(", ")));
  }

  // 4. Purpose
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
  const userTags = syfteTagMap[profile.syfte] ?? (profile.syfte ? [profile.syfte] : []);
  if (!s.purposes || s.purposes.length === 0 || s.purposes.includes("fritt")) {
    earned += 10;
    if (userTags.some((x) => s.purposes?.includes(x))) {
      earned += 5;
      matched.push(t.purposeMatch);
    } else {
      notRelevant.push(t.purposeMatch);
    }
  } else if (userTags.some((x) => s.purposes!.includes(x))) {
    earned += 15;
    matched.push(t.purposeMatch);
  } else if (profile.syfte) {
    missing.push(t.purposeNo(s.purposes.join(", ")));
  }

  // 5. Engagement
  possible += 15;
  const hasEngagement = profile.engagemang.trim().length > 10 || profile.intressen.trim().length > 10;
  if (s.engagementRequired) {
    if (hasEngagement) {
      earned += 15;
      matched.push(t.engBoost);
    } else {
      missing.push(t.engReq);
    }
  } else if (hasEngagement) {
    earned += 10;
    matched.push(t.engBoost);
  } else {
    earned += 5;
    notRelevant.push(t.engNoMatter);
  }

  // 6. Need
  possible += 10;
  if (s.needBased) {
    if (profile.ekonomi && /(begränsad|svårt|svag|behov|liten|låg|finansiera)/i.test(profile.ekonomi)) {
      earned += 10;
      matched.push(t.needMatch);
    } else {
      missing.push(t.needMiss);
    }
  } else {
    earned += 7;
    notRelevant.push(t.needNotRel);
  }

  const score = Math.round((earned / possible) * 100);

  const explanation = matched.length > 0
    ? `${matched.slice(0, 2).join(". ")}.`
    : t.noStrong;

  return { scholarship: s, score, matched, missing, notRelevant, explanation };
}

export function matchAll(profile: StudentProfile, scholarships: Scholarship[]): MatchResult[] {
  return scholarships.map((s) => matchScholarship(profile, s)).sort((a, b) => b.score - a.score);
}
