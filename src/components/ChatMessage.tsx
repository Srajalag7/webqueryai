import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-4 px-6 py-8 transition-smooth",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-br from-primary to-accent"
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-white" />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <p className="whitespace-pre-wrap break-words leading-7">{message}</p>
      </div>
    </div>
  );
}
