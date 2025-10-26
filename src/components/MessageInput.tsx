import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
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
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4">
      <div className="mx-auto flex max-w-3xl gap-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          disabled={disabled}
          className="min-h-[60px] resize-none bg-background"
          rows={1}
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
