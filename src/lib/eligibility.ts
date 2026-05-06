import { Scholarship } from "@/data/scholarships";
import { StudentProfile } from "@/types/profile";
import { ScholarshipType } from "@/types/profile";

const norm = (s: string) => s.trim().toLowerCase();
const hasOverlap = (val: string, list: string[]) =>
  list.some((l) => norm(val).includes(norm(l)) || norm(l).includes(norm(val)));

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[]; // matching reasons
  blockers: string[]; // why not eligible
}

export function checkEligibility(profile: StudentProfile, s: Scholarship): EligibilityResult {
  const reasons: string[] = [];
  const blockers: string[] = [];

  if (s.eligibleUniversities.length === 0) {
    reasons.push("Öppet för alla lärosäten");
  } else if (profile.universitet && hasOverlap(profile.universitet, s.eligibleUniversities)) {
    reasons.push(`Ditt lärosäte (${profile.universitet}) är behörigt`);
  } else {
    blockers.push(`Endast för: ${s.eligibleUniversities.join(", ")}`);
  }

  if (s.eligibleFields.length === 0) {
    reasons.push("Öppet för alla ämnesområden");
  } else if (
    (profile.amnesomrade && hasOverlap(profile.amnesomrade, s.eligibleFields)) ||
    (profile.program && hasOverlap(profile.program, s.eligibleFields))
  ) {
    reasons.push(`Ditt ämnesområde matchar (${s.eligibleFields.join(", ")})`);
  } else {
    blockers.push(`Riktar sig till: ${s.eligibleFields.join(", ")}`);
  }

  if (s.eligibleLocations.length === 0) {
    reasons.push("Inga geografiska krav");
  } else if (
    (profile.studieort && hasOverlap(profile.studieort, s.eligibleLocations)) ||
    (profile.hemort && hasOverlap(profile.hemort, s.eligibleLocations))
  ) {
    reasons.push(`Studieort matchar (${s.eligibleLocations.join(", ")})`);
  } else {
    blockers.push(`Studieort bör vara: ${s.eligibleLocations.join(", ")}`);
  }

  return { eligible: blockers.length === 0, reasons, blockers };
}

export function scholarshipTypes(s: Scholarship): ScholarshipType[] {
  const set = new Set<ScholarshipType>();
  const purposes = (s.purposes ?? []).map((p) => p.toLowerCase());
  const text = (s.description + " " + s.tags.join(" ")).toLowerCase();
  const has = (k: string) => purposes.some((p) => p.includes(k)) || text.includes(k);
  if (has("utbyte") || has("utlands") || has("resor")) set.add("Utlandsstudier");
  if (has("examensarbete") || has("uppsats")) set.add("Examensarbete");
  if (has("praktik")) set.add("Praktik");
  if (has("forskning") || has("projekt")) set.add("Forskning");
  if (
    has("levnadskost") || has("hyra") || has("kurslitteratur") ||
    has("fritt") || has("kompetensutveckling") || has("kursavgift") || s.needBased
  )
    set.add("Ekonomiskt stöd");
  if (set.size === 0) set.add("Ekonomiskt stöd");
  return Array.from(set);
}

export type DeadlineState = "open-not-applied" | "open-applied" | "closed";

export function deadlineState(s: Scholarship, applied: boolean): DeadlineState {
  const now = Date.now();
  const open = new Date(s.deadline).getTime() >= now;
  if (!open) return "closed";
  return applied ? "open-applied" : "open-not-applied";
}
