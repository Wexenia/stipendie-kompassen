export interface DocumentUpload {
  documentType: string;
  fileName: string;
  uploadDate: string;
}

export interface StudentProfile {
  firstName: string;
  lastName: string;
  universitet: string;
  program: string;
  amnesomrade: string;
  termin: string;
  studieort: string;
  hemort: string;
  kon: string;
  ekonomi: string;
  ekonomiKommentar?: string;
  engagemang: string;
  intressen: string;
  syfte: string;
  syfteAnnan?: string;
  dokument: {
    studieintyg: boolean;
    cv: boolean;
    personligtBrev: boolean;
    rekommendationsbrev: boolean;
  };
  uploads?: DocumentUpload[];
}

export const EMPTY_PROFILE: StudentProfile = {
  firstName: "",
  lastName: "",
  universitet: "",
  program: "",
  amnesomrade: "",
  termin: "",
  studieort: "",
  hemort: "",
  kon: "",
  ekonomi: "",
  ekonomiKommentar: "",
  engagemang: "",
  intressen: "",
  syfte: "",
  syfteAnnan: "",
  dokument: {
    studieintyg: false,
    cv: false,
    personligtBrev: false,
    rekommendationsbrev: false,
  },
  uploads: [],
};

export type ApplicationStatus = "utkast" | "paborjad" | "skickad" | "arkiverad";

export interface SavedApplication {
  scholarshipId: string;
  scholarshipName: string;
  text: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// Backwards-compat alias
export type SavedDraft = SavedApplication;

// Required field set for "completeness". Excludes optional fields.
export const PROFILE_REQUIRED_FIELDS: (keyof StudentProfile)[] = [
  "firstName",
  "lastName",
  "kon",
  "hemort",
  "universitet",
  "program",
  "amnesomrade",
  "termin",
  "studieort",
  "syfte",
  "ekonomi",
];

export function profileCompleteness(p: StudentProfile | null): number {
  if (!p) return 0;
  const total = PROFILE_REQUIRED_FIELDS.length;
  const filled = PROFILE_REQUIRED_FIELDS.filter((k) => {
    const v = (p as any)[k];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
  return Math.round((filled / total) * 100);
}

export function isProfileComplete(p: StudentProfile | null): boolean {
  return profileCompleteness(p) === 100;
}

// Predefined options
export const KON_OPTIONS = ["Kvinna", "Man", "Annat", "Vill inte uppge"] as const;

export const UNIVERSITET_OPTIONS = [
  "Göteborgs universitet",
  "Chalmers tekniska högskola",
  "Stockholms universitet",
  "Kungliga Tekniska högskolan (KTH)",
  "Karolinska Institutet",
  "Handelshögskolan i Stockholm",
  "Uppsala universitet",
  "Sveriges lantbruksuniversitet",
  "Lunds universitet",
  "Umeå universitet",
  "Linköpings universitet",
  "Örebro universitet",
  "Karlstads universitet",
  "Linnéuniversitetet",
  "Mittuniversitetet",
  "Malmö universitet",
  "Södertörns högskola",
  "Annat lärosäte",
] as const;

export const STUDIEORT_OPTIONS = [
  "Göteborg",
  "Stockholm",
  "Lund",
  "Uppsala",
  "Umeå",
  "Linköping",
  "Örebro",
  "Växjö",
  "Karlstad",
  "Annan studieort",
] as const;

export const HEMORT_SUGGESTIONS = [
  "Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping", "Västerås", "Örebro",
  "Helsingborg", "Norrköping", "Jönköping", "Umeå", "Lund", "Borås", "Sundsvall",
  "Gävle", "Eskilstuna", "Halmstad", "Växjö", "Karlstad", "Kristianstad",
  "Södertälje", "Kalmar", "Östersund", "Trollhättan", "Luleå", "Skellefteå",
  "Falun", "Kiruna", "Visby", "Karlskrona", "Nyköping", "Varberg", "Motala",
  "Lidköping", "Piteå", "Mariestad", "Sandviken", "Hudiksvall", "Enköping",
  "Köping", "Falkenberg", "Skövde", "Ystad",
] as const;

export const AMNESOMRADE_OPTIONS = [
  "Teknik / Ingenjörsvetenskap",
  "Datavetenskap / IT",
  "Medicin / Vård",
  "Naturvetenskap",
  "Ekonomi / Handel",
  "Juridik",
  "Samhällsvetenskap",
  "Humaniora / Språk",
  "Konst / Kultur / Design",
  "Pedagogik / Lärarutbildning",
  "Lantbruk / Miljö",
  "Annat",
] as const;

export const TERMIN_OPTIONS = [
  "Termin 1",
  "Termin 2",
  "Termin 3",
  "Termin 4",
  "Termin 5",
  "Termin 6",
  "Termin 7",
  "Termin 8",
  "Termin 9 eller högre",
  "Masterstudent",
  "Doktorand",
] as const;

export const SYFTE_OPTIONS = [
  { value: "Extra ekonomiskt stöd under studierna", tags: ["ekonomiskt stöd", "levnadskostnader", "fritt"] },
  { value: "Utlandsstudier eller utbyte", tags: ["utbytesstudier", "utlandsstudier", "resor"] },
  { value: "Examensarbete", tags: ["examensarbete"] },
  { value: "Praktik", tags: ["praktik"] },
  { value: "Forskningsprojekt", tags: ["forskning", "projekt"] },
  { value: "Studieresa", tags: ["studieresa", "resor", "konferens"] },
  { value: "Kursavgift eller utbildningskostnader", tags: ["kursavgift", "kurslitteratur"] },
  { value: "Boende eller levnadsomkostnader", tags: ["levnadskostnader", "hyra"] },
  { value: "Annat", tags: ["fritt"] },
] as const;

export const EKONOMI_OPTIONS = [
  "Jag har inget särskilt ekonomiskt behov",
  "Jag har begränsad ekonomi under studierna",
  "Jag har svårt att täcka levnadsomkostnader",
  "Jag söker främst för att finansiera ett särskilt ändamål",
  "Vill inte uppge",
] as const;

export const DOC_TYPES = [
  { k: "cv", label: "CV" },
  { k: "personligtBrev", label: "Personligt brev" },
  { k: "rekommendationsbrev", label: "Rekommendationsbrev" },
  { k: "studieintyg", label: "Studieintyg" },
  { k: "andra", label: "Andra viktiga dokument" },
] as const;
