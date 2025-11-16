// Données mock pour le développement frontend
// Ces données seront remplacées par les appels API backend

import { Article, Seller, Challenge } from '../types';

// Vendeurs mock
export const mockSellers: Record<string, Seller> = {
  '1': {
    id: '1',
    name: 'Ahmed Ben Ali',
    avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwcm9maWxlJTIwYXZhdGFyJTIwd29tYW58ZW58MXx8fHwxNzU5NjkyOTI3fDA&ixlib=rb-4.0.0&q=80&w=1080',
    rating: 4.8,
    reviewsCount: 23,
    joinedDate: 'Membre depuis mars 2023',
    responseTime: 'Répond en moins d\'1h',
    verified: true,
  },
  '2': {
    id: '2',
    name: 'Fatma Trabelsi',
    avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwcm9maWxlJTIwYXZhdGFyJTIwd29tYW58ZW58MXx8fHwxNzU5NjkyOTI3fDA&ixlib=rb-4.0.0&q=80&w=1080',
    rating: 4.5,
    reviewsCount: 15,
    joinedDate: 'Membre depuis juin 2023',
    responseTime: 'Répond en moins de 2h',
    verified: false,
  },
  '3': {
    id: '3',
    name: 'Mohamed Gharbi',
    avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwcm9maWxlJTIwYXZhdGFyJTIwd29tYW58ZW58MXx8fHwxNzU5NjkyOTI3fDA&ixlib=rb-4.0.0&q=80&w=1080',
    rating: 4.9,
    reviewsCount: 42,
    joinedDate: 'Membre depuis janvier 2023',
    responseTime: 'Répond en moins d\'1h',
    verified: true,
  },
};

