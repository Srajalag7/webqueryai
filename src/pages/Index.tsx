import { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { MessageInput } from "@/components/MessageInput";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatAPI, Chat, Conversation, getBaseUrl, setBaseUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [baseUrl, setBaseUrlState] = useState(getBaseUrl());
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const api = new ChatAPI(baseUrl);

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await api.getChats();
      setChats(response.chats);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load chats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (chatId: number) => {
    try {
      const chatDetail = await api.getChat(chatId);
      setConversations(chatDetail.conversations);
      setSelectedChatId(chatId);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load chat",
        variant: "destructive",
      });
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await api.createChat(`Chat ${chats.length + 1}`);
      setChats([newChat, ...chats]);
      setSelectedChatId(newChat.id);
      setConversations([]);
      toast({
        title: "Success",
        description: "New chat created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create chat",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChat = async (chatId: number) => {
    try {
      await api.deleteChat(chatId);
      setChats(chats.filter((c) => c.id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setConversations([]);
      }
      toast({
        title: "Success",
        description: "Chat deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedChatId) {
      toast({
        title: "Error",
        description: "Please select or create a chat first",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      const conversation = await api.sendMessage(selectedChatId, message);
      setConversations([...conversations, conversation]);
      
      // Scroll to bottom after message is added
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSaveBaseUrl = (url: string) => {
    setBaseUrl(url);
    setBaseUrlState(url);
    toast({
      title: "Success",
      description: "Base URL updated successfully",
    });
  };

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={loadChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex flex-1 flex-col">
        {selectedChatId ? (
          <>
            <ScrollArea className="flex-1">
              <div className="mx-auto max-w-4xl">
                {conversations.length === 0 && !loading && (
                  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mb-2 text-2xl font-semibold">
                      Start a Conversation
                    </h2>
                    <p className="text-muted-foreground">
                      Send a message to begin chatting with GenAI
                    </p>
                  </div>
                )}

                {conversations.map((conv) => (
                  <div key={conv.id}>
                    <ChatMessage message={conv.user_query} isUser={true} />
                    <ChatMessage message={conv.bot_response} isUser={false} />
                  </div>
                ))}

                {sending && (
                  <div className="flex gap-4 px-6 py-8">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground">Thinking...</p>
                    </div>
                  </div>
                )}
                
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <MessageInput onSend={handleSendMessage} disabled={sending} />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/50">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent">
              GenAI Chatbot
            </h1>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
              Create a new chat or select an existing one to start your AI-powered conversation
            </p>
          </div>
        )}
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        baseUrl={baseUrl}
        onSaveBaseUrl={handleSaveBaseUrl}
      />
    </div>
  );
};

export default Index;
