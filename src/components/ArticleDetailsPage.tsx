  import { useEffect, useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { Navigation } from './Navigation';
  import { useAuth } from './AuthContext';
  import { useLanguage } from '../contexts/LanguageContext';
  import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
  import { Button } from './ui/button';
  import { Badge } from './ui/badge';
  import { Shield, MapPin, Calendar, Package, ArrowLeft } from 'lucide-react';
  import { motion } from 'motion/react';
  import { ImageWithFallback } from './figma/ImageWithFallback';
  import { getArticleById } from "../api/articleApi";

  interface Utilisateur {
    id: number;
    nom: string;
    phone?: string;
    telephone?: string;
    verifie: boolean;
  }

  interface Article {
    id: number;
    titre: string;
    description: string;
    prix: string;
    lieu: string;
    type: string;
    categorie: string;
    dateCreation: string;
    photos: string[];
    etat: string;
    marque?: string;
    modele?: string;
    annee?: string;
    dimensions?: string;
    poids?: string;
    utilisateur: Utilisateur;
  }

  export default function ArticleDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [article, setArticle] = useState<Article | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchArticle = async () => {
        try {
          if (!id) return;

          const data = await getArticleById(id.toString());
          if (data) {
            // 🖼️ on gère "photo" (string) et "photos" (array)
            const rawPhotos = Array.isArray(data.photos)
              ? data.photos
              : data.photo
              ? [data.photo]
              : [];

            // 🧩 Construction des URLs complètes (backend → React)
            const fullPhotoUrls = rawPhotos.map((p) => {
              if (p.startsWith('http')) return p;
              // Si le chemin contient déjà 'uploads/', on l'utilise tel quel
              if (p.startsWith('uploads/')) return `http://localhost:3001/${p}`;
              // Sinon, on ajoute 'uploads/' devant
              return `http://localhost:3001/uploads/${p}`;
            });

            const mapped: Article = {
              id: data.id,
              titre: data.titre,
              description: data.description,
              prix: data.prix ? `${data.prix} DT` : '—',
              lieu: data.localisation || data.lieu || 'Non spécifié',
              type: data.statut || data.type || 'revendre',
              categorie: data.categorie,
              dateCreation: data.dateCreation,
              photos: fullPhotoUrls.length > 0 ? fullPhotoUrls : ["/no-image.png"],
              etat: data.etat || '—',
              marque: data.marque,
              modele: data.modele,
              annee: data.annee,
              dimensions: data.dimensions,
              poids: data.poids,
              utilisateur: {
                id: data.utilisateur?.id || 0,
                nom: data.utilisateur?.name || 'Inconnu',
                phone: data.utilisateur?.phone || data.utilisateur?.telephone || '',
                verifie: data.utilisateur?.verifie || false,
              },
            };
            setArticle(mapped);
          }
        } catch (error) {
          console.error("Erreur de récupération de l'article :", error);
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }, [id]);

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
        case 'revendre': return 'À vendre';
        case 'echanger': return 'Échange';
        case 'donner': return 'Don';
        case 'recycler': return 'Don associatif';
        default: return type;
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', options);
    };

    if (loading) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
          <p className="text-lg text-gray-600">Chargement de l’article...</p>
        </div>
      );
    }

    if (!article) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
          <Navigation />
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <Package className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Article non trouvé</h1>
            <p className="text-gray-600 mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={() => navigate('/')} className="gradient-primary">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      );
    }

    console.log("✅ Article :", article);
    console.log("👤 User connecté :", user);

    const numeroTel = article.utilisateur.phone || article.utilisateur.telephone || '';


    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-white/80 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden group">
                    <ImageWithFallback
                      src={article.photos[selectedImageIndex]}
                      alt={article.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getTypeColor(article.type)} border font-semibold shadow-lg`}>
                        {getTypeLabel(article.type)}
                      </Badge>
                    </div>
                  </div>

                  {article.photos.length > 1 && (
                    <div className="p-4 border-t bg-white">
                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {article.photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                              selectedImageIndex === index
                                ? 'border-primary shadow-lg scale-105'
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            <ImageWithFallback
                              src={photo}
                              alt={`${article.titre} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <CardTitle className="text-2xl">Description</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed text-lg mb-8">{article.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                      <span className="text-sm font-medium text-blue-600 block mb-1">État</span>
                      <p className="text-gray-900 font-semibold">{article.etat}</p>
                    </div>
                    {article.marque && (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                        <span className="text-sm font-medium text-purple-600 block mb-1">Marque</span>
                        <p className="text-gray-900 font-semibold">{article.marque}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-2xl sticky top-24">
                <div className="gradient-primary p-6 text-white">
                  <h1 className="text-2xl font-bold mb-4">{article.titre}</h1>
                  <span className="text-4xl font-bold">{article.prix}</span>
                </div>

                <CardContent className="p-6 space-y-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-gray-900">{article.utilisateur.nom}</h3>
                      {article.utilisateur.verifie && <Shield className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-gray-700 font-medium">{article.lieu}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 block">Publié le</span>
                        <span className="text-gray-700 font-medium text-sm">{formatDate(article.dateCreation)}</span>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Bouton WhatsApp visible seulement si user connecté ≠ auteur */}
                  {numeroTel && user && String(article.utilisateur.id) !== String(user.id) && (
                    <a
                      href={`https://wa.me/216${numeroTel.replace(/\s/g, '')}?text=${encodeURIComponent(
                        `Bonjour, je suis intéressé(e) par votre annonce "${article.titre}" sur Recycle`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-xl transition-all py-6 text-lg font-semibold text-white">
                        Contacter sur WhatsApp
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
