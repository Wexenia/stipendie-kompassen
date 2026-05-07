import { describe, expect, it } from "vitest";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { checkEligibility } from "./eligibility";
import { EMPTY_PROFILE, EKONOMI_OPTIONS, StudentProfile } from "@/types/profile";

const profile = (overrides: Partial<StudentProfile> = {}): StudentProfile => ({
  ...EMPTY_PROFILE,
  firstName: "Anna",
  lastName: "Andersson",
  kon: "Kvinna",
  hemort: "Göteborg",
  universitet: "Chalmers tekniska högskola",
  program: "Civilingenjör Datateknik",
  amnesomrade: "Teknik / Ingenjörsvetenskap",
  termin: "Termin 4",
  studieort: "Göteborg",
  syfte: "Extra ekonomiskt stöd under studierna",
  ekonomi: EKONOMI_OPTIONS[1],
  ...overrides,
});

describe("checkEligibility", () => {
  it("blocks need-based scholarships when the profile has no economic need", () => {
    const scholarship = SCHOLARSHIPS.find((s) => s.id === "behov-stiftelse")!;

    const result = checkEligibility(profile({ ekonomi: EKONOMI_OPTIONS[0] }), scholarship);

    expect(result.eligible).toBe(false);
    expect(result.blockers).toContain("Stipendiet är behovsprövat och kräver begränsad ekonomi");
  });

  it("blocks engagement scholarships when engagement is missing", () => {
    const scholarship = SCHOLARSHIPS.find((s) => s.id === "forening-engagemang")!;

    const result = checkEligibility(profile({ engagemang: "" }), scholarship);

    expect(result.eligible).toBe(false);
    expect(result.blockers).toContain("Stipendiet kräver föreningsengagemang eller ideellt arbete");
  });

  it("blocks women-in-tech scholarships for non-matching gender", () => {
    const scholarship = SCHOLARSHIPS.find((s) => s.id === "kvinnor-teknik")!;

    const result = checkEligibility(profile({ kon: "Man" }), scholarship);

    expect(result.eligible).toBe(false);
    expect(result.blockers).toContain("Stipendiet riktar sig till sökande som identifierar sig som kvinna");
  });
});
