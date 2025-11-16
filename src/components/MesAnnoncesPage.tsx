import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getUserArticles, deleteArticle, updateArticle } from '../api/articleApi';
import { toast } from 'sonner';
import { 
  MapPin, 
  Clock, 
  Package,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserArticle {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  type: string;
  category: string;
  timeAgo: string;
  image: string;
  isActive: boolean;
  isSold: boolean;
  views: number;
  messages: number;
}

// Fonction pour mapper les données du backend vers le format frontend
const mapArticleToUserArticle = (article: any): UserArticle => {
  const statut = article.statut || article.status || 'sale';
  const isSold = statut === 'sold' || statut === 'SOLD';
  const isActive = !isSold && (statut === 'sale' || statut === 'SALE' || statut === 'exchange' || statut === 'EXCHANGE' || statut === 'giveaway' || statut === 'GIVEAWAY');
  
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
  
  return {
    id: article.id || String(article.ID),
    title: article.titre || article.title || '',
    description: article.description || '',
    price: article.prix ? `${article.prix} DT` : 'Gratuit',
    location: article.localisation || article.location || 'Tunis Centre',
    type: type,
    category: article.categorie || article.category || '',
    timeAgo: timeAgo,
    image: imageUrl,
    isActive: isActive,
    isSold: isSold,
    views: 0, // À implémenter si disponible dans le backend
    messages: 0 // À implémenter si disponible dans le backend
  };
};

export default function MesAnnoncesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [articles, setArticles] = useState<UserArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'inactive'>('active');

  // Charger les articles de l'utilisateur
  useEffect(() => {
    const loadArticles = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        if (isNaN(userId)) {
          throw new Error('ID utilisateur invalide');
        }
        const data = await getUserArticles(userId);
        console.log('📦 Articles reçus du backend:', data);
        
        // Gérer différents formats de réponse
        const articlesArray = Array.isArray(data) ? data : (data.articles || data.data || []);
        const mappedArticles = articlesArray.map(mapArticleToUserArticle);
        setArticles(mappedArticles);
      } catch (error: any) {
        console.error('❌ Erreur lors du chargement des articles:', error);
        toast.error('Erreur lors du chargement de vos annonces');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [user?.id]);

  const handleStatusToggle = async (articleId: string, newStatus: boolean) => {
    try {
      // Si on désactive, on garde le statut actuel mais on ne l'affiche plus comme actif
      // Pour simplifier, on ne change pas le statut dans le backend pour l'instant
      // On peut ajouter un champ "isActive" dans le backend si nécessaire
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, isActive: newStatus, isSold: !newStatus && article.isSold ? false : article.isSold }
          : article
      ));
      toast.success('Statut de l\'annonce mis à jour');
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleMarkAsSold = async (articleId: string) => {
    try {
      await updateArticle(articleId, { statut: 'sold' });
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, isSold: true, isActive: false }
          : article
      ));
      toast.success('Annonce marquée comme vendue');
    } catch (error: any) {
      console.error('❌ Erreur lors du marquage comme vendu:', error);
      toast.error('Erreur lors du marquage comme vendu');
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      await deleteArticle(articleId);
      setArticles(prev => prev.filter(article => article.id !== articleId));
      toast.success('Annonce supprimée avec succès');
    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'annonce');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revendre': return 'bg-green-100 text-green-800';
      case 'echanger': return 'bg-blue-100 text-blue-800';
      case 'donner': return 'bg-purple-100 text-purple-800';
      case 'recycler': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'revendre': return 'À vendre';
      case 'echanger': return 'Échange';
      case 'donner': return 'Don';
      case 'recycler': return 'Don associatif';
      default: return type;
    }
  };

  const filteredArticles = articles.filter(article => {
    switch (activeTab) {
      case 'active': return article.isActive && !article.isSold;
      case 'sold': return article.isSold;
      case 'inactive': return !article.isActive && !article.isSold;
      default: return true;
    }
  });

  const getStatusBadge = (article: UserArticle) => {
    if (article.isSold) {
      return <Badge className="bg-red-100 text-red-800">Vendu</Badge>;
    }
    if (article.isActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes annonces</h1>
          <p className="text-gray-600">Gérez vos annonces et suivez leurs performances</p>
        </div>

        {/* Statistiques - Admin uniquement */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Package className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold">{articles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Settings className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Actives</p>
                    <p className="text-2xl font-bold">{articles.filter(a => a.isActive && !a.isSold).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Vendues</p>
                    <p className="text-2xl font-bold">{articles.filter(a => a.isSold).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Eye className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Vues totales</p>
                    <p className="text-2xl font-bold">{articles.reduce((sum, a) => sum + a.views, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Actives ({articles.filter(a => a.isActive && !a.isSold).length})
              </button>
              <button
                onClick={() => setActiveTab('sold')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sold'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vendues ({articles.filter(a => a.isSold).length})
              </button>
              {/* Onglet Inactives - Admin uniquement */}
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('inactive')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'inactive'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Inactives ({articles.filter(a => !a.isActive && !a.isSold).length})
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Liste des articles */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Chargement de vos annonces...</p>
              </CardContent>
            </Card>
          ) : filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Aucune annonce dans cette catégorie
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'active' && 'Vous n\'avez pas d\'annonces actives pour le moment.'}
                  {activeTab === 'sold' && 'Vous n\'avez pas encore vendu d\'articles.'}
                  {activeTab === 'inactive' && 'Vous n\'avez pas d\'annonces inactives.'}
                </p>
                <Button asChild>
                  <Link to="/creer-annonce">Créer une annonce</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1">
                        <Badge className={`${getTypeColor(article.type)} text-xs`}>
                          {getTypeLabel(article.type)}
                        </Badge>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-800 truncate">{article.title}</h3>
                            {getStatusBadge(article)}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{article.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{article.timeAgo}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{article.views} vues</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>{article.messages} messages</span>
                            </div>
                          </div>
                        </div>

                        {/* Prix et actions */}
                        <div className="flex flex-col items-end space-y-3 ml-4">
                          <div className="text-lg font-semibold text-gray-800">
                            {article.price}
                          </div>

                          {/* Contrôles */}
                          <div className="flex items-center space-x-2">
                            {!article.isSold && (
                              <>
                                {/* Switch Activer/Désactiver - Admin uniquement */}
                                {isAdmin && (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">
                                      {article.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <Switch
                                      checked={article.isActive}
                                      onCheckedChange={(checked) => handleStatusToggle(article.id, checked)}
                                    />
                                  </div>
                                )}
                                
                                {/* Bouton "Marquer vendu" - Uniquement pour les articles à vendre */}
                                {article.type === 'revendre' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkAsSold(article.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    Marquer vendu
                                  </Button>
                                )}
                              </>
                            )}
                            
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/article/${article.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            
                            {/* Bouton Modifier - Admin uniquement */}
                            {isAdmin && (
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(article.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}