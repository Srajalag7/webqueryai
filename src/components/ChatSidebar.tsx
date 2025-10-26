import { Plus, MessageSquare, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Chat {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: number) => void;
  onOpenSettings: () => void;
}

export function ChatSidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
}: ChatSidebarProps) {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
          GenAI Chatbot
        </h1>
      </div>

      <div className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 pb-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-smooth cursor-pointer",
                selectedChatId === chat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
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
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          onClick={onOpenSettings}
          className="w-full justify-start"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
