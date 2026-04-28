import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Sparkles, Search, FileText, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Search,
    title: "Samlad stipendieinformation",
    desc: "Sök och utforska relevanta svenska stipendier på ett ställe – tydligt och överskådligt.",
  },
  {
    icon: Sparkles,
    title: "Personliga matchningar",
    desc: "Vår algoritm matchar din profil med stipendier och visar alltid varför de passar dig.",
  },
  {
    icon: FileText,
    title: "Hjälp med ansökan",
    desc: "Generera ett personligt utkast till din ansökan – redo att redigera och skicka in.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              För svenska universitetsstudenter
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Hitta stipendier som passar{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                just dig
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Skapa en profil, matchas med relevanta stipendier och få hjälp att komma igång med din ansökan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="rounded-xl shadow-glow">
                <Link to="/profil">
                  Skapa stipendieprofil <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link to="/stipendier">Utforska stipendier</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Gratis prototyp</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Inget konto krävs</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Transparent matchning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Allt du behöver på ett ställe</h2>
          <p className="mt-3 text-muted-foreground">
            Stipendia samlar information, matchar och hjälper dig att skriva – så att du kan fokusera på dina studier.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title} className="rounded-2xl border-border/70 shadow-soft hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-lg">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container pb-16 md:pb-24">
        <Card className="rounded-3xl border-border/70 bg-secondary/40 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold">Så fungerar det</h2>
                <ol className="mt-6 space-y-4">
                  {[
                    "Skapa din stipendieprofil på ett par minuter",
                    "Få en lista med stipendier sorterade efter matchningsgrad",
                    "Läs detaljer och se exakt varför du matchar",
                    "Generera ett ansökningsutkast – redigera och skicka in",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-foreground">{t}</span>
                    </li>
                  ))}
                </ol>
                <Button asChild className="mt-8 rounded-xl">
                  <Link to="/profil">Kom igång</Link>
                </Button>
              </div>
              <div className="rounded-2xl bg-background border border-border p-6 shadow-soft">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Trygg och transparent</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Din profil sparas endast lokalt i din webbläsare. Du ser alltid varför ett stipendium rekommenderas.
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {["Studieintyg", "CV", "Personligt brev"].map((d) => (
                    <div key={d} className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
                      <span className="text-sm font-medium">{d}</span>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
