export interface Scholarship {
  id: string;
  name: string;
  amount: number;
  deadline: string; // ISO date
  organization: string;
  eligibleUniversities: string[]; // empty = all
  eligibleFields: string[]; // empty = all
  eligibleLocations: string[]; // empty = all
  criteria: string[];
  description: string;
  requiredDocuments: string[];
  applicationUrl: string;
  tags: string[];
  purposes?: string[]; // utbytesstudier, forskning, kurslitteratur, etc.
  needBased?: boolean;
  engagementRequired?: boolean;
}

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "chalmers-stiftelsen",
    name: "Chalmersska Forskningsfondens Stipendium",
    amount: 25000,
    deadline: "2026-06-15",
    organization: "Chalmersska Forskningsfonden",
    eligibleUniversities: ["Chalmers tekniska högskola"],
    eligibleFields: ["Teknik", "Ingenjörsvetenskap", "Datavetenskap"],
    eligibleLocations: ["Göteborg"],
    criteria: [
      "Studerar vid Chalmers tekniska högskola",
      "Pågående teknisk utbildning",
      "Goda studieresultat",
    ],
    description:
      "Stipendium för studenter vid Chalmers som visar starka studieresultat och engagemang inom teknik och ingenjörsvetenskap. Pengarna kan användas till studierelaterade kostnader, utbytesstudier eller examensarbete.",
    requiredDocuments: ["Studieintyg", "CV", "Personligt brev"],
    applicationUrl: "https://example.com/chalmersska",
    tags: ["Teknik", "Göteborg", "Chalmers"],
    purposes: ["utbytesstudier", "examensarbete", "kurslitteratur"],
  },
  {
    id: "ingenjor-framtid",
    name: "Ingenjörens Framtidsstipendium",
    amount: 15000,
    deadline: "2026-05-30",
    organization: "Sveriges Ingenjörer",
    eligibleUniversities: [],
    eligibleFields: ["Teknik", "Ingenjörsvetenskap", "Datavetenskap", "Elektroteknik", "Maskinteknik"],
    eligibleLocations: [],
    criteria: [
      "Studerar till civil- eller högskoleingenjör",
      "Termin 3 eller högre",
      "Engagemang i studentförening meriterande",
    ],
    description:
      "Riktar sig till ingenjörsstudenter i hela Sverige som vill utvecklas i sitt framtida yrke. Stipendiet kan användas för konferensresor, kompetensutveckling eller projekt.",
    requiredDocuments: ["Studieintyg", "CV", "Personligt brev"],
    applicationUrl: "https://example.com/ingenjor",
    tags: ["Teknik", "Ingenjör", "Hela Sverige"],
    purposes: ["konferens", "projekt", "kompetensutveckling"],
    engagementRequired: false,
  },
  {
    id: "vard-medicin",
    name: "Stipendium för Vård- och Medicinteknik",
    amount: 20000,
    deadline: "2026-04-20",
    organization: "Stiftelsen för Medicinsk Forskning",
    eligibleUniversities: [],
    eligibleFields: ["Medicin", "Vård", "Medicinteknik", "Biomedicin", "Sjuksköterska"],
    eligibleLocations: [],
    criteria: [
      "Studerar inom vård, medicin eller medicinteknik",
      "Intresse för forskning eller patientnära arbete",
    ],
    description:
      "Stöd till studenter inom vård- och medicinteknik som vill bidra till framtidens hälso- och sjukvård. Lämpligt för uppsats, projekt eller utbytesstudier.",
    requiredDocuments: ["Studieintyg", "CV", "Personligt brev", "Rekommendationsbrev"],
    applicationUrl: "https://example.com/vard",
    tags: ["Vård", "Medicin", "Forskning"],
    purposes: ["forskning", "utbytesstudier", "examensarbete"],
  },
  {
    id: "behov-stiftelse",
    name: "Studenthjälpens Behovsstipendium",
    amount: 12000,
    deadline: "2026-03-31",
    organization: "Stiftelsen Studenthjälpen",
    eligibleUniversities: [],
    eligibleFields: [],
    eligibleLocations: [],
    criteria: [
      "Svensk universitetsstudent",
      "Begränsad ekonomi",
      "Behovsprövning sker",
    ],
    description:
      "Behovsprövat stipendium som hjälper studenter med begränsad ekonomi att klara av sina studier. Pengarna kan användas till hyra, kurslitteratur eller andra studierelaterade utgifter.",
    requiredDocuments: ["Studieintyg", "Personligt brev"],
    applicationUrl: "https://example.com/behov",
    tags: ["Behovsprövat", "Ekonomiskt stöd"],
    purposes: ["levnadskostnader", "kurslitteratur", "hyra"],
    needBased: true,
  },
  {
    id: "forening-engagemang",
    name: "Engagemangsstipendiet",
    amount: 10000,
    deadline: "2026-05-15",
    organization: "Civilsamhällets Stiftelse",
    eligibleUniversities: [],
    eligibleFields: [],
    eligibleLocations: [],
    criteria: [
      "Aktivt föreningsengagemang eller ideellt arbete",
      "Pågående högskolestudier",
    ],
    description:
      "Belönar studenter som vid sidan av studierna engagerar sig ideellt i föreningsliv eller civilsamhälle. Stipendiet är ett tack för insatsen och kan användas fritt för studierelaterade ändamål.",
    requiredDocuments: ["CV", "Personligt brev", "Rekommendationsbrev"],
    applicationUrl: "https://example.com/engagemang",
    tags: ["Engagemang", "Ideellt arbete"],
    purposes: ["fritt", "kompetensutveckling"],
    engagementRequired: true,
  },
  {
    id: "goteborg-stad",
    name: "Göteborgs Studentstipendium",
    amount: 8000,
    deadline: "2026-06-01",
    organization: "Göteborgs Stadsstiftelse",
    eligibleUniversities: [
      "Göteborgs universitet",
      "Chalmers tekniska högskola",
    ],
    eligibleFields: [],
    eligibleLocations: ["Göteborg"],
    criteria: [
      "Studerar i Göteborg",
      "Folkbokförd i Västra Götaland meriterande",
    ],
    description:
      "Stipendium för studenter som studerar vid lärosäte i Göteborg. Öppet för alla ämnesområden, med viss prioritet för studenter med koppling till regionen.",
    requiredDocuments: ["Studieintyg", "Personligt brev"],
    applicationUrl: "https://example.com/goteborg",
    tags: ["Göteborg", "Regionalt"],
    purposes: ["fritt", "kurslitteratur"],
  },
  {
    id: "utbyte-internationellt",
    name: "Internationella Utbytesstipendiet",
    amount: 30000,
    deadline: "2026-09-15",
    organization: "Stiftelsen för Internationella Studier",
    eligibleUniversities: [],
    eligibleFields: [],
    eligibleLocations: [],
    criteria: [
      "Antagen till utbytesstudier utomlands",
      "Pågående högskolestudier i Sverige",
      "Goda studieresultat",
    ],
    description:
      "Bidrag till studenter som ska genomföra en termin eller ett år av utbytesstudier utomlands. Kan användas till resor, boende och levnadsomkostnader.",
    requiredDocuments: ["Studieintyg", "CV", "Personligt brev", "Rekommendationsbrev"],
    applicationUrl: "https://example.com/utbyte",
    tags: ["Utbytesstudier", "Internationellt"],
    purposes: ["utbytesstudier", "resor", "levnadskostnader"],
  },
  {
    id: "kvinnor-teknik",
    name: "Kvinnor inom Teknik-stipendiet",
    amount: 18000,
    deadline: "2026-04-30",
    organization: "Tekniksprånget Foundation",
    eligibleUniversities: [],
    eligibleFields: ["Teknik", "Datavetenskap", "Ingenjörsvetenskap", "Elektroteknik"],
    eligibleLocations: [],
    criteria: [
      "Identifierar sig som kvinna",
      "Studerar inom teknik eller IT",
      "Engagemang för jämställdhet meriterande",
    ],
    description:
      "Stipendium för att stötta och uppmärksamma kvinnor inom de tekniska disciplinerna. Bidrar till en mer jämställd teknikbransch.",
    requiredDocuments: ["Studieintyg", "CV", "Personligt brev"],
    applicationUrl: "https://example.com/kvinnor-teknik",
    tags: ["Teknik", "Jämställdhet"],
    purposes: ["fritt", "konferens", "projekt"],
  },
  {
    id: "ekonomi-handel",
    name: "Handelsstipendiet",
    amount: 15000,
    deadline: "2026-05-10",
    organization: "Handelns Forskningsstiftelse",
    eligibleUniversities: [
      "Handelshögskolan i Stockholm",
      "Handelshögskolan vid Göteborgs universitet",
      "Lunds universitet",
    ],
    eligibleFields: ["Ekonomi", "Företagsekonomi", "Nationalekonomi", "Marknadsföring"],
    eligibleLocations: [],
    criteria: [
      "Studerar ekonomi vid svensk handelshögskola",
      "Goda studieresultat",
    ],
    description:
      "Stipendium för ekonomistudenter med fokus på handel, marknadsföring eller företagande. Lämpligt för uppsatsskrivning eller utbytesstudier.",
    requiredDocuments: ["Studieintyg", "CV", "Personligt brev"],
    applicationUrl: "https://example.com/handel",
    tags: ["Ekonomi", "Handel"],
    purposes: ["examensarbete", "utbytesstudier"],
  },
  {
    id: "humaniora-kultur",
    name: "Humaniora- och Kulturstipendiet",
    amount: 10000,
    deadline: "2026-06-20",
    organization: "Kulturstiftelsen",
    eligibleUniversities: [],
    eligibleFields: ["Humaniora", "Språk", "Historia", "Litteraturvetenskap", "Konstvetenskap"],
    eligibleLocations: [],
    criteria: [
      "Studerar inom humaniora eller kultur",
      "Pågående högskolestudier",
    ],
    description:
      "Stöd till studenter inom humaniora och kultur som vill fördjupa sig i sitt ämne. Stipendiet kan användas för forskningsresor, kurslitteratur eller projekt.",
    requiredDocuments: ["Studieintyg", "Personligt brev"],
    applicationUrl: "https://example.com/humaniora",
    tags: ["Humaniora", "Kultur"],
    purposes: ["forskning", "resor", "projekt"],
  },
  {
    id: "lund-stipendium",
    name: "Lunds Akademiska Stipendium",
    amount: 14000,
    deadline: "2026-05-25",
    organization: "Lunds Universitetsstiftelser",
    eligibleUniversities: ["Lunds universitet"],
    eligibleFields: [],
    eligibleLocations: ["Lund"],
    criteria: [
      "Studerar vid Lunds universitet",
      "Termin 2 eller högre",
    ],
    description:
      "Allmänt akademiskt stipendium för studenter vid Lunds universitet. Öppet för alla ämnesområden.",
    requiredDocuments: ["Studieintyg", "Personligt brev"],
    applicationUrl: "https://example.com/lund",
    tags: ["Lund", "Akademiskt"],
    purposes: ["fritt", "kurslitteratur", "examensarbete"],
  },
  {
    id: "uppsala-allman",
    name: "Uppsala Studentstipendium",
    amount: 12000,
    deadline: "2026-04-15",
    organization: "Uppsala Studentstiftelser",
    eligibleUniversities: ["Uppsala universitet", "Sveriges lantbruksuniversitet"],
    eligibleFields: [],
    eligibleLocations: ["Uppsala"],
    criteria: [
      "Studerar i Uppsala",
      "Goda studieresultat",
    ],
    description:
      "Stipendium för studenter vid lärosäte i Uppsala. Bred inriktning, öppet för alla ämnesområden.",
    requiredDocuments: ["Studieintyg", "CV", "Personligt brev"],
    applicationUrl: "https://example.com/uppsala",
    tags: ["Uppsala", "Akademiskt"],
    purposes: ["fritt", "kurslitteratur"],
  },
  {
    id: "samhalle-forandring",
    name: "Samhällsförändrarens Stipendium",
    amount: 20000,
    deadline: "2026-07-01",
    organization: "Stiftelsen för Social Innovation",
    eligibleUniversities: [],
    eligibleFields: [],
    eligibleLocations: [],
    criteria: [
      "Engagemang i samhällsfrågor eller ideellt arbete",
      "Vilja att driva förändring",
    ],
    description:
      "Stipendium för studenter som genom engagemang och projekt vill bidra till positiv samhällsförändring. Tvärvetenskapligt och öppet för alla ämnen.",
    requiredDocuments: ["CV", "Personligt brev", "Rekommendationsbrev"],
    applicationUrl: "https://example.com/samhalle",
    tags: ["Samhälle", "Engagemang", "Innovation"],
    purposes: ["projekt", "fritt"],
    engagementRequired: true,
  },
];
