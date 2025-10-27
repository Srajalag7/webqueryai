import { useState } from "react";
import { Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SourcesDisplay } from "./SourcesDisplay";

interface Source {
  title: string;
  url: string;
  snippet?: string;
}

interface ChatResponseProps {
  userQuery: string;
  botResponse: string;
  sources?: Source[];
}

export function ChatResponse({ userQuery, botResponse, sources }: ChatResponseProps) {
  const [activeTab, setActiveTab] = useState<string>("answer");

  return (
    <div className="space-y-6 py-6">
      {/* User Query */}
      <div className="flex gap-4 px-6">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="whitespace-pre-wrap break-words leading-7 text-foreground">
            {userQuery}
          </p>
        </div>
      </div>

      {/* Bot Response with Tabs */}
      <div className="bg-muted/30">
        <div className="flex gap-4 px-6 pt-6">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 bg-background/50">
                <TabsTrigger value="answer" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Answer
                </TabsTrigger>
                <TabsTrigger value="sources" className="gap-2">
                  <Bot className="h-4 w-4" />
                  Sources
                  {sources && sources.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {sources.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="answer" className="mt-0 pb-6">
                <div className="space-y-4">
                  <p className="whitespace-pre-wrap break-words leading-7 text-foreground">
                    {botResponse}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="sources" className="mt-0 pb-6">
                <SourcesDisplay sources={sources || []} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
