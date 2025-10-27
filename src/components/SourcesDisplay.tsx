import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Source {
  title: string;
  url: string;
  snippet?: string;
}

interface SourcesDisplayProps {
  sources: Source[];
}

export function SourcesDisplay({ sources }: SourcesDisplayProps) {
  if (!sources || sources.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No sources available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sources.map((source, index) => (
        <Card
          key={index}
          className="group cursor-pointer border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
          onClick={() => window.open(source.url, "_blank")}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {index + 1}
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-medium text-foreground group-hover:text-primary">
                {source.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {source.snippet || source.url}
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {new URL(source.url).hostname}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