// Articles mock
export const mockArticles: Record<string, Article> = {
  '1': {
    id: 1,
    title: 'Grille-pain Moulinex',
    description: 'Fonctionne parfaitement, légers signes d\'usage',
    fullDescription: 'Grille-pain Moulinex 2 tranches en bon état de fonctionnement. Quelques traces d\'usage normale mais fonctionne parfaitement. Thermostat réglable, tiroir ramasse-miettes inclus. Idéal pour étudiants ou première installation. Nettoyé et désinfecté. À récupérer sur place ou envoi possible.',
    price: '50 DT',
    location: 'Tunis Centre',
    type: 'revendre',
    category: 'electronique',
    timeAgo: 'il y a 2h',
    image: 'https://images.unsplash.com/photo-1610889556528-6ca0ec833fb7?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610889556528-6ca0ec833fb7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop'
    ],
    seller: mockSellers['1'],
    condition: 'Bon état',
    brand: 'Moulinex',
    status: 'available',
  },
  '2': {
    id: 2,
    title: 'Canapé 3 places vintage',
    description: 'Style scandinave, très bon état, non fumeur',
    fullDescription: 'Magnifique canapé 3 places de style scandinave des années 70. Tissu en excellent état, structure en bois massif très solide. Aucune tache, aucune odeur (maison non fumeur). Coussins moelleux et confortables. Idéal pour un salon vintage ou moderne. À récupérer sur place uniquement.',
    price: 'Échange',
    location: 'Sfax',
    type: 'echanger',
    category: 'meubles',
    timeAgo: 'il y a 4h',
    image: 'https://images.unsplash.com/photo-1566097127353-0f282701b26a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc29mYXxlbnwxfHx8fDE3NTk0Mjc4MTR8MA&ixlib=rb-4.0.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1566097127353-0f282701b26a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc29mYXxlbnwxfHx8fDE3NTk0Mjc4MTR8MA&ixlib=rb-4.0.0&q=80&w=1080'
    ],
    seller: mockSellers['2'],
    condition: 'Excellent état',
    dimensions: 'L200 x P90 x H80 cm',
    year: '1970',
    status: 'available',
  },
  '3': {
    id: 3,
    title: 'Chaise de bureau ergonomique',
    description: 'Réglable en hauteur, légères traces d\'usure',
    fullDescription: 'Chaise de bureau ergonomique noire, réglable en hauteur avec accoudoirs. Utilisée en télétravail pendant 2 ans. Structure métallique solide, roulettes en bon état. Quelques légères traces d\'usure sur l\'assise mais reste très confortable. Parfaite pour étudiant ou bureau à domicile. Démontable pour faciliter le transport.',
    price: '90 DT',
    location: 'Monastir',
    type: 'revendre',
    category: 'meubles',
    timeAgo: 'il y a 3 jours',
    image: 'https://images.unsplash.com/photo-1611298750535-e435639dd5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMGVyZ29ub21pY3xlbnwxfHx8fDE3NTk0Mjc4MzF8MA&ixlib=rb-4.0.3&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1611298750535-e435639dd5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpciUyMGVyZ29ub21pY3xlbnwxfHx8fDE3NTk0Mjc4MzF8MA&ixlib=rb-4.0.3&q=80&w=1080'
    ],
    seller: mockSellers['3'],
    condition: 'Bon état',
    status: 'available',
  },
  '4': {
    id: 4,
    title: 'Jouets en bois pour enfants',
    description: 'Jeux éducatifs pour enfants 3-6 ans, très propres',
    fullDescription: 'Lot de jouets en bois massif de qualité : puzzles éducatifs, blocs de construction, jeu d\'encastrement, petite voiture en bois. Parfait état, nettoyés et désinfectés. Mes enfants ont grandi et ne jouent plus avec. Marques reconnues (Janod, Haba). Idéal pour développer la motricité fine et la créativité. À récupérer sur place uniquement.',
    price: 'Gratuit',
    location: 'Mahdia',
    type: 'donner',
    category: 'autres',
    timeAgo: 'il y a 1 jour',
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB0b3lzJTIwa2lkc3xlbnwxfHx8fDE3NTk0Mjc4Mzd8MA&ixlib=rb-4.0.3&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB0b3lzJTIwa2lkc3xlbnwxfHx8fDE3NTk0Mjc4Mzd8MA&ixlib=rb-4.0.3&q=80&w=1080'
    ],
    seller: mockSellers['1'],
    condition: 'Excellent état',
    status: 'available',
  },
  '5': {
    id: 5,
    title: 'Radiateur électrique d\'appoint',
    description: '1500W, fonctionne parfaitement, très peu servi',
    fullDescription: 'Radiateur électrique d\'appoint 1500W à bain d\'huile. Acheté l\'hiver dernier mais très peu utilisé car mon logement est bien chauffé. Fonctionne parfaitement, chauffe rapidement et silencieusement. 3 niveaux de puissance, thermostat réglable. Roulettes pour faciliter le déplacement. Facture d\'achat disponible. Parfait pour une chambre ou un bureau.',
    price: '75 DT',
    location: 'Bizerte',
    type: 'revendre',
    category: 'electronique',
    timeAgo: 'il y a 5 jours',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF0ZXIlMjByYWRpYXRvcnxlbnwxfHx8fDE3NTk0Mjc4NDJ8MA&ixlib=rb-4.0.3&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF0ZXIlMjByYWRpYXRvcnxlbnwxfHx8fDE3NTk0Mjc4NDJ8MA&ixlib=rb-4.0.3&q=80&w=1080'
    ],
    seller: mockSellers['2'],
    condition: 'Comme neuf',
    brand: 'Delonghi',
    status: 'available',
  },
  '6': {
    id: 6,
    title: 'Plantes vertes en pot',
    description: 'Monstera et ficus, parfaites pour débutants',
    fullDescription: 'Lot de 2 plantes vertes en excellente santé : un Monstera deliciosa (50cm de haut) et un Ficus benjamina (40cm). Pots en céramique inclus. Très faciles d\'entretien, parfaites pour débuter. Déménagement obligé, je ne peux pas les emmener. Arrosage 1 fois par semaine, supportent bien la lumière indirecte. Aucune maladie, feuillage dense et vert.',
    price: '30 DT le lot',
    location: 'Nabeul',
    type: 'revendre',
    category: 'autres',
    timeAgo: 'il y a 1 semaine',
    image: 'https://images.unsplash.com/photo-1604916287784-c324202b3205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBwbGFudHMlMjBtb25zdGVyYXxlbnwxfHx8fDE3NTk0Mjc4NDd8MA&ixlib=rb-4.0.3&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1604916287784-c324202b3205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBwbGFudHMlMjBtb25zdGVyYXxlbnwxfHx8fDE3NTk0Mjc4NDd8MA&ixlib=rb-4.0.3&q=80&w=1080'
    ],
    seller: mockSellers['3'],
    condition: 'Excellent état',
    status: 'available',
  },
};

// Liste des articles pour la page d'accueil
export const mockArticlesList: Article[] = Object.values(mockArticles);

// Commentaires mock
export const mockComments: Record<number, any[]> = {
  1: [
    {
      id: 1,
      articleId: 1,
      user: {
        id: '10',
        name: 'Sami Ben Salah',
        avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'
      },
      content: 'Bonjour, est-ce que le grille-pain est toujours disponible ? Je suis intéressé.',
      createdAt: '2025-01-10T10:30:00Z',
      timeAgo: 'il y a 2 heures'
    },
    {
      id: 2,
      articleId: 1,
      user: {
        id: '11',
        name: 'Leila Mansour',
        avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'
      },
      content: 'Vendeur sérieux, je recommande ! J\'ai déjà acheté chez lui.',
      createdAt: '2025-01-10T09:15:00Z',
      timeAgo: 'il y a 4 heures'
    }
  ],
  2: [
    {
      id: 3,
      articleId: 2,
      user: {
        id: '12',
        name: 'Karim Aziz',
        avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'
      },
      content: 'Magnifique canapé ! Quelles sont les dimensions exactes ?',
      createdAt: '2025-01-10T08:00:00Z',
      timeAgo: 'il y a 6 heures'
    }
  ],
  3: [
    {
      id: 4,
      articleId: 3,
      user: {
        id: '13',
        name: 'Nadia Jlassi',
        avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'
      },
      content: 'Je cherche une chaise exactement comme ça ! Elle est encore disponible ?',
      createdAt: '2025-01-09T15:20:00Z',
      timeAgo: 'il y a 1 jour'
    }
  ],
  4: [
    {
      id: 5,
      articleId: 4,
      user: {
        id: '14',
        name: 'Riadh Chaouch',
        avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'
      },
      content: 'Super lot de jouets ! Mes enfants vont adorer. Merci pour le don.',
      createdAt: '2025-01-09T12:00:00Z',
      timeAgo: 'il y a 1 jour'
    }
  ],
  5: [
    {
      id: 6,
      articleId: 5,
      user: {
        id: '15',
        name: 'Ines Hamdi',
        avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'
      },
      content: 'Parfait pour l\'hiver ! Le prix est négociable ?',
      createdAt: '2025-01-08T14:30:00Z',
      timeAgo: 'il y a 2 jours'
    }
  ],
  6: [
    {
      id: 7,
      articleId: 6,
      user: {
        id: '16',
        name: 'Youssef Khelifi',
        avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'
      },
      content: 'Belles plantes ! Est-ce qu\'on peut juste acheter le Monstera ?',
      createdAt: '2025-01-07T16:45:00Z',
      timeAgo: 'il y a 3 jours'
    }
  ]
};

