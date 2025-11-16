import React, { useState, useEffect } from "react";
import { 
  MapPin,
  Clock,
  Sparkles,
  TrendingUp,
  Search,
  Package
} from 'lucide-react';
import { Navigation } from "./Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { ChallengesSection } from "./ChallengesSection";
import { useChallenges } from "../contexts/ChallengesContext";
import { useAuth } from "./AuthContext";
import { getAllArticles } from "../api/articleApi"; // ✅ API backend
import { ChatBot } from "./ChatBot";

export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { challenges, loading: challengesLoading, contributeToChallenge } = useChallenges();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Filtre par catégorie
  const [articles, setArticles] = useState<any[]>([]); // ✅ Liste dynamique
  const [loading, setLoading] = useState(true); // ✅ Chargement

  // ✅ Charger les articles du backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllArticles();
        // 🖼️ Traiter les photos pour construire les URLs complètes
        const processedArticles = data.map((item: any) => {
          // Gérer "photo" (string) et "photos" (array)
          const rawPhotos = Array.isArray(item.photos)
            ? item.photos
            : item.photo
            ? [item.photo]
            : [];

          // Construction des URLs complètes
          const fullPhotoUrls = rawPhotos.map((p: string) => {
            if (p.startsWith('http')) return p;
            // Si le chemin contient déjà 'uploads/', on l'utilise tel quel
            if (p.startsWith('uploads/')) return `http://localhost:3001/${p}`;
            // Sinon, on ajoute 'uploads/' devant
            return `http://localhost:3001/uploads/${p}`;
          });

          return {
            ...item,
            photos: fullPhotoUrls.length > 0 ? fullPhotoUrls : []
          };
        });
        setArticles(processedArticles);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des articles :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // ✅ Trier les articles par date de création (les plus récents en premier)
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.dateCreation || a.createdAt || 0).getTime();
    const dateB = new Date(b.dateCreation || b.createdAt || 0).getTime();
    return dateB - dateA; // Plus récent en premier
  });

  // ✅ Filtrer les articles selon recherche et catégorie
  const filteredArticles = sortedArticles.filter((item) => {
    // Filtre par recherche
    const matchesSearch = 
      searchQuery === "" ||
      item.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par catégorie
    const matchesCategory = 
      selectedCategory === "all" || 
      item.categorie?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // ✅ Limiter à 6 articles les plus récents si aucun filtre n'est actif
  const displayArticles = 
    selectedCategory === "all" && searchQuery === "" 
      ? filteredArticles.slice(0, 6)
      : filteredArticles;

  // ✅ Extraire les catégories uniques des articles
  const categories = Array.from(
    new Set(
      articles
        .map((item) => item.categorie)
        .filter((cat) => cat && cat.trim() !== "")
    )
  ).sort();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "revendre":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "echanger":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "donner":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "recycler":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "revendre": return t('type.sell');
      case "echanger": return t('type.exchange');
      case "donner": return t('type.give');
      case "recycler": return t('type.recycle');
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* --- HERO --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 blur-3xl -z-10"></div>
          
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-lg mb-6"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-gradient">
              {t('home.title')}
            </span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Recyclez, ne jetez pas
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>

          {/* --- Barre de recherche --- */}
          <div className="relative max-w-2xl mx-auto mb-10">
            <input
              type="text"
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl pr-14 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-lg transition-all"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 gradient-primary p-3 rounded-xl shadow-md">
              <Search className="text-white w-5 h-5" />
            </div>
          </div>

          {/* --- Boutons d'action --- */}
          {!(user?.role === 'admin' || user?.email === 'admin@recycle.com') && (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/creer-annonce?type=revendre" className="gradient-primary text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 font-semibold">
                💰 Revendre
              </Link>
              <Link to="/creer-annonce?type=echanger" className="gradient-secondary text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 font-semibold">
                🔄 Échanger
              </Link>
              <Link to="/creer-annonce?type=donner" className="gradient-accent text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 font-semibold">
                🎁 Donner
              </Link>
            </div>
          )}
        </motion.div>

        {/* --- Challenges --- */}
        {!challengesLoading && challenges.filter(c => c.status === 'active' || c.status === 'completed').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <ChallengesSection 
              challenges={challenges.filter(c => c.status === 'active' || c.status === 'completed')} 
              onContribute={async (challengeId, amount) => {
                if (user) {
                  try {
                    await contributeToChallenge(
                      challengeId, 
                      amount, 
                      user.id, 
                      `${user.firstName} ${user.lastName}`
                    );
                  } catch (error) {
                    // L'erreur est déjà gérée dans le contexte
                  }
                }
              }}
            />
          </motion.div>
        )}

        {/* --- Liste des annonces dynamiques --- */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === "all" && searchQuery === "" 
                ? "Nouvelles offres" 
                : "Annonces"}
            </h2>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-white rounded-full shadow-md">
                <span className="text-primary font-bold">{displayArticles.length}</span>
                <span className="text-gray-600 text-sm ml-1">
                  {selectedCategory === "all" && searchQuery === "" 
                    ? "offre" + (displayArticles.length > 1 ? "s" : "")
                    : "annonce" + (displayArticles.length > 1 ? "s" : "")}
                </span>
              </span>
            </div>
          </div>

          {/* --- Filtres par catégorie --- */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
              }`}
            >
              Toutes
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Chargement des annonces...
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayArticles.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/article/${item.id}`}>
                    <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover-lift shadow-md group">
                      <div className="aspect-video relative overflow-hidden">
                        <ImageWithFallback
                          src={
                            item.photos?.length
                              ? item.photos[0]
                              : "/placeholder.png"
                          }
                          alt={item.titre}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getTypeColor(item.statut)} border font-semibold shadow-lg`}>
                            {getTypeLabel(item.statut)}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {item.titre}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between mb-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{item.localisation}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(item.dateCreation).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="font-bold text-xl text-primary">
                            {item.prix ? `${item.prix} DT` : "Gratuit"}
                          </span>
                          <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform">
                            Voir détails →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && displayArticles.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block p-8 bg-white rounded-3xl shadow-xl">
                <Package className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('home.noResults')}</h3>
                <p className="text-gray-600">{t('home.noResultsDesc')}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      {/* Rendre le ChatBot disponible sur la page d'accueil */}
      <ChatBot />
      
    </div>
    
  );
}
