import { Link, useNavigate, useParams } from "react-router-dom";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { loadDrafts, loadProfile, saveDraft } from "@/lib/storage";
import { matchScholarship } from "@/lib/matching";
import { generateDraft } from "@/lib/draft";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, RotateCw, Save, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";

export default function DraftPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scholarship = SCHOLARSHIPS.find((s) => s.id === id);
  const profile = loadProfile();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!scholarship) return;
    const existing = loadDrafts().find((d) => d.scholarshipId === scholarship.id);
    if (existing) {
      setText(existing.text);
      setLoading(false);
    } else if (profile) {
      setLoading(true);
      const t = setTimeout(() => {
        const match = matchScholarship(profile, scholarship);
        setText(generateDraft(profile, scholarship, match));
        setLoading(false);
      }, 600);
      return () => clearTimeout(t);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!scholarship) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Stipendiet hittades inte.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-20 max-w-xl text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="mt-4 text-2xl font-bold">Skapa profil först</h2>
        <p className="mt-2 text-muted-foreground">Vi behöver din profil för att kunna generera ett personligt utkast.</p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/profil">Skapa profil</Link>
        </Button>
      </div>
    );
  }

  const regenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const match = matchScholarship(profile, scholarship);
      setText(generateDraft(profile, scholarship, match));
      setLoading(false);
      toast.success("Nytt utkast genererat");
    }, 500);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Utkast kopierat");
  };

  const save = () => {
    saveDraft({
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      text,
      updatedAt: new Date().toISOString(),
    });
    toast.success("Utkast sparat");
  };

  return (
    <div className="container py-8 md:py-12 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-3">
        <ArrowLeft className="mr-1 h-4 w-4" /> Tillbaka
      </Button>

      <h1 className="text-3xl md:text-4xl font-bold">Ansökningsutkast</h1>
      <p className="mt-2 text-muted-foreground">{scholarship.name} · {scholarship.organization}</p>

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-warning/10 border border-warning/30 p-4">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/90">
          <span className="font-semibold">Detta är ett AI-genererat utkast.</span> Läs igenom, ändra och kontrollera att all information stämmer innan du skickar in ansökan.
        </p>
      </div>

      <Card className="rounded-2xl shadow-soft mt-6">
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-3 bg-secondary rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
              ))}
            </div>
          ) : (
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={22}
              className="font-mono text-sm leading-relaxed border-0 focus-visible:ring-0 resize-none p-0"
            />
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={save} className="rounded-xl">
          <Save className="h-4 w-4 mr-1.5" /> Spara lokalt
        </Button>
        <Button variant="outline" onClick={copy} className="rounded-xl">
          <Copy className="h-4 w-4 mr-1.5" /> Kopiera
        </Button>
        <Button variant="outline" onClick={regenerate} className="rounded-xl">
          <RotateCw className="h-4 w-4 mr-1.5" /> Generera om
        </Button>
      </div>
    </div>
  );
}
