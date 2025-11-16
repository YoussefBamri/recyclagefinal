import { useState, useRef, useEffect } from 'react';
import { Navigation } from './Navigation';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Send, Search, Phone, Video, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  productTitle?: string;
  productImage?: string;
}

export default function MessageriePage() {
  const { user } = useAuth();
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      recipientId: '2',
      recipientName: 'Marie Dubois',
      lastMessage: 'Est-ce que l\'article est toujours disponible ?',
      lastMessageTime: new Date('2024-10-03T14:30:00'),
      unreadCount: 2,
      isOnline: true,
      productTitle: 'Machine à laver Candy 7kg',
      productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      recipientId: '3',
      recipientName: 'Pierre Martin',
      lastMessage: 'Parfait, je peux venir le récupérer demain',
      lastMessageTime: new Date('2024-10-03T11:45:00'),
      unreadCount: 0,
      isOnline: false,
      productTitle: 'Vélo de course Trek',
      productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      recipientId: '4',
      recipientName: 'Sophie Legrand',
      lastMessage: 'Merci beaucoup pour l\'échange !',
      lastMessageTime: new Date('2024-10-02T16:20:00'),
      unreadCount: 0,
      isOnline: true,
      productTitle: 'Machine à café Nespresso',
      productImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop'
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messages mockés pour la conversation sélectionnée
  const mockMessages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        senderId: '2',
        senderName: 'Marie Dubois',
        content: 'Bonjour ! Je suis intéressée par votre machine à laver. Fonctionne-t-elle bien ?',
        timestamp: new Date('2024-10-03T14:00:00'),
        isRead: true
      },
      {
        id: '2',
        senderId: user?.id || '1',
        senderName: user?.firstName + ' ' + user?.lastName || 'Vous',
        content: 'Bonjour Marie ! Oui, il est en excellent état. Acheté il y a 8 mois, toujours dans sa coque.',
        timestamp: new Date('2024-10-03T14:15:00'),
        isRead: true
      },
      {
        id: '3',
        senderId: '2',
        senderName: 'Marie Dubois',
        content: 'Est-ce que l\'article est toujours disponible ?',
        timestamp: new Date('2024-10-03T14:30:00'),
        isRead: false
      }
    ],
    '2': [
      {
        id: '4',
        senderId: '3',
        senderName: 'Pierre Martin',
        content: 'Salut ! Ton vélo Trek m\'intéresse. On peut se voir pour que je le teste ?',
        timestamp: new Date('2024-10-03T10:30:00'),
        isRead: true
      },
      {
        id: '5',
        senderId: user?.id || '1',
        senderName: user?.firstName + ' ' + user?.lastName || 'Vous',
        content: 'Salut Pierre ! Pas de problème, je suis libre demain après-midi. Tu peux venir vers 15h ?',
        timestamp: new Date('2024-10-03T11:00:00'),
        isRead: true
      },
      {
        id: '6',
        senderId: '3',
        senderName: 'Pierre Martin',
        content: 'Parfait, je peux venir le récupérer demain',
        timestamp: new Date('2024-10-03T11:45:00'),
        isRead: true
      }
    ]
  };

  useEffect(() => {
    if (selectedConversation && mockMessages[selectedConversation.id]) {
      setMessages(mockMessages[selectedConversation.id]);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '1',
      senderName: user?.firstName + ' ' + user?.lastName || 'Vous',
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Liste des conversations */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une conversation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.recipientAvatar} />
                          <AvatarFallback>
                            {conversation.recipientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{conversation.recipientName}</h3>
                          <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                        </div>
                        
                        {conversation.productTitle && (
                          <p className="text-xs text-blue-600 truncate mt-1">
                            📦 {conversation.productTitle}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Zone de chat */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={selectedConversation.recipientAvatar} />
                          <AvatarFallback>
                            {selectedConversation.recipientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedConversation.recipientName}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.isOnline ? 'En ligne' : 'Hors ligne'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {selectedConversation.productTitle && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
                      {selectedConversation.productImage && (
                        <img
                          src={selectedConversation.productImage}
                          alt={selectedConversation.productTitle}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">Sujet: {selectedConversation.productTitle}</p>
                        <p className="text-xs text-gray-500">Voir l'annonce →</p>
                      </div>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="p-0 flex flex-col h-[400px]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === user?.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
                  <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}