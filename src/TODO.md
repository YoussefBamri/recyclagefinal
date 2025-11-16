# TODO - Marketplace Tunisienne

## 🔴 Haute Priorité (Backend)

### Configuration Supabase
- [ ] Créer le projet Supabase
- [ ] Créer les tables (voir MIGRATION_GUIDE.md)
- [ ] Configurer Row Level Security
- [ ] Configurer Storage pour les images
- [ ] Configurer l'authentification

### Intégration Backend
- [ ] Installer @supabase/supabase-js
- [ ] Créer `/services/supabase.ts`
- [ ] Implémenter tous les appels API dans `/services/api.ts`
  - [ ] articlesApi.getAll
  - [ ] articlesApi.getById
  - [ ] articlesApi.create
  - [ ] articlesApi.update
  - [ ] articlesApi.delete
  - [ ] commentsApi.getByArticle
  - [ ] commentsApi.create
  - [ ] commentsApi.delete
  - [ ] usersApi.getProfile
  - [ ] usersApi.updateProfile
  - [ ] notificationsApi.getByUser
  - [ ] notificationsApi.markAsRead
  - [ ] uploadApi.uploadImage

### Authentification
- [ ] Intégrer Supabase Auth dans AuthContext.tsx
- [ ] Implémenter login avec email/password
- [ ] Implémenter signup
- [ ] Implémenter logout
- [ ] Gérer la session utilisateur
- [ ] Ajouter la récupération de mot de passe
- [ ] (Optionnel) Ajouter OAuth (Google, Facebook)

### Upload d'Images
- [ ] Créer le bucket 'article-images' dans Supabase Storage
- [ ] Configurer les policies du storage
- [ ] Implémenter l'upload dans CreerAnnoncePage
- [ ] Ajouter la compression/resize des images
- [ ] Gérer les erreurs d'upload
- [ ] Ajouter un preview des images avant upload

## 🟡 Moyenne Priorité (Fonctionnalités)

### Messagerie
- [ ] Implémenter le système de messagerie en temps réel
- [ ] Ajouter les notifications de nouveaux messages
- [ ] Marquer les messages comme lus
- [ ] Ajouter la pagination des conversations

### Notifications
- [ ] Implémenter le système de notifications
- [ ] Notifications pour les nouveaux commentaires
- [ ] Notifications pour les nouveaux messages
- [ ] Marquer comme lu/non lu
- [ ] Badge avec le nombre de notifications non lues

### Panel Admin
- [ ] Implémenter la gestion des utilisateurs
- [ ] Implémenter la modération des annonces
- [ ] Ajouter des statistiques (nombre d'articles, utilisateurs, etc.)
- [ ] Système de bannissement d'utilisateurs
- [ ] Logs d'activité

### Page Mes Annonces
- [ ] Connecter avec le backend
- [ ] Implémenter la modification d'annonce
- [ ] Implémenter la suppression d'annonce
- [ ] Changer le statut (disponible/vendu/réservé)
- [ ] Statistiques par annonce (vues, commentaires)

### Recherche
- [ ] Implémenter la recherche full-text
- [ ] Ajouter des filtres avancés
  - [ ] Fourchette de prix
  - [ ] État/condition
  - [ ] Localisation avec rayon
  - [ ] Date de publication
- [ ] Ajouter le tri (récent, prix, popularité)
- [ ] Sauvegarder les recherches

## 🟢 Basse Priorité (Améliorations)

### Features Additionnelles
- [ ] Système de favoris
- [ ] Historique de navigation
- [ ] Partage sur les réseaux sociaux
- [ ] Signalement d'annonces inappropriées
- [ ] Système de rating/avis pour les vendeurs
- [ ] Sauvegarde de brouillons d'annonces

### UX/UI
- [ ] Ajouter des animations de transition
- [ ] Améliorer les états de loading
- [ ] Ajouter des skeleton loaders
- [ ] Améliorer la gestion d'erreurs
- [ ] Ajouter des toasts de confirmation
- [ ] Mode sombre complet
- [ ] Accessibilité (ARIA labels, keyboard navigation)

### Performance
- [ ] Implémenter la pagination infinie
- [ ] Optimiser le chargement des images (lazy loading)
- [ ] Mise en cache des requêtes
- [ ] Optimisation SEO
- [ ] PWA (Progressive Web App)
- [ ] Service Worker pour le mode offline

### Chatbot
- [ ] Améliorer les réponses du chatbot
- [ ] Ajouter plus de questions/réponses
- [ ] Intégrer une vraie IA (OpenAI, Anthropic)
- [ ] Historique des conversations

### Testing
- [ ] Ajouter des tests unitaires (Jest)
- [ ] Ajouter des tests d'intégration
- [ ] Ajouter des tests E2E (Cypress/Playwright)
- [ ] Tests de performance
- [ ] Tests d'accessibilité

### Documentation
- [ ] Documenter tous les composants
- [ ] Ajouter des exemples d'utilisation
- [ ] Guide de contribution
- [ ] Documentation API
- [ ] Guide de déploiement

### Déploiement
- [ ] Configurer CI/CD
- [ ] Déployer sur Vercel/Netlify
- [ ] Configurer les domaines
- [ ] Monitoring et analytics
- [ ] Gestion des logs
- [ ] Backups automatiques

## 📝 Bugs Connus

_Aucun bug connu pour le moment_

## 💡 Idées Futures

- [ ] Application mobile (React Native)
- [ ] Système de paiement intégré
- [ ] Chat en temps réel
- [ ] Géolocalisation sur carte
- [ ] Recommandations personnalisées (ML)
- [ ] Badges et gamification
- [ ] Programme de parrainage
- [ ] Multi-langues (Arabe, Français, Anglais)
- [ ] Export PDF des annonces
- [ ] Calendrier de disponibilité pour les échanges

## ✅ Complété

- [x] Structure du projet
- [x] Navigation et routing
- [x] Pages principales (Home, Détails, Créer annonce)
- [x] Système d'authentification (frontend only)
- [x] Composants UI de base
- [x] Mock data
- [x] Types TypeScript
- [x] Services API (structure)
- [x] Hooks personnalisés
- [x] Constantes et utilitaires
- [x] Configuration d'environnement
- [x] Documentation (README, MIGRATION_GUIDE)
- [x] Adaptation pour la Tunisie (devise DT, villes)
