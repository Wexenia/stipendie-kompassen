// Simple obvious profanity list (sv/en). Conservative on purpose.
const PROFANITY = [
  "fitta", "kuk", "hora", "knulla", "jävla", "fan", "fuck", "shit", "bitch", "asshole", "cunt", "dick", "nigger",
];

const NAME_ALLOWED = /^[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö' \-]+$/;
const HAS_DIGIT = /\d/;

export type NameError = "required" | "digits" | "invalid" | "profanity" | null;

export function validateName(value: string): NameError {
  const v = value.trim();
  if (!v) return "required";
  if (HAS_DIGIT.test(v)) return "digits";
  if (!NAME_ALLOWED.test(v)) return "invalid";
  const lower = v.toLowerCase();
  if (PROFANITY.some((w) => lower.includes(w))) return "profanity";
  return null;
}
