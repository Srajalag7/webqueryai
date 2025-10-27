import { useState } from "react";
import { Plus, MessageSquare, Trash2, Search, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Chat {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface CollapsibleSidebarProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: number) => void;
}

export function CollapsibleSidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: CollapsibleSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        isExpanded || isPinned ? "w-64" : "w-16"
      )}
      onMouseEnter={() => !isPinned && setIsExpanded(true)}
      onMouseLeave={() => !isPinned && setIsExpanded(false)}
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        {isExpanded || isPinned ? (
          <>
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-bold text-transparent">
              WebQuery AI
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsPinned(!isPinned)}
            >
              {isPinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>
          </>
        ) : (
          <Search className="h-6 w-6 text-primary" />
        )}
      </div>

      <div className={cn("p-3", !(isExpanded || isPinned) && "px-2")}>
        <Button
          onClick={onNewChat}
          className={cn(
            "bg-primary text-primary-foreground hover:bg-primary/90",
            isExpanded || isPinned ? "w-full" : "h-10 w-10 p-0"
          )}
          title="New Chat"
        >
          <Plus className={cn("h-4 w-4", (isExpanded || isPinned) && "mr-2")} />
          {(isExpanded || isPinned) && "New Chat"}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 pb-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all cursor-pointer",
                selectedChatId === chat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50",
                !(isExpanded || isPinned) && "justify-center px-2"
              )}
              onClick={() => onSelectChat(chat.id)}
              title={!isExpanded ? chat.title : undefined}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              {(isExpanded || isPinned) && (
                <>
                  <span className="flex-1 truncate text-sm">{chat.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
