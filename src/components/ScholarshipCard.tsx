import { Scholarship } from "@/data/scholarships";
import { MatchResult } from "@/lib/matching";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, Coins, Bookmark, BookmarkCheck } from "lucide-react";
import { MatchBadge } from "./MatchBadge";
import { Link } from "react-router-dom";
import { loadSavedIds, toggleSaved } from "@/lib/storage";
import { useEffect, useState } from "react";

interface Props {
  scholarship: Scholarship;
  match?: MatchResult;
  onOpenDraft?: (id: string) => void;
}

export default function ScholarshipCard({ scholarship: s, match, onOpenDraft }: Props) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(loadSavedIds().includes(s.id));
  }, [s.id]);

  const deadline = new Date(s.deadline).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="rounded-2xl border-border/70 shadow-soft hover:shadow-card transition-shadow overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg leading-snug text-foreground">{s.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Building2 className="h-3.5 w-3.5" /> {s.organization}
            </p>
          </div>
          <button
            onClick={() => setSaved(toggleSaved(s.id).includes(s.id))}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary"
            aria-label="Spara"
          >
            {saved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>

        {match && (
          <div className="mt-3">
            <MatchBadge score={match.score} />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Coins className="h-4 w-4 text-accent" />
            {s.amount.toLocaleString("sv-SE")} kr
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Sista ansökan {deadline}
          </span>
        </div>

        {match?.explanation && (
          <p className="text-sm text-muted-foreground bg-secondary/60 rounded-lg p-3 border border-border/50">
            <span className="font-medium text-foreground">Varför du matchar: </span>
            {match.explanation}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {s.tags.map((t) => (
            <Badge key={t} variant="secondary" className="font-normal rounded-full">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-3 flex-wrap">
        <Button asChild variant="outline" size="sm" className="rounded-lg">
          <Link to={`/stipendier/${s.id}`}>Visa detaljer</Link>
        </Button>
        <Button
          size="sm"
          className="rounded-lg"
          onClick={() => onOpenDraft?.(s.id)}
          asChild={!onOpenDraft}
        >
          {onOpenDraft ? <span>Skapa ansökningsutkast</span> : <Link to={`/utkast/${s.id}`}>Skapa ansökningsutkast</Link>}
        </Button>
      </CardFooter>
    </Card>
  );
}
