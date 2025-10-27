import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SourcesDisplayProps {
  sources: string[];
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
      {sources.map((source, index) => {
        let hostname = source;
        try {
          hostname = new URL(source).hostname;
        } catch (e) {
          // If URL parsing fails, use the source as-is
        }
        
        return (
          <Card
            key={index}
            className="group cursor-pointer border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
            onClick={() => window.open(source, "_blank")}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {index + 1}
              </div>
              <div className="flex-1 space-y-1">
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {hostname}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-xs text-muted-foreground truncate">
                  {source}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
