import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppScreen from "@/components/layout/AppScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { EMPTY_PROFILE, StudentProfile } from "@/types/profile";
import { loadProfile, saveProfile } from "@/lib/storage";
import { toast } from "sonner";

const STEPS = ["Om dig", "Studier", "Engagemang", "Dokument"];

export default function Profile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StudentProfile>(loadProfile() ?? EMPTY_PROFILE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !profile.namn.trim()) e.namn = "Namn krävs";
    if (step === 1) {
      if (!profile.universitet.trim()) e.universitet = "Lärosäte krävs";
      if (!profile.program.trim()) e.program = "Program krävs";
      if (!profile.amnesomrade.trim()) e.amnesomrade = "Ämnesområde krävs";
    }
    if (step === 2 && !profile.syfte.trim()) e.syfte = "Beskriv vad stipendiet ska användas till";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
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
              <Field label="Hemort">
                <Input value={profile.hemort} onChange={(e) => update("hemort", e.target.value)} placeholder="t.ex. Malmö" />
              </Field>
              <Field label="Kön (valfritt)">
                <Input value={profile.kon ?? ""} onChange={(e) => update("kon", e.target.value)} placeholder="t.ex. Kvinna, Man, Annat" />
              </Field>
              <Field label="Ekonomisk situation (valfritt)" hint="Relevant för behovsprövade stipendier.">
                <Textarea rows={2} value={profile.ekonomi ?? ""} onChange={(e) => update("ekonomi", e.target.value)} placeholder="t.ex. Begränsad ekonomi" />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Universitet/högskola *" error={errors.universitet}>
                <Input value={profile.universitet} onChange={(e) => update("universitet", e.target.value)} placeholder="t.ex. Chalmers tekniska högskola" />
              </Field>
              <Field label="Program/utbildning *" error={errors.program}>
                <Input value={profile.program} onChange={(e) => update("program", e.target.value)} placeholder="t.ex. Civilingenjör Datateknik" />
              </Field>
              <Field label="Ämnesområde *" error={errors.amnesomrade} hint="Teknik, Medicin, Ekonomi, Humaniora ...">
                <Input value={profile.amnesomrade} onChange={(e) => update("amnesomrade", e.target.value)} placeholder="t.ex. Teknik" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Termin">
                  <Input value={profile.termin} onChange={(e) => update("termin", e.target.value)} placeholder="t.ex. Termin 5" />
                </Field>
                <Field label="Studieort">
                  <Input value={profile.studieort} onChange={(e) => update("studieort", e.target.value)} placeholder="t.ex. Göteborg" />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Föreningsengagemang / ideellt arbete">
                <Textarea rows={3} value={profile.engagemang} onChange={(e) => update("engagemang", e.target.value)} placeholder="t.ex. Styrelsemedlem i kårsektion" />
              </Field>
              <Field label="Intressen">
                <Textarea rows={2} value={profile.intressen} onChange={(e) => update("intressen", e.target.value)} placeholder="t.ex. AI, hållbarhet" />
              </Field>
              <Field label="Vad ska stipendiet användas till? *" error={errors.syfte}>
                <Textarea rows={3} value={profile.syfte} onChange={(e) => update("syfte", e.target.value)} placeholder="t.ex. Utbytesstudier, examensarbete" />
              </Field>
              <Field label="Kort personlig bakgrund">
                <Textarea rows={3} value={profile.bakgrund} onChange={(e) => update("bakgrund", e.target.value)} placeholder="Berätta kort om din väg till studierna." />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-xs text-muted-foreground">Markera de dokument du redan har.</p>
              <div className="space-y-2">
                {[
                  { k: "studieintyg", label: "Studieintyg" },
                  { k: "cv", label: "CV" },
                  { k: "personligtBrev", label: "Personligt brev" },
                  { k: "rekommendationsbrev", label: "Rekommendationsbrev" },
                ].map(({ k, label }) => (
                  <label key={k} className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-3 cursor-pointer hover:bg-secondary transition-colors">
                    <Checkbox
                      checked={(profile.dokument as any)[k]}
                      onCheckedChange={(v) => update("dokument", { ...profile.dokument, [k]: !!v })}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
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

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-foreground/80">{label}</Label>
      {children}
      {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
