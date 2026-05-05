import { useEffect, useState } from "react";

export type Lang = "sv" | "en";

const KEY = "stipendia.lang";

export function getLang(): Lang {
  if (typeof window === "undefined") return "sv";
  return (localStorage.getItem(KEY) as Lang) || "sv";
}

export function setLang(l: Lang) {
  localStorage.setItem(KEY, l);
  window.dispatchEvent(new Event("stipendia:lang"));
}

const dict = {
  sv: {
    "nav.home": "Hem",
    "nav.profile": "Profil",
    "nav.scholarships": "Stipendier",
    "nav.matches": "Matchningar",
    "nav.settings": "Inställningar",
    "settings.title": "Inställningar",
    "settings.notifications": "Notiser",
    "settings.deadlineReminders": "Påminnelser om deadlines",
    "settings.newScholarships": "Nya stipendier",
    "settings.matchUpdates": "Matchningsuppdateringar",
    "settings.language": "Språk",
    "settings.swedish": "Svenska",
    "settings.english": "English",
    "settings.data": "Data",
    "settings.resetProfile": "Återställ profil",
    "settings.deleteAll": "Ta bort sparad data",
    "settings.confirmReset": "Är du säker på att du vill återställa profilen?",
    "settings.confirmDelete": "Vill du radera all sparad data (profil, utkast, sparade)?",
    "settings.done": "Klart",
  },
  en: {
    "nav.home": "Home",
    "nav.profile": "Profile",
    "nav.scholarships": "Scholarships",
    "nav.matches": "Matches",
    "nav.settings": "Settings",
    "settings.title": "Settings",
    "settings.notifications": "Notifications",
    "settings.deadlineReminders": "Deadline reminders",
    "settings.newScholarships": "New scholarships",
    "settings.matchUpdates": "Match updates",
    "settings.language": "Language",
    "settings.swedish": "Svenska",
    "settings.english": "English",
    "settings.data": "Data",
    "settings.resetProfile": "Reset profile",
    "settings.deleteAll": "Delete saved data",
    "settings.confirmReset": "Are you sure you want to reset your profile?",
    "settings.confirmDelete": "Delete all saved data (profile, drafts, saved)?",
    "settings.done": "Done",
  },
} as const;

export type TKey = keyof typeof dict["sv"];

export function useLang(): Lang {
  const [lang, setLangState] = useState<Lang>(getLang());
  useEffect(() => {
    const h = () => setLangState(getLang());
    window.addEventListener("stipendia:lang", h);
    return () => window.removeEventListener("stipendia:lang", h);
  }, []);
  return lang;
}

export function useT() {
  const lang = useLang();
  return (k: TKey) => dict[lang][k] ?? dict.sv[k] ?? k;
}
