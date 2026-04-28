import { StudentProfile, SavedDraft } from "@/types/profile";

const KEYS = {
  profile: "stipendia.profile",
  saved: "stipendia.saved",
  drafts: "stipendia.drafts",
};

export function loadProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.profile);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: StudentProfile) {
  localStorage.setItem(KEYS.profile, JSON.stringify(p));
  window.dispatchEvent(new Event("stipendia:update"));
}

export function clearProfile() {
  localStorage.removeItem(KEYS.profile);
  window.dispatchEvent(new Event("stipendia:update"));
}

export function loadSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.saved);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSaved(id: string): string[] {
  const cur = loadSavedIds();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem(KEYS.saved, JSON.stringify(next));
  window.dispatchEvent(new Event("stipendia:update"));
  return next;
}

export function loadDrafts(): SavedDraft[] {
  try {
    const raw = localStorage.getItem(KEYS.drafts);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDraft(draft: SavedDraft) {
  const cur = loadDrafts().filter((d) => d.scholarshipId !== draft.scholarshipId);
  cur.push(draft);
  localStorage.setItem(KEYS.drafts, JSON.stringify(cur));
  window.dispatchEvent(new Event("stipendia:update"));
}

export function deleteDraft(scholarshipId: string) {
  const cur = loadDrafts().filter((d) => d.scholarshipId !== scholarshipId);
  localStorage.setItem(KEYS.drafts, JSON.stringify(cur));
  window.dispatchEvent(new Event("stipendia:update"));
}
