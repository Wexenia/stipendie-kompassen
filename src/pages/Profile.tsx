import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppScreen from "@/components/layout/AppScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, CheckCircle2, Shield, Upload, FileText, X } from "lucide-react";
import { SearchableCombobox } from "@/components/ui/SearchableCombobox";
import {
  EMPTY_PROFILE,
  StudentProfile,
  KON_OPTIONS,
  UNIVERSITET_OPTIONS,
  STUDIEORT_OPTIONS,
  AMNESOMRADE_OPTIONS,
  TERMIN_OPTIONS,
  SYFTE_OPTIONS,
  EKONOMI_OPTIONS,
  DocumentUpload,
} from "@/types/profile";
import { loadProfile, saveProfile } from "@/lib/storage";
import { toast } from "sonner";

const STEPS = ["Om dig", "Studier", "Engagemang", "Dokument"];

const DOC_TYPES = [
  { k: "cv", label: "CV" },
  { k: "personligtBrev", label: "Personligt brev" },
  { k: "rekommendationsbrev", label: "Rekommendationsbrev" },
  { k: "studieintyg", label: "Studieintyg" },
  { k: "andra", label: "Andra viktiga dokument" },
] as const;

export default function Profile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StudentProfile>(loadProfile() ?? EMPTY_PROFILE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!profile.namn.trim()) e.namn = "Namn krävs";
      if (!profile.kon) e.kon = "Välj kön för att kunna matchas mot stipendier med särskilda kriterier.";
      if (!profile.hemort.trim()) e.hemort = "Ange din hemort.";
    }
    if (step === 1) {
      if (!profile.universitet.trim()) e.universitet = "Ange din högskola eller skriv in den manuellt.";
      if (!profile.program.trim()) e.program = "Program krävs";
      if (!profile.amnesomrade.trim()) e.amnesomrade = "Välj ämnesområde";
      if (!profile.studieort.trim()) e.studieort = "Ange din studieort.";
    }
    if (step === 2) {
      if (!profile.syfte.trim()) e.syfte = "Välj ett alternativ";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) {
      toast.error("Komplettera de markerade fälten");
      return;
    }
    if (step === STEPS.length - 1) {
      saveProfile(profile);
      toast.success("Profil sparad!");
      navigate("/matchningar");
    } else {
      setStep((s) => s + 1);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <AppScreen
      title="Skapa profil"
      subtitle={`Steg ${step + 1} av ${STEPS.length} · ${STEPS[step]}`}
      back={step > 0}
    >
      <div className="space-y-4">
        <Progress value={progress} className="h-1.5" />

        <div className="space-y-3.5">
          {step === 0 && (
            <>
              <Field label="Namn *" error={errors.namn}>
                <Input value={profile.namn} onChange={(e) => update("namn", e.target.value)} placeholder="För- och efternamn" />
              </Field>

              <Field label="Kön *" error={errors.kon}>
                <RadioGroup
                  value={profile.kon}
                  onValueChange={(v) => update("kon", v)}
                  className="grid grid-cols-2 gap-2"
                >
                  {KON_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition-colors ${
                        profile.kon === opt
                          ? "border-primary bg-primary-soft"
                          : "border-border bg-secondary/40 hover:bg-secondary"
                      }`}
                    >
                      <RadioGroupItem value={opt} />
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>

              <Field
                label="Hemort *"
                error={errors.hemort}
                hint="Börja skriv – välj från förslag eller ange egen ort."
              >
                <Input
                  value={profile.hemort}
                  onChange={(e) => update("hemort", e.target.value)}
                  placeholder="t.ex. Malmö"
                  list="hemort-list"
                />
                <datalist id="hemort-list">
                  {HEMORT_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Universitet/högskola *" error={errors.universitet}>
                <Select value={profile.universitet} onValueChange={(v) => update("universitet", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj lärosäte" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSITET_OPTIONS.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Program/utbildning *" error={errors.program}>
                <Input
                  value={profile.program}
                  onChange={(e) => update("program", e.target.value)}
                  placeholder="t.ex. Civilingenjör Datateknik"
                />
              </Field>

              <Field label="Ämnesområde *" error={errors.amnesomrade}>
                <Select value={profile.amnesomrade} onValueChange={(v) => update("amnesomrade", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj ämnesområde" />
                  </SelectTrigger>
                  <SelectContent>
                    {AMNESOMRADE_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Termin/årskurs">
                  <Select value={profile.termin} onValueChange={(v) => update("termin", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj" />
                    </SelectTrigger>
                    <SelectContent>
                      {TERMIN_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Studieort *" error={errors.studieort}>
                  <Select value={profile.studieort} onValueChange={(v) => update("studieort", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj ort" />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDIEORT_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              {profile.studieort === "Annan studieort" && (
                <Field label="Ange studieort *" error={errors.studieortAnnan}>
                  <Input
                    value={profile.studieortAnnan ?? ""}
                    onChange={(e) => update("studieortAnnan", e.target.value)}
                    placeholder="Skriv din studieort"
                  />
                </Field>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Föreningsengagemang / ideellt arbete">
                <Textarea
                  rows={3}
                  value={profile.engagemang}
                  onChange={(e) => update("engagemang", e.target.value)}
                  placeholder="t.ex. Styrelsemedlem i kårsektion"
                />
              </Field>
              <Field label="Intressen">
                <Textarea
                  rows={2}
                  value={profile.intressen}
                  onChange={(e) => update("intressen", e.target.value)}
                  placeholder="t.ex. AI, hållbarhet"
                />
              </Field>

              <Field
                label="Vad är ditt huvudsakliga skäl till att söka stipendium? *"
                error={errors.syfte}
                hint="Du behöver inte ha ett särskilt projekt. Välj det alternativ som passar bäst. Du kan alltid utveckla ditt svar senare i ansökan."
              >
                <Select value={profile.syfte} onValueChange={(v) => update("syfte", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj alternativ" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYFTE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {profile.syfte === "Annat" && (
                <Field label="Beskriv kort vad stipendiet ska användas till.">
                  <Textarea
                    rows={2}
                    value={profile.syfteAnnan ?? ""}
                    onChange={(e) => update("syfteAnnan", e.target.value)}
                    placeholder="Frivilligt – beskriv kort"
                  />
                </Field>
              )}

              <Field
                label="Hur vill du beskriva din ekonomiska situation?"
                hint="Detta används endast för att matcha stipendier där ekonomiskt behov är relevant. Du kan beskriva situationen mer utförligt senare i ett personligt brev."
              >
                <Select value={profile.ekonomi} onValueChange={(v) => update("ekonomi", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj alternativ" />
                  </SelectTrigger>
                  <SelectContent>
                    {EKONOMI_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Vill du lägga till något kort om din ekonomiska situation? (valfritt)">
                <Textarea
                  rows={2}
                  value={profile.ekonomiKommentar ?? ""}
                  onChange={(e) => update("ekonomiKommentar", e.target.value)}
                  placeholder="Frivilligt"
                />
              </Field>

              <Field
                label="Personlig bakgrund till ansökan"
                hint="Skriv 3–5 meningar om dig själv, din utbildning, dina mål och varför stipendier kan vara relevanta för dig. Du behöver inte skriva ett färdigt personligt brev här."
              >
                <Textarea
                  rows={5}
                  value={profile.bakgrund}
                  onChange={(e) => update("bakgrund", e.target.value)}
                  placeholder="Exempel: Jag studerar … Mitt mål är att … Jag söker stipendier eftersom …"
                />
                <BakgrundCounter value={profile.bakgrund} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <h3 className="text-sm font-semibold">Ladda upp dokument</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Du kan ladda upp dokument som kan behövas i stipendieansökningar. Detta är frivilligt och kan kompletteras senare.
                </p>
              </div>

              <div className="space-y-2">
                {DOC_TYPES.map(({ k, label }) => (
                  <DocUploadRow
                    key={k}
                    label={label}
                    docType={k}
                    uploads={profile.uploads ?? []}
                    onAdd={(u) =>
                      update("uploads", [
                        ...(profile.uploads ?? []).filter((x) => x.documentType !== u.documentType),
                        u,
                      ])
                    }
                    onRemove={(type) =>
                      update("uploads", (profile.uploads ?? []).filter((x) => x.documentType !== type))
                    }
                  />
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground">
                Accepterade filtyper: PDF, DOC, DOCX. Dokumenten sparas endast lokalt i denna prototyp.
              </p>

              <div className="flex items-start gap-2 rounded-2xl bg-primary-soft border border-primary/15 p-3 text-xs">
                <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-foreground/80">
                  Din profil sparas endast lokalt. Dela inte känsliga personuppgifter om det inte behövs.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-2 sticky bottom-0 bg-app/0">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="rounded-xl flex-1">
              Tillbaka
            </Button>
          )}
          <Button onClick={next} className="rounded-xl flex-1 shadow-glow">
            {step === STEPS.length - 1 ? (
              <><CheckCircle2 className="mr-1 h-4 w-4" /> Spara & matcha</>
            ) : (
              <>Nästa <ArrowRight className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </AppScreen>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-foreground/80">{label}</Label>
      {children}
      {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function BakgrundCounter({ value }: { value: string }) {
  const len = value.trim().length;
  const ok = len >= 300 && len <= 700;
  const tooShort = len > 0 && len < 300;
  return (
    <p className={`text-[11px] ${ok ? "text-success" : "text-muted-foreground"}`}>
      {len} tecken {tooShort && "· Tips: 300–700 tecken brukar fungera bra"}
      {len === 0 && "· Rekommenderad längd: 300–700 tecken"}
      {len > 700 && "· Något långt – men det går bra"}
    </p>
  );
}

function DocUploadRow({
  label,
  docType,
  uploads,
  onAdd,
  onRemove,
}: {
  label: string;
  docType: string;
  uploads: DocumentUpload[];
  onAdd: (u: DocumentUpload) => void;
  onRemove: (type: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const existing = uploads.find((u) => u.documentType === docType);

  const handleFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "doc", "docx"].includes(ext)) {
      toast.error("Filtypen stöds inte. Använd PDF, DOC eller DOCX.");
      return;
    }
    onAdd({
      documentType: docType,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
    });
    toast.success(`${label} tillagt`);
  };

  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium truncate">{label}</span>
        </div>
        {!existing ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-xl h-8"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5 mr-1" /> Ladda upp
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="rounded-xl h-8 text-destructive hover:text-destructive"
            onClick={() => onRemove(docType)}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Ta bort
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {existing && (
        <p className="mt-2 text-[11px] text-muted-foreground truncate">
          {existing.fileName} · uppladdat {new Date(existing.uploadDate).toLocaleDateString("sv-SE")}
        </p>
      )}
    </div>
  );
}
