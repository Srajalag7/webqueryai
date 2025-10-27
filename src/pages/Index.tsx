import { useState, useEffect, useRef } from "react";
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import { ChatResponse } from "@/components/ChatResponse";
import { MessageInput } from "@/components/MessageInput";
import { NewChatDialog } from "@/components/NewChatDialog";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatAPI, Chat, Conversation, Source } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const api = new ChatAPI();

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
      setChatLoading(true);
      const chatDetail = await api.getChat(chatId);
      setConversations(chatDetail.conversations);
      setSelectedChatId(chatId);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load chat",
        variant: "destructive",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleCreateChat = async (title: string) => {
    try {
      const newChat = await api.createChat(title);
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

  const handleNewChat = () => {
    setNewChatDialogOpen(true);
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

    // Check if conversation limit reached
    if (conversations.length >= 10) {
      toast({
        title: "Conversation Limit Reached",
        description: "This chat has reached the maximum of 10 conversations. Please start a new chat to continue.",
        variant: "destructive",
      });
      return;
    }

    // Show user query immediately with placeholder response
    const tempConversation: Conversation = {
      id: Date.now(),
      chat_id: selectedChatId,
      user_query: message,
      bot_response: "",
      conversation_order: conversations.length + 1,
      created_at: new Date().toISOString(),
      sources: [],
    };
    
    setConversations([...conversations, tempConversation]);
    setSending(true);

    try {
      const conversation = await api.sendMessage(selectedChatId, message);
      // Replace temp conversation with actual response
      setConversations(prev => {
        const newConvs = [...prev];
        newConvs[newConvs.length - 1] = conversation;
        return newConvs;
      });
      
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      // Remove temp conversation on error
      setConversations(prev => prev.slice(0, -1));
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleWelcomeSend = async (message: string) => {
    if (!selectedChatId) {
      setNewChatDialogOpen(true);
      return;
    }
    handleSendMessage(message);
  };

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CollapsibleSidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={loadChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex flex-1 flex-col">
        {selectedChatId ? (
          <>
            {chatLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1">
                  <div className="mx-auto max-w-4xl">
                    {conversations.length === 0 && !loading ? (
                      <WelcomeScreen onSendMessage={handleSendMessage} disabled={sending} />
                    ) : (
                      <>
                        {conversations.map((conv, index) => (
                          <div key={conv.id}>
                            <ChatResponse
                              userQuery={conv.user_query}
                              botResponse={conv.bot_response}
                              sources={conv.sources || []}
                            />
                            {/* Show thinking indicator only for the last message while sending */}
                            {index === conversations.length - 1 && sending && !conv.bot_response && (
                              <div className="bg-muted/30 px-6 py-8">
                                <div className="flex gap-4">
                                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-muted-foreground">Thinking...</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        <div ref={scrollRef} />
                      </>
                    )}
                  </div>
                </ScrollArea>

                {conversations.length > 0 && (
                  <MessageInput 
                    onSend={handleSendMessage} 
                    disabled={sending || conversations.length >= 10} 
                  />
                )}
              </>
            )}
          </>
        ) : (
          <WelcomeScreen onSendMessage={handleWelcomeSend} disabled={sending} />
        )}
      </div>

      <NewChatDialog
        open={newChatDialogOpen}
        onOpenChange={setNewChatDialogOpen}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
};

export default Index;
