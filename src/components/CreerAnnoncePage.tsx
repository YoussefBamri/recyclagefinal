import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { createArticle } from "../api/articleApi";

import { 
  Upload, 
  Plus, 
  X, 
  MapPin, 
  Gift, 
  ArrowRightLeft,
  Trash2,
  Camera,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface FormData {
  type: 'revendre' | 'echanger' | 'donner' | 'recycler' | '';
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  location: string;
  exchangeFor: string;
  association: string;
  images: string[];
}

export default function CreerAnnoncePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type') as FormData['type'] || '';

  const [formData, setFormData] = useState<FormData>({
    type: typeFromUrl,
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: 'Tunis Centre',
    exchangeFor: '',
    association: '',
    images: []
  });

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // ✅ ajouté

  const typeConfig = {
    revendre: {
      title: 'Revendre un article',
      icon: DollarSign,
      color: 'bg-green-100 text-green-800 border-green-200',
      description: 'Vendez vos objets en bon état'
    },
    echanger: {
      title: 'Échanger un article',
      icon: ArrowRightLeft,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Échangez contre un autre objet'
    },
    donner: {
      title: 'Donner un article',
      icon: Gift,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Offrez gratuitement vos objets'
    }
  };

  const categories = [
    'electronique',
    'meubles',
    'vetements',
    'sport',
    'livres',
    'electromenager',
    'decoration',
    'jardin',
    'enfants',
    'autres'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Correction : upload du vrai fichier
  const handleImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        images: [previewUrl]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setSelectedFile(null); // ✅ on vide le fichier si supprimé
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  // ✅ Correction : envoi du fichier réel avec FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type) return alert("Veuillez sélectionner un type d'annonce");
    if (!formData.title || !formData.description || !formData.category)
      return alert("Veuillez remplir tous les champs obligatoires");
    if (formData.type === "revendre" && !formData.price)
      return alert("Veuillez indiquer un prix");
    if (formData.type === "echanger" && !formData.exchangeFor)
      return alert("Veuillez indiquer ce que vous souhaitez en échange");

    try {
      if (!user || !user.id) {
        alert("Utilisateur non connecté !");
        return;
      }

      const newArticle = {
        ...formData,
        userId: user.id,
      };

      // ✅ envoi du fichier réel au backend
      const response = await createArticle(user.id, newArticle, selectedFile || undefined);
      console.log("✅ Article créé:", response);

      alert("Article publié avec succès !");
      navigate("/mes-annonces");
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      alert("Erreur lors de la création de l'annonce");
    }
  };

  const getCurrentConfig = () => {
    return formData.type ? typeConfig[formData.type] : null;
  };

  if (!user) {
    navigate('/connexion');
    return null;
  }

  // Rediriger les admins vers la page d'accueil
  if (user?.email === 'admin@recycle.com' || user?.role === 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Créer une annonce</h1>
          <p className="text-gray-600">Publiez votre article en quelques étapes simples</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sélection du type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Type d'annonce</span>
                <Badge variant="secondary">Obligatoire</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(typeConfig).map(([type, config]) => {
                  const Icon = config.icon;
                  const isSelected = formData.type === type;
                  
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('type', type as FormData['type'])}
                      className={`p-4 border-2 rounded-lg text-center transition-all hover:scale-105 ${
                        isSelected 
                          ? config.color
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium mb-1">{config.title}</div>
                      <div className="text-sm text-gray-600">{config.description}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Informations principales */}
          {formData.type && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getCurrentConfig() && (() => {
                    const config = getCurrentConfig();
                    const Icon = config.icon;
                    return <Icon className="w-5 h-5" />;
                  })()}
                  <span>Informations principales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de l'annonce *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: iPhone 12 Pro en excellent état"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre article en détail (état, utilisation, etc.)"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="condition">État</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'état" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neuf">Neuf</SelectItem>
                        <SelectItem value="tres-bon">Très bon état</SelectItem>
                        <SelectItem value="bon">Bon état</SelectItem>
                        <SelectItem value="correct">État correct</SelectItem>
                        <SelectItem value="usage">Pour pièces/usage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="location"
                        placeholder="Gouvernorat, ville"
                        className="pl-10"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations spécifiques selon le type */}
          {formData.type === 'revendre' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Informations de vente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix de vente *</Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">DT</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Consultez les prix similaires pour fixer un tarif attractif
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {formData.type === 'echanger' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  <span>Informations d'échange</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="exchangeFor">Que souhaitez-vous en échange ? *</Label>
                  <Textarea
                    id="exchangeFor"
                    placeholder="Ex: Console de jeu, vélo, livre de cuisine..."
                    rows={3}
                    value={formData.exchangeFor}
                    onChange={(e) => handleInputChange('exchangeFor', e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-600">
                    Soyez précis sur ce que vous recherchez pour faciliter les échanges
                  </p>
                </div>
              </CardContent>
            </Card>
          )}



          {/* Upload d'images */}
          {formData.type && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Photos de l'article</span>
                  <Badge variant="outline">Recommandé</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Zone de drop */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">
                        Glissez vos photos ici ou cliquez pour sélectionner
                      </p>
                      <p className="text-sm text-gray-500">
                        Maximum 5 photos - JPG, PNG (max 10MB chacune)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Choisir des photos
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                  </div>

                  {/* Aperçu des images */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={image}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-blue-500">
                              Photo principale
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Boutons d'action */}
          {formData.type && (
            <div className="flex justify-between items-center pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Annuler
              </Button>
              
              <Button
                type="submit"
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Publier l'annonce</span>
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}