import { beforeEach, describe, expect, it } from "vitest";
import { DOC_TYPES, EMPTY_PROFILE } from "@/types/profile";
import { loadProfile } from "./storage";

describe("profile storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps Studieintyg as an uploadable document type", () => {
    expect(DOC_TYPES.some((doc) => doc.k === "studieintyg" && doc.label === "Studieintyg")).toBe(true);
  });

  it("migrates legacy document flags into uploads", () => {
    localStorage.setItem("stipendia.profile", JSON.stringify({
      ...EMPTY_PROFILE,
      dokument: { studieintyg: true, cv: true },
      uploads: [],
    }));

    const loaded = loadProfile();

    expect(loaded?.uploads?.map((upload) => upload.documentType)).toEqual(
      expect.arrayContaining(["studieintyg", "cv"])
    );
  });
});