// Défis écologiques mock
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Collecte de Plastique pour l\'Afrique',
    description: 'Collectez du plastique recyclable pour aider les enfants défavorisés en Afrique',
    sponsor: 'Tunisie Recyclage',
    targetAmount: 20,
    currentAmount: 14.5,
    unit: 'kg',
    reward: 2000,
    cause: 'Enfants d\'Afrique',
    deadline: '2025-02-15',
    status: 'active',
    createdAt: '2025-01-05T08:00:00Z',
    contributions: [
      {
        userId: '1',
        userName: 'Ahmed Ben Ali',
        userAvatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
        amount: 5,
        timestamp: '2025-01-10T10:00:00Z'
      },
      {
        userId: '2',
        userName: 'Fatma Trabelsi',
        userAvatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
        amount: 3.5,
        timestamp: '2025-01-11T14:30:00Z'
      },
      {
        userId: '3',
        userName: 'Mohamed Gharbi',
        userAvatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
        amount: 6,
        timestamp: '2025-01-12T09:15:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Collecte de Bouteilles en Verre',
    description: 'Recyclez vos bouteilles en verre pour soutenir les familles palestiniennes',
    sponsor: 'EcoTunisia',
    targetAmount: 100,
    currentAmount: 48,
    unit: 'bouteilles',
    reward: 1500,
    cause: 'Palestine Solidaire',
    deadline: '2025-01-30',
    status: 'active',
    createdAt: '2025-01-08T10:00:00Z',
    contributions: [
      {
        userId: '10',
        userName: 'Sami Ben Salah',
        amount: 25,
        timestamp: '2025-01-15T11:00:00Z'
      },
      {
        userId: '11',
        userName: 'Leila Mansour',
        amount: 23,
        timestamp: '2025-01-16T16:20:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Collecte de Papier et Carton',
    description: 'Donnez une seconde vie au papier pour l\'éducation des enfants démunis',
    sponsor: 'Green Tunisia',
    targetAmount: 50,
    currentAmount: 50,
    unit: 'kg',
    reward: 1000,
    cause: 'Éducation Sans Frontières',
    deadline: '2025-01-20',
    status: 'completed',
    createdAt: '2025-01-01T08:00:00Z',
    completedAt: '2025-01-18T15:30:00Z',
    contributions: [
      {
        userId: '1',
        userName: 'Ahmed Ben Ali',
        amount: 15,
        timestamp: '2025-01-10T10:00:00Z'
      },
      {
        userId: '2',
        userName: 'Fatma Trabelsi',
        amount: 12,
        timestamp: '2025-01-12T14:00:00Z'
      },
      {
        userId: '12',
        userName: 'Karim Aziz',
        amount: 10,
        timestamp: '2025-01-15T09:00:00Z'
      },
      {
        userId: '13',
        userName: 'Nadia Jlassi',
        amount: 8,
        timestamp: '2025-01-17T11:30:00Z'
      },
      {
        userId: '3',
        userName: 'Mohamed Gharbi',
        amount: 5,
        timestamp: '2025-01-18T13:00:00Z'
      }
    ]
  },
  {
    id: '4',
    title: 'Collecte de Textiles Usagés',
    description: 'Recyclez vos vieux vêtements pour aider les sans-abris',
    sponsor: 'Solidarité Textile',
    targetAmount: 30,
    currentAmount: 8,
    unit: 'kg',
    reward: 800,
    cause: 'Sans-abris de Tunis',
    deadline: '2025-02-28',
    status: 'active',
    createdAt: '2025-01-12T08:00:00Z',
    contributions: [
      {
        userId: '14',
        userName: 'Riadh Chaouch',
        amount: 8,
        timestamp: '2025-01-18T10:00:00Z'
      }
    ]
  }
];
