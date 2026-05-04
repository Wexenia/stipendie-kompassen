export interface DocumentUpload {
  documentType: string;
  fileName: string;
  uploadDate: string;
}

export interface StudentProfile {
  namn: string;
  universitet: string;
  program: string;
  amnesomrade: string;
  termin: string;
  studieort: string;
  studieortAnnan?: string;
  hemort: string;
  kon: string;
  ekonomi: string;
  ekonomiKommentar?: string;
  engagemang: string;
  intressen: string;
  syfte: string;
  syfteAnnan?: string;
  bakgrund: string;
  dokument: {
    studieintyg: boolean;
    cv: boolean;
    personligtBrev: boolean;
    rekommendationsbrev: boolean;
  };
  uploads?: DocumentUpload[];
}

export const EMPTY_PROFILE: StudentProfile = {
  namn: "",
  universitet: "",
  program: "",
  amnesomrade: "",
  termin: "",
  studieort: "",
  studieortAnnan: "",
  hemort: "",
  kon: "",
  ekonomi: "",
  ekonomiKommentar: "",
  engagemang: "",
  intressen: "",
  syfte: "",
  syfteAnnan: "",
  bakgrund: "",
  dokument: {
    studieintyg: false,
    cv: false,
    personligtBrev: false,
    rekommendationsbrev: false,
  },
  uploads: [],
};

export interface SavedDraft {
  scholarshipId: string;
  scholarshipName: string;
  text: string;
  updatedAt: string;
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
  "Falun", "Kiruna", "Visby", "Karlskrona",
];

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
