import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { useAuth } from './AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useChallenges } from '../contexts/ChallengesContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getAllArticles, deleteArticle } from '../api/articleApi';
import { 
  MapPin, 
  Clock, 
  Package,
  AlertTriangle,
  Search,
  CheckCircle,
  Shield,
  Trash2,
  Trophy,
  Plus,
  Home,
  ListChecks,
  ArrowRight,
  Award,
  TrendingUp,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Challenge } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { ChallengeParticipants } from './ChallengeParticipants';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { getConversationsForAdmin, getConversationWithAdmin, sendMessage, markConversationAsRead, Message, Conversation } from '../api/messageApi';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface AdminArticle {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  type: string;
  category: string;
  timeAgo: string;
  image: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  views: number;
  reports: number;
}

// Fonction pour mapper les données du backend vers AdminArticle
const mapArticleToAdminArticle = (article: any): AdminArticle => {
  const statut = article.statut || article.status || 'sale';
  
  // Déterminer le type à partir du statut
  let type = 'revendre';
  if (statut === 'exchange' || statut === 'EXCHANGE') {
    type = 'echanger';
  } else if (statut === 'giveaway' || statut === 'GIVEAWAY') {
    type = 'donner';
  }
  
  // Calculer le temps écoulé
  const dateCreation = article.dateCreation ? new Date(article.dateCreation) : new Date();
  const now = new Date();
  const diffMs = now.getTime() - dateCreation.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  let timeAgo = '';
  if (diffHours < 1) {
    timeAgo = 'il y a moins d\'une heure';
  } else if (diffHours < 24) {
    timeAgo = `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    timeAgo = `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else {
    const diffWeeks = Math.floor(diffDays / 7);
    timeAgo = `il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
  }
  
  // Construire l'URL de l'image
  const imageUrl = article.photo 
    ? (article.photo.startsWith('http') ? article.photo : `http://localhost:3001/${article.photo}`)
    : 'https://images.unsplash.com/photo-1610889556528-6ca0ec833fb7?w=400&h=300&fit=crop';
  
  // Récupérer les informations du vendeur
  const sellerName = article.utilisateur?.name || 
                     (article.utilisateur?.firstName && article.utilisateur?.lastName 
                       ? `${article.utilisateur.firstName} ${article.utilisateur.lastName}` 
                       : 'Utilisateur');
  const sellerEmail = article.utilisateur?.email || '';
  const sellerId = String(article.utilisateur?.id || '');
  
  // Formater le prix
  let price = 'Gratuit';
  if (article.prix) {
    price = `${article.prix} DT`;
  } else if (type === 'echanger') {
    price = 'Échange';
  }
  
  return {
    id: article.id || String(article.ID),
    title: article.titre || article.title || '',
    description: article.description || '',
    price: price,
    location: article.localisation || article.location || 'Tunis Centre',
    type: type,
    category: article.categorie || article.category || '',
    timeAgo: timeAgo,
    image: imageUrl,
    seller: {
      id: sellerId,
      name: sellerName,
      email: sellerEmail
    },
    views: 0, // À implémenter si disponible dans le backend
    reports: 0 // À implémenter si disponible dans le backend
  };
};

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { challenges, loading: challengesLoading, addChallenge, deleteChallenge, completeChallenge } = useChallenges();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'annonces' | 'challenges' | 'messagerie'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    sponsor: '',
    targetAmount: '',
    unit: '',
    reward: '',
    cause: '',
    deadline: ''
  });

  // État pour les articles
  const [allArticles, setAllArticles] = useState<AdminArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  // État pour la messagerie
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagerieLoading, setMessagerieLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Charger tous les articles depuis l'API
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setArticlesLoading(true);
        const data = await getAllArticles();
        console.log('📦 Articles reçus du backend:', data);
        
        // Gérer différents formats de réponse
        const articlesArray = Array.isArray(data) ? data : (data.articles || data.data || []);
        const mappedArticles = articlesArray.map(mapArticleToAdminArticle);
        setAllArticles(mappedArticles);
      } catch (error: any) {
        console.error('❌ Erreur lors du chargement des articles:', error);
        toast.error('Erreur lors du chargement des articles');
      } finally {
        setArticlesLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@recycle.com';

  // Charger les conversations pour l'admin (toujours, même sur le dashboard)
  useEffect(() => {
    if (user?.id && isAdmin) {
      // Charger au démarrage avec loading
      loadConversations(true);
      
      // Recharger périodiquement pour mettre à jour le compteur de messages non lus (sans loading)
      const interval = setInterval(() => {
        loadConversations(false);
      }, 5000); // Toutes les 5 secondes

      return () => clearInterval(interval);
    }
  }, [user?.id, isAdmin]);

  // Charger les messages d'une conversation
  useEffect(() => {
    if (selectedConversation && user?.id) {
      loadConversationMessages();
    }
  }, [selectedConversation, user?.id]);

  const loadConversations = async (showLoading = false) => {
    if (!user?.id) return;
    try {
      if (showLoading) {
        setMessagerieLoading(true);
      }
      const adminId = parseInt(user.id);
      const convs = await getConversationsForAdmin(adminId);
      setConversations(convs);
    } catch (error: any) {
      console.error('Erreur lors du chargement des conversations:', error);
      // Ne pas afficher d'erreur pour les rechargements automatiques
      if (showLoading) {
        toast.error('Erreur lors du chargement des conversations');
      }
    } finally {
      if (showLoading) {
        setMessagerieLoading(false);
      }
    }
  };

  const loadConversationMessages = async () => {
    if (!selectedConversation || !user?.id) return;
    try {
      const adminId = parseInt(user.id);
      const messages = await getConversationWithAdmin(selectedConversation.userId, adminId);
      setConversationMessages(messages);
      // Marquer comme lus
      await markConversationAsRead(selectedConversation.userId, adminId);
      // Recharger les conversations pour mettre à jour les compteurs (sans loading)
      loadConversations(false);
    } catch (error: any) {
      console.error('Erreur lors du chargement des messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id || sendingMessage) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      const adminId = parseInt(user.id);
      await sendMessage(adminId, selectedConversation.userId, messageContent);
      // Recharger les messages
      await loadConversationMessages();
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      setNewMessage(messageContent);
    } finally {
      setSendingMessage(false);
    }
  };

  // Calculer les statistiques
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const totalRewardsCompleted = completedChallenges.reduce((sum, c) => sum + (c.reward || 0), 0);
  
  const activeChallengesCount = challenges.filter(c => c.status === 'active').length;
  const completedChallengesCount = completedChallenges.length;
  
  // Log pour débogage
  console.log('📊 Statistiques défis:', {
    total: challenges.length,
    actifs: activeChallengesCount,
    complétés: completedChallengesCount,
    récompensesTotal: totalRewardsCompleted,
    défisComplétés: completedChallenges.map(c => ({ id: c.id, titre: c.title, reward: c.reward, status: c.status }))
  });

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      await deleteArticle(articleId);
      setAllArticles(prev => prev.filter(article => article.id !== articleId));
      toast.success('Annonce supprimée avec succès');
    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'annonce');
    }
  };

  const handleCreateChallenge = async () => {
    if (!newChallenge.title || !newChallenge.description || !newChallenge.sponsor || 
        !newChallenge.targetAmount || !newChallenge.unit || !newChallenge.reward || 
        !newChallenge.cause || !newChallenge.deadline) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsCreating(true);
    try {
      const challenge: Challenge = {
        id: `challenge-${Date.now()}`, // L'ID sera remplacé par celui du backend
        title: newChallenge.title,
        description: newChallenge.description,
        sponsor: newChallenge.sponsor,
        targetAmount: parseFloat(newChallenge.targetAmount),
        currentAmount: 0,
        unit: newChallenge.unit,
        reward: parseFloat(newChallenge.reward),
        cause: newChallenge.cause,
        deadline: newChallenge.deadline,
        status: 'active',
        createdAt: new Date().toISOString(),
        contributions: []
      };

      await addChallenge(challenge);
      setIsCreateDialogOpen(false);
      setNewChallenge({
        title: '',
        description: '',
        sponsor: '',
        targetAmount: '',
        unit: '',
        reward: '',
        cause: '',
        deadline: ''
      });
    } catch (error) {
      // L'erreur est déjà gérée dans le contexte
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) {
      try {
        await deleteChallenge(challengeId);
        // Le toast est déjà géré dans le contexte
      } catch (error) {
        // L'erreur est déjà gérée dans le contexte
      }
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await completeChallenge(challengeId);
      // Le toast est déjà géré dans le contexte
    } catch (error) {
      // L'erreur est déjà gérée dans le contexte
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revendre': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'echanger': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'donner': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'recycler': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'revendre': return t('type.sell');
      case 'echanger': return t('type.exchange');
      case 'donner': return t('type.give');
      case 'recycler': return t('type.recycle');
      default: return type;
    }
  };

  const getFilteredArticles = () => {
    let data = allArticles;

    if (searchTerm) {
      data = data.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      data = data.filter(item => item.category === filterCategory);
    }

    return data;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div 
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Tableau de Bord Admin</h1>
                  <p className="text-white/90 text-base md:text-lg">Gérez vos annonces et défis écologiques</p>
                </div>
              </div>
              <Link to="/">
                <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Home className="w-4 h-4 mr-2" />
                  Voir le Site
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* Dashboard - Main Cards */}
        {activeSection === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Administration des Annonces */}
            <div>
              <Card 
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                onClick={() => setActiveSection('annonces')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-2xl">
                      <ListChecks className="w-6 h-6 text-blue-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Administration des Annonces</h3>
                  <p className="text-gray-600 text-sm mb-4">Gérer et supprimer les annonces publiées</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-xl font-bold text-blue-600">{allArticles.length}</span>
                  </div>
                  {allArticles.filter(a => a.reports > 0).length > 0 && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-3 h-3 text-orange-600" />
                      <span className="text-xs text-orange-700">{allArticles.filter(a => a.reports > 0).length} signalement(s)</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Card 2: Administration des Défis */}
            <div>
              <Card 
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                onClick={() => setActiveSection('challenges')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 group-hover:from-yellow-500/20 group-hover:to-amber-500/20 transition-all duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-100 rounded-2xl">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Administration des Défis</h3>
                  <p className="text-gray-600 text-sm mb-4">Créer et gérer les défis écologiques</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Actifs</span>
                    <span className="text-xl font-bold text-yellow-600">{activeChallengesCount}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">{completedChallengesCount} complété(s)</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card 3: Récompenses Totales */}
            <div>
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-100 rounded-2xl">
                      <Award className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Récompenses Totales</h3>
                  <p className="text-gray-600 text-sm mb-4">Montant des défis complétés</p>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">
                      {totalRewardsCompleted.toLocaleString()} DT
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>Reversés aux causes humanitaires</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card 4: Messagerie */}
            <div>
              <Card 
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                onClick={() => {
                  setActiveSection('messagerie');
                  loadConversations(true);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-2xl">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Messagerie</h3>
                  <p className="text-gray-600 text-sm mb-4">Messages des utilisateurs</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Conversations</span>
                    <span className="text-xl font-bold text-purple-600">{conversations.length}</span>
                  </div>
                  {(() => {
                    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
                    return totalUnread > 0 && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-blue-700">
                          {totalUnread} message{totalUnread > 1 ? 's' : ''} non lu{totalUnread > 1 ? 's' : ''}
                        </span>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Section Annonces */}
        {activeSection === 'annonces' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Button variant="outline" onClick={() => setActiveSection('dashboard')} className="w-fit">
                ← Retour au Dashboard
              </Button>
              <h2 className="text-2xl font-bold text-center sm:text-left">Administration des Annonces</h2>
            </div>

            {/* Filtres */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher une annonce..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 border-gray-200 rounded-xl"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-56 h-10 border-gray-200 rounded-xl">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="electronique">Électronique</SelectItem>
                      <SelectItem value="meubles">Meubles</SelectItem>
                      <SelectItem value="vetements">Vêtements</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                      <SelectItem value="livres">Livres</SelectItem>
                      <SelectItem value="autres">Autres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Liste des annonces */}
            <div className="space-y-4">
              {articlesLoading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Chargement des articles...</p>
                  </CardContent>
                </Card>
              ) : getFilteredArticles().length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Aucun article trouvé
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || filterCategory !== 'all' 
                        ? 'Aucun article ne correspond à vos critères de recherche.'
                        : 'Aucun article disponible pour le moment.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                getFilteredArticles().map((article) => (
                <div key={article.id}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-base sm:text-lg mb-1 line-clamp-1">{article.title}</h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.description}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {article.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {article.timeAgo}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-start sm:items-end gap-2">
                              <Badge className={`${getTypeColor(article.type)} border text-xs`}>
                                {getTypeLabel(article.type)}
                              </Badge>
                              <span className="font-bold text-base text-primary">{article.price}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-gray-100 gap-2">
                            <div className="text-xs text-gray-600">
                              Vendeur: <strong>{article.seller.name}</strong>
                            </div>
                            <div className="flex items-center gap-2">
                              {article.reports > 0 && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {article.reports} signalement
                                </Badge>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteArticle(article.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Section Challenges */}
        {activeSection === 'challenges' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Button variant="outline" onClick={() => setActiveSection('dashboard')} className="w-fit">
                ← Retour au Dashboard
              </Button>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="text-center sm:text-right">
                  <p className="text-sm text-gray-600">Récompenses Totales</p>
                  <p className="text-xl font-bold text-emerald-600">{totalRewardsCompleted.toLocaleString()} DT</p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un Défi
                </Button>
              </div>
            </div>

            {/* Liste des défis */}
            {challengesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Chargement des défis...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {challenges.map((challenge) => (
                <div key={challenge.id}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <Trophy className={`w-5 h-5 flex-shrink-0 ${
                              challenge.status === 'completed' ? 'text-green-600' :
                              challenge.status === 'active' ? 'text-yellow-600' :
                              'text-gray-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base sm:text-lg line-clamp-1">{challenge.title}</h4>
                              <Badge variant="outline" className={
                                challenge.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200 text-xs' :
                                challenge.status === 'active' ? 'bg-blue-100 text-blue-700 border-blue-200 text-xs' :
                                'bg-gray-100 text-gray-700 border-gray-200 text-xs'
                              }>
                                {challenge.status === 'completed' ? 'Complété' : 
                                 challenge.status === 'active' ? 'En cours' : 'Expiré'}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500 text-xs">Sponsor:</span>
                              <p className="font-medium text-sm line-clamp-1">{challenge.sponsor}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Objectif:</span>
                              <p className="font-medium text-sm">{challenge.targetAmount} {challenge.unit}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Collecté:</span>
                              <p className="font-medium text-sm text-primary">{challenge.currentAmount} {challenge.unit}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Récompense:</span>
                              <p className="font-medium text-sm text-emerald-600">{challenge.reward} DT</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Cause:</span>
                              <p className="font-medium text-sm line-clamp-1">{challenge.cause}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Date limite:</span>
                              <p className="font-medium text-sm">{new Date(challenge.deadline).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Progression:</span>
                              <p className="font-medium text-sm">{Math.min((challenge.currentAmount / challenge.targetAmount) * 100, 100).toFixed(0)}%</p>
                            </div>
                          </div>
                          
                          <ChallengeParticipants 
                            contributions={challenge.contributions} 
                            challengeUnit={challenge.unit}
                          />
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          {challenge.status === 'active' && challenge.currentAmount >= challenge.targetAmount && (
                            <Button
                              size="sm"
                              onClick={() => handleCompleteChallenge(challenge.id)}
                              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Marquer Complété
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="ml-1 sm:hidden">Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

                {challenges.length === 0 && (
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-600 mb-2">Aucun défi</h3>
                    <p className="text-gray-500 text-sm">Créez votre premier défi écologique</p>
                  </div>
                )}
              </div>
            )}

            {/* Create Challenge Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer un Nouveau Défi Écologique</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer un défi sponsorisé
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title">Titre du Défi</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Collecte de Plastique pour l'Afrique"
                        value={newChallenge.title}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Décrivez l'objectif du défi..."
                        value={newChallenge.description}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sponsor">Sponsor</Label>
                      <Input
                        id="sponsor"
                        placeholder="Ex: Tunisie Recyclage"
                        value={newChallenge.sponsor}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, sponsor: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cause">Cause Humanitaire</Label>
                      <Input
                        id="cause"
                        placeholder="Ex: Enfants d'Afrique"
                        value={newChallenge.cause}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, cause: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetAmount">Objectif</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        step="0.1"
                        placeholder="20"
                        value={newChallenge.targetAmount}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, targetAmount: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Unité</Label>
                      <Input
                        id="unit"
                        placeholder="kg, bouteilles, etc."
                        value={newChallenge.unit}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, unit: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reward">Récompense (DT)</Label>
                      <Input
                        id="reward"
                        type="number"
                        placeholder="2000"
                        value={newChallenge.reward}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, reward: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Date Limite</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newChallenge.deadline}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateChallenge} className="gradient-primary" disabled={isCreating}>
                    <Plus className="w-4 h-4 mr-2" />
                    {isCreating ? 'Création...' : 'Créer le Défi'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Section Messagerie */}
        {activeSection === 'messagerie' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Button variant="outline" onClick={() => setActiveSection('dashboard')} className="w-fit">
                ← Retour au Dashboard
              </Button>
              <h2 className="text-2xl font-bold text-center sm:text-left">Messagerie</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste des conversations */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Conversations</h3>
                  </div>
                  <ScrollArea className="h-[600px]">
                    {messagerieLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                          <p className="text-gray-600">Chargement...</p>
                        </div>
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600">Aucune conversation</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {conversations.map((conv) => (
                          <div
                            key={conv.userId}
                            onClick={() => setSelectedConversation(conv)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                              selectedConversation?.userId === conv.userId ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-10 w-10 flex-shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {conv.userName[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                                    {conv.userName}
                                  </h4>
                                  {conv.unreadCount > 0 && (
                                    <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                      {conv.unreadCount}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 truncate mb-1">
                                  {conv.lastMessage}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(conv.lastMessageTime).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Zone de conversation */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md h-[700px] flex flex-col">
                  {selectedConversation ? (
                    <>
                      <CardContent className="p-4 border-b flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {selectedConversation.userName[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{selectedConversation.userName}</h3>
                            <p className="text-xs text-gray-500">{selectedConversation.userEmail}</p>
                          </div>
                        </div>
                      </CardContent>
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {conversationMessages.map((message) => {
                            const isAdmin = message.sender.id === parseInt(user?.id || '0');
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`flex items-start space-x-2 max-w-[80%] ${
                                    isAdmin ? 'flex-row-reverse space-x-reverse' : ''
                                  }`}
                                >
                                  <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarFallback className={isAdmin ? 'bg-primary text-white text-xs' : 'bg-gray-100 text-gray-700 text-xs'}>
                                      {isAdmin ? 'AD' : selectedConversation.userName[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div
                                    className={`rounded-2xl px-4 py-2 ${
                                      isAdmin
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                                  >
                                    <p className="text-sm whitespace-pre-wrap break-words">
                                      {message.content}
                                    </p>
                                    <p
                                      className={`text-xs mt-1 ${
                                        isAdmin ? 'text-white/70' : 'text-gray-500'
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
                        </div>
                      </ScrollArea>
                      <div className="p-4 border-t flex-shrink-0">
                        <div className="flex items-end space-x-2">
                          <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Tapez votre message..."
                            disabled={sendingMessage}
                            className="flex-1 min-h-[60px]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sendingMessage}
                            className="gradient-primary h-[60px]"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Sélectionnez une conversation
                        </h3>
                        <p className="text-gray-500">
                          Choisissez une conversation dans la liste pour commencer à échanger
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}