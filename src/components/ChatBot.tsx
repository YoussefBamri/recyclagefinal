import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Bonjour ! Je suis RecyBot, ton assistant spécialisé dans le recyclage ♻️.\nPose-moi des questions sur le tri sélectif, le plastique, ou l’écologie !",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: "👋 Bonjour ! Je suis RecyBot, ton assistant spécialisé dans le recyclage ♻️.",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  }, [language, t]);

  // 🔍 Vérifie si le message est lié au recyclage
  const isRecyclageTopic = (message: string) => {
    const text = message.toLowerCase();
    const keywords = [
      'recycl', 'déchet', 'tri', 'poubelle', 'écologie', 'durable',
      'environnement', 'plastique', 'papier', 'verre', 'compost', 'bouteille'
    ];
    return keywords.some((word) => text.includes(word));
  };

  // 🚀 Fonction pour appeler ton backend NestJS
  const sendMessageToBackend = async (message: string): Promise<string> => {
    try {
      const response = await fetch("http://localhost:3001/recyclage/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        console.error("Erreur serveur:", response.statusText);
        return "⚠️ Erreur côté serveur. Réessaye plus tard.";
      }

      const data = await response.json();
      return data.response || "🤖 Désolé, je n’ai pas compris ta question.";
    } catch (error) {
      console.error("Erreur connexion backend:", error);
      return "⚠️ Erreur de connexion au serveur. Vérifie que ton backend est bien lancé.";
    }
  };

  // 📩 Gestion de l'envoi d'un message
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    let botReply: string;

    // 🧠 Si le message concerne le recyclage → envoyer à ton backend
    if (isRecyclageTopic(inputText)) {
      botReply = await sendMessageToBackend(inputText);
    } else {
      // ❌ Sinon → Reponse automatique de refus
      botReply =
        language === 'fr'
          ? "🚫 Désolé, je suis un chatbot spécialisé uniquement dans le recyclage ♻️.\nPose-moi des questions sur :\n• Le tri des déchets 🗑️\n• Le recyclage ♻️\n• L’écologie 🌱"
          : "🚫 Sorry, I’m a chatbot specialized only in recycling ♻️.\nYou can ask me about:\n• Waste sorting 🗑️\n• Recycling ♻️\n• Eco-friendly tips 🌱";
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: botReply,
      isBot: true,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  // ⌨️ Gestion de la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="relative rounded-full w-16 h-16 shadow-2xl gradient-primary hover:shadow-colored transition-all duration-300 hover:scale-110 group"
            >
              <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-96 h-[600px] flex flex-col overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative flex items-center justify-between p-5 gradient-primary text-white flex-shrink-0">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg">{t('chat.title')}</h3>
                  <div className="flex items-center space-x-1 text-xs text-white/80">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                    <span>{language === 'fr' ? 'En ligne' : 'Online'}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="relative text-white hover:bg-white/20 rounded-full w-9 h-9 p-0 transition-all hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages with proper scrolling */}
            <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                        message.isBot
                          ? 'bg-white border border-gray-100'
                          : 'gradient-primary text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.isBot && (
                          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="whitespace-pre-wrap text-sm leading-relaxed flex-1">
                          {message.text}
                        </div>
                        {!message.isBot && (
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-md max-w-[85%]">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex space-x-1.5">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 rounded-full border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="rounded-full w-11 h-11 p-0 gradient-primary hover:shadow-colored transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}