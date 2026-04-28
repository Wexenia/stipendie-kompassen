import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { EMPTY_PROFILE, StudentProfile } from "@/types/profile";
import { loadProfile, saveProfile } from "@/lib/storage";
import { toast } from "sonner";

const STEPS = ["Om dig", "Studier", "Engagemang & syfte", "Dokument"];

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
    }
    if (step === 1) {
      if (!profile.universitet.trim()) e.universitet = "Lärosäte krävs";
      if (!profile.program.trim()) e.program = "Program krävs";
      if (!profile.amnesomrade.trim()) e.amnesomrade = "Ämnesområde krävs";
    }
    if (step === 2) {
      if (!profile.syfte.trim()) e.syfte = "Beskriv vad stipendiet ska användas till";
    }
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
    <div className="container py-10 md:py-14 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Skapa din stipendieprofil</h1>
        <p className="mt-2 text-muted-foreground">
          Svara på några frågor så matchar vi dig med relevanta stipendier.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Steg {step + 1} av {STEPS.length} · {STEPS[step]}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 md:p-8 space-y-5">
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
              <Field label="Ekonomisk situation (valfritt)" hint="Beskriv kort om du har begränsad ekonomi – relevant för behovsprövade stipendier.">
                <Textarea rows={2} value={profile.ekonomi ?? ""} onChange={(e) => update("ekonomi", e.target.value)} placeholder="t.ex. Begränsad ekonomi, försörjer mig själv" />
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
              <Field label="Ämnesområde *" error={errors.amnesomrade} hint="t.ex. Teknik, Medicin, Ekonomi, Humaniora">
                <Input value={profile.amnesomrade} onChange={(e) => update("amnesomrade", e.target.value)} placeholder="t.ex. Teknik" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Termin / årskurs">
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
              <Field label="Föreningsengagemang eller ideellt arbete">
                <Textarea rows={3} value={profile.engagemang} onChange={(e) => update("engagemang", e.target.value)} placeholder="t.ex. Styrelsemedlem i kårsektion, volontär i Röda Korset" />
              </Field>
              <Field label="Intressen">
                <Textarea rows={2} value={profile.intressen} onChange={(e) => update("intressen", e.target.value)} placeholder="t.ex. AI, hållbarhet, jämställdhet i tekniken" />
              </Field>
              <Field label="Vad ska stipendiet användas till? *" error={errors.syfte}>
                <Textarea rows={3} value={profile.syfte} onChange={(e) => update("syfte", e.target.value)} placeholder="t.ex. Utbytesstudier, examensarbete, kurslitteratur" />
              </Field>
              <Field label="Kort personlig bakgrund">
                <Textarea rows={4} value={profile.bakgrund} onChange={(e) => update("bakgrund", e.target.value)} placeholder="Berätta kort om din väg till studierna och vad som driver dig." />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-muted-foreground">
                Markera de dokument du redan har. Detta hjälper oss att visa vad du behöver komplettera för olika ansökningar.
              </p>
              <div className="space-y-3">
                {[
                  { k: "studieintyg", label: "Studieintyg" },
                  { k: "cv", label: "CV" },
                  { k: "personligtBrev", label: "Personligt brev" },
                  { k: "rekommendationsbrev", label: "Rekommendationsbrev" },
                ].map(({ k, label }) => (
                  <label key={k} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4 cursor-pointer hover:bg-secondary transition-colors">
                    <Checkbox
                      checked={(profile.dokument as any)[k]}
                      onCheckedChange={(v) => update("dokument", { ...profile.dokument, [k]: !!v })}
                    />
                    <span className="font-medium">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-primary-soft border border-primary/15 p-4 text-sm">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-foreground/80">
                  Din profil sparas endast lokalt i din webbläsare. Dela inte känsliga personuppgifter om det inte behövs.
                </p>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Tillbaka
            </Button>
            <Button onClick={next} className="rounded-lg">
              {step === STEPS.length - 1 ? (
                <>
                  <CheckCircle2 className="mr-1 h-4 w-4" /> Spara & matcha
                </>
              ) : (
                <>
                  Nästa <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
