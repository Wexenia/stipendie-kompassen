import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="font-semibold text-foreground">Stipendia</div>
          <p className="mt-2 text-muted-foreground">
            Hjälper svenska universitetsstudenter att hitta och ansöka om relevanta stipendier.
          </p>
        </div>
        <div className="flex items-start gap-3 md:col-span-2 rounded-xl bg-background border border-border p-4">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Integritet: </span>
            Din profil används endast för att matcha stipendier i denna prototyp. Dela inte känsliga personuppgifter om det inte behövs.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Stipendia · Prototyp
      </div>
    </footer>
  );
}
