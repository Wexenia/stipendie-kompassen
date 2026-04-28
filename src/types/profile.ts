export interface StudentProfile {
  namn: string;
  universitet: string;
  program: string;
  amnesomrade: string;
  termin: string;
  studieort: string;
  hemort: string;
  kon?: string;
  ekonomi?: string;
  engagemang: string;
  intressen: string;
  syfte: string;
  bakgrund: string;
  dokument: {
    studieintyg: boolean;
    cv: boolean;
    personligtBrev: boolean;
    rekommendationsbrev: boolean;
  };
}

export const EMPTY_PROFILE: StudentProfile = {
  namn: "",
  universitet: "",
  program: "",
  amnesomrade: "",
  termin: "",
  studieort: "",
  hemort: "",
  kon: "",
  ekonomi: "",
  engagemang: "",
  intressen: "",
  syfte: "",
  bakgrund: "",
  dokument: {
    studieintyg: false,
    cv: false,
    personligtBrev: false,
    rekommendationsbrev: false,
  },
};

export interface SavedDraft {
  scholarshipId: string;
  scholarshipName: string;
  text: string;
  updatedAt: string;
}
