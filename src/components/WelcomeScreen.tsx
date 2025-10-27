import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function WelcomeScreen({ onSendMessage, disabled }: WelcomeScreenProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-bold text-transparent">
            WebQuery AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Ask anything. Get answers powered by AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-2xl border border-border bg-card p-4 shadow-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={disabled}
              className="min-h-[80px] resize-none border-0 bg-transparent text-base focus-visible:ring-0"
              rows={3}
            />
            <div className="flex items-center justify-end pt-2">
              <Button
                type="submit"
                disabled={!message.trim() || disabled}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
