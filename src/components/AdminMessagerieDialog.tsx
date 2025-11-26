import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send, MessageSquare } from 'lucide-react';
import { sendMessage, getConversationWithAdmin, Message, getAdminUser } from '../api/messageApi';
import { getAdminUser as getUserAdmin } from '../api/userApi';
import { toast } from 'sonner';

interface AdminMessagerieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminMessagerieDialog({ open, onOpenChange }: AdminMessagerieDialogProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Charger l'admin et les messages
  useEffect(() => {
    if (open && user?.id) {
      loadAdminAndMessages();
    }
  }, [open, user?.id]);

  const loadAdminAndMessages = async () => {
    try {
      setLoading(true);
      const admin = await getUserAdmin();
      if (admin && admin.id) {
        const adminIdNum = typeof admin.id === 'string' ? parseInt(admin.id) : admin.id;
        setAdminId(adminIdNum);
        const userIdNum = typeof user!.id === 'string' ? parseInt(user!.id) : user!.id;
        const conversation = await getConversationWithAdmin(userIdNum, adminIdNum);
        setMessages(conversation);
      } else {
        toast.error('Admin introuvable');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !adminId || !user?.id || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const userIdNum = typeof user.id === 'string' ? parseInt(user.id) : parseInt(user.id);
      const sentMessage = await sendMessage(userIdNum, adminId, messageContent);
      setMessages(prev => [...prev, sentMessage]);
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      setNewMessage(messageContent); 
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Proposer des offres/défis</DialogTitle>
              <DialogDescription>
                Contactez l'administrateur pour proposer vos offres ou défis
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Chargement des messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Aucun message
              </h3>
              <p className="text-gray-500 max-w-sm">
                Commencez la conversation avec l'administrateur pour proposer vos offres ou défis
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const userIdNum = typeof user.id === 'string' ? parseInt(user.id) : user.id;
                const isSender = message.sender.id === userIdNum;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        isSender ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {isSender
                            ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
                            : 'AD'}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isSender
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isSender ? 'text-white/70' : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="px-6 py-4 border-t flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            disabled={sending || !adminId}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending || !adminId}
            className="gradient-primary"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

