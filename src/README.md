# Marketplace Tunisienne - Application de Petites Annonces

Application de marketplace tunisienne axée sur le recyclage et l'économie circulaire. Les utilisateurs peuvent publier des annonces pour revendre, échanger, donner ou recycler des articles.

## 🏗️ Architecture du Projet

### Structure des Dossiers

```
/
├── components/          # Composants React
│   ├── ui/             # Composants ShadCN réutilisables
│   ├── figma/          # Composants d'import Figma
│   └── ...             # Pages et composants métier
├── data/               # Données mock pour le développement
├── services/           # Services API et logique métier
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
├── constants/          # Constantes de l'application
└── styles/             # Styles globaux CSS
```

### Technologies Utilisées

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN/UI
- **Icons**: Lucide React
- **Backend (à venir)**: Supabase

## 🚀 Préparation pour le Backend

### Système de Mock Data

Actuellement, l'application utilise des données mock définies dans `/data/mockData.ts`.
Pour passer au backend:

1. **Modifier `/services/api.ts`**:
   - Changer `USE_MOCK_DATA = false`
   - Implémenter les appels API réels
   
2. **Configuration Supabase**:
   - Créer les tables dans Supabase
   - Configurer l'authentification
   - Mettre en place le storage pour les images

### Tables Requises (Supabase)

#### Table: `users`
```sql
- id (uuid, primary key)
- email (text, unique)
- name (text)
- avatar (text, nullable)
- role (text, default: 'user')
- joined_date (timestamp)
- created_at (timestamp)
```

#### Table: `articles`
```sql
- id (bigint, primary key)
- title (text)
- description (text)
- full_description (text, nullable)
- price (text)
- location (text)
- type (text) -- 'revendre', 'echanger', 'donner', 'recycler'
- category (text)
- image (text)
- images (text[])
- seller_id (uuid, foreign key -> users.id)
- condition (text, nullable)
- brand (text, nullable)
- model (text, nullable)
- status (text, default: 'available')
- created_at (timestamp)
- updated_at (timestamp)
```

#### Table: `comments`
```sql
- id (bigint, primary key)
- article_id (bigint, foreign key -> articles.id)
- user_id (uuid, foreign key -> users.id)
- content (text)
- created_at (timestamp)
```

#### Table: `messages`
```sql
- id (bigint, primary key)
- sender_id (uuid, foreign key -> users.id)
- receiver_id (uuid, foreign key -> users.id)
- article_id (bigint, foreign key -> articles.id, nullable)
- content (text)
- read (boolean, default: false)
- created_at (timestamp)
```

#### Table: `notifications`
```sql
- id (bigint, primary key)
- user_id (uuid, foreign key -> users.id)
- type (text)
- title (text)
- message (text)
- article_id (bigint, nullable)
- link (text, nullable)
- read (boolean, default: false)
- created_at (timestamp)
```

### API Endpoints à Implémenter

#### Articles
- `GET /api/articles` - Liste des articles (avec filtres)
- `GET /api/articles/:id` - Détails d'un article
- `POST /api/articles` - Créer un article (authentifié)
- `PATCH /api/articles/:id` - Mettre à jour un article (authentifié, propriétaire)
- `DELETE /api/articles/:id` - Supprimer un article (authentifié, propriétaire ou admin)

#### Commentaires
- `GET /api/articles/:id/comments` - Commentaires d'un article
- `POST /api/comments` - Créer un commentaire (authentifié)
- `DELETE /api/comments/:id` - Supprimer un commentaire (authentifié, propriétaire)

#### Utilisateurs
- `GET /api/users/:id` - Profil utilisateur
- `PATCH /api/users/:id` - Mettre à jour le profil (authentifié)
- `GET /api/users/:id/articles` - Articles d'un utilisateur

#### Messages
- `GET /api/messages` - Conversations de l'utilisateur (authentifié)
- `POST /api/messages` - Envoyer un message (authentifié)
- `PATCH /api/messages/:id/read` - Marquer comme lu (authentifié)

#### Notifications
- `GET /api/notifications` - Notifications de l'utilisateur (authentifié)
- `PATCH /api/notifications/:id/read` - Marquer comme lu (authentifié)

#### Upload
- `POST /api/upload` - Upload d'image (authentifié)

### Variables d'Environnement

Créer un fichier `.env.local`:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 Types TypeScript

Tous les types sont définis dans `/types/index.ts` et peuvent être importés:

```typescript
import { Article, User, Comment, Notification } from '../types';
```

## 🛠️ Fonctions Utilitaires

Les fonctions utilitaires sont disponibles dans `/utils/helpers.ts`:

```typescript
import { formatPrice, getTimeAgo, truncateText } from '../utils/helpers';
```

## 🎨 Constantes

Les constantes sont centralisées dans `/constants/index.ts`:

```typescript
import { CATEGORIES, TUNISIAN_CITIES, CURRENCY } from '../constants';
```

## 🔧 Services API

Les services API sont dans `/services/api.ts`:

```typescript
import { articlesApi, commentsApi, usersApi } from '../services/api';

// Utilisation
const articles = await articlesApi.getAll({ category: 'electronique' });
const article = await articlesApi.getById('1');
```

## 📱 Features Principales

- ✅ Navigation et routing
- ✅ Authentification utilisateur
- ✅ Création d'annonces (revendre, échanger, donner, recycler)
- ✅ Page de détails d'articles avec galerie d'images
- ✅ Système de commentaires
- ✅ Profil vendeur avec ratings
- ✅ Messagerie entre utilisateurs
- ✅ Notifications
- ✅ Panel admin
- ✅ Chatbot IA
- ✅ Responsive design
- ⏳ Backend Supabase (à implémenter)
- ⏳ Upload d'images (à implémenter)
- ⏳ Recherche avancée (à implémenter)
- ⏳ Favoris (à implémenter)

## 🚦 Prochaines Étapes

1. **Configurer Supabase**
   - Créer le projet Supabase
   - Créer les tables selon le schéma
   - Configurer l'authentification
   - Configurer le storage pour les images

2. **Implémenter les Services API**
   - Modifier `/services/api.ts`
   - Remplacer les mock data par les appels Supabase
   - Ajouter la gestion d'erreurs

3. **Authentification**
   - Intégrer Supabase Auth dans `AuthContext.tsx`
   - Gérer les sessions utilisateur
   - Protéger les routes

4. **Upload d'Images**
   - Configurer Supabase Storage
   - Implémenter l'upload dans le formulaire de création
   - Optimiser les images (compression, resize)

5. **Tests et Optimisations**
   - Tester toutes les fonctionnalités
   - Optimiser les performances
   - Ajouter le loading et error handling

## 📄 License

Ce projet est sous licence privée.
