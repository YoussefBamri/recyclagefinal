import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.createListing': 'Créer une annonce',
    'nav.myListings': 'Mes annonces',
    'nav.login': 'Se connecter',
    'nav.logout': 'Se déconnecter',
    'nav.profile': 'Profil utilisateur',
    'nav.administration': 'Administration',
    'nav.profileInfo': 'Informations du profil et options de compte',
    
    // Home Page
    'home.title': 'Bienvenue sur Recycle',
    'home.subtitle': 'Moins de déchets, plus d\'impact',
    'home.searchPlaceholder': 'Rechercher un article...',
    'home.allCategories': 'Toutes',
    'home.electronics': 'Électronique',
    'home.furniture': 'Meubles',
    'home.clothing': 'Vêtements',
    'home.sports': 'Sport',
    'home.books': 'Livres',
    'home.other': 'Autres',
    'home.noResults': 'Aucun article trouvé',
    'home.noResultsDesc': 'Essayez de modifier vos critères de recherche',
    
    // Listing Types
    'type.sell': 'À vendre',
    'type.exchange': 'Échange',
    'type.give': 'Don',
    'type.recycle': 'Don associatif',
    'type.free': 'Gratuit',
    
    // Common
    'common.location': 'Localisation',
    'common.price': 'Prix',
    'common.description': 'Description',
    'common.category': 'Catégorie',
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    
    // Chat Bot
    'chat.title': 'Assistant IA',
    'chat.placeholder': 'Tapez votre message...',
    'chat.welcome': 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
    'chat.helpTopics': 'Je peux vous aider avec :',
    'chat.createListing': 'Créer une annonce',
    'chat.sellItems': 'Vendre, échanger ou donner des objets',
    'chat.contactSellers': 'Contacter des vendeurs',
    'chat.manageAccount': 'Gérer votre compte',
    
    // Admin Page
    'admin.title': 'Administration',
    'admin.subtitle': 'Gérez les annonces et les utilisateurs de la plateforme',
    'admin.totalListings': 'Total annonces',
    'admin.soldItems': 'Articles vendus',
    'admin.users': 'Utilisateurs',
    'admin.reports': 'Signalements',
    'admin.soldTab': 'Articles vendus',
    'admin.allListings': 'Toutes les annonces',
    'admin.usersTab': 'Utilisateurs',
    'admin.accessDenied': 'Accès refusé',
    'admin.noPermission': 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.',
    'admin.deleteConfirm': 'Êtes-vous sûr de vouloir supprimer cet article ?',
    'admin.viewProfile': 'Voir profil',
    'admin.verified': 'Vérifié',
    'admin.memberSince': 'Membre depuis',
    'admin.listings': 'Annonces',
    'admin.sold': 'Vendues',
    
    // Time
    'time.hoursAgo': 'il y a {0}h',
    'time.daysAgo': 'il y a {0} jours',
    'time.soldAgo': 'Vendu il y a {0} jours',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.createListing': 'Create Listing',
    'nav.myListings': 'My Listings',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    'nav.profile': 'User Profile',
    'nav.administration': 'Administration',
    'nav.profileInfo': 'Profile information and account options',
    
    // Home Page
    'home.title': 'Welcome to Recycle',
    'home.subtitle': 'Less waste, more impact',
    'home.searchPlaceholder': 'Search for an item...',
    'home.allCategories': 'All',
    'home.electronics': 'Electronics',
    'home.furniture': 'Furniture',
    'home.clothing': 'Clothing',
    'home.sports': 'Sports',
    'home.books': 'Books',
    'home.other': 'Other',
    'home.noResults': 'No items found',
    'home.noResultsDesc': 'Try modifying your search criteria',
    
    // Listing Types
    'type.sell': 'For Sale',
    'type.exchange': 'Exchange',
    'type.give': 'Give Away',
    'type.recycle': 'Charity Donation',
    'type.free': 'Free',
    
    // Common
    'common.location': 'Location',
    'common.price': 'Price',
    'common.description': 'Description',
    'common.category': 'Category',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    
    // Chat Bot
    'chat.title': 'AI Assistant',
    'chat.placeholder': 'Type your message...',
    'chat.welcome': 'Hello! I\'m your virtual assistant. How can I help you today?',
    'chat.helpTopics': 'I can help you with:',
    'chat.createListing': 'Creating a listing',
    'chat.sellItems': 'Selling, exchanging or giving away items',
    'chat.contactSellers': 'Contacting sellers',
    'chat.manageAccount': 'Managing your account',
    
    // Admin Page
    'admin.title': 'Administration',
    'admin.subtitle': 'Manage platform listings and users',
    'admin.totalListings': 'Total Listings',
    'admin.soldItems': 'Sold Items',
    'admin.users': 'Users',
    'admin.reports': 'Reports',
    'admin.soldTab': 'Sold Items',
    'admin.allListings': 'All Listings',
    'admin.usersTab': 'Users',
    'admin.accessDenied': 'Access Denied',
    'admin.noPermission': 'You don\'t have the necessary permissions to access this page.',
    'admin.deleteConfirm': 'Are you sure you want to delete this item?',
    'admin.viewProfile': 'View Profile',
    'admin.verified': 'Verified',
    'admin.memberSince': 'Member since',
    'admin.listings': 'Listings',
    'admin.sold': 'Sold',
    
    // Time
    'time.hoursAgo': '{0}h ago',
    'time.daysAgo': '{0} days ago',
    'time.soldAgo': 'Sold {0} days ago',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, ...args: string[]): string => {
    let translation = translations[language][key as keyof typeof translations['fr']] || key;
    
    // Replace placeholders {0}, {1}, etc. with provided arguments
    args.forEach((arg, index) => {
      translation = translation.replace(`{${index}}`, arg);
    });
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
