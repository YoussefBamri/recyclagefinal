# 🔧 Résolution rapide : Erreur d'authentification Gmail

## ❌ Erreur rencontrée
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

## ✅ Solution rapide (3 étapes)

### Étape 1 : Créer un mot de passe d'application Gmail

1. **Activez la validation en deux étapes** (si pas déjà fait) :
   - https://myaccount.google.com/security
   - Activez "Validation en deux étapes"

2. **Créez un mot de passe d'application** :
   - https://myaccount.google.com/apppasswords
   - Sélectionnez "Autre (nom personnalisé)"
   - Entrez "Recycle App"
   - Cliquez sur "Générer"
   - **COPIEZ le mot de passe** (16 caractères, format : `abcd efgh ijkl mnop`)

### Étape 2 : Créer le fichier `.env`

Créez un fichier `.env` dans le dossier `backend/recyc/` avec ce contenu :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
FRONTEND_URL=http://localhost:3000
```

**Remplacez :**
- `votre-email@gmail.com` par votre email Gmail
- `abcd efgh ijkl mnop` par le mot de passe d'application que vous venez de créer

### Étape 3 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez-le
npm run start:dev
```

## 🧪 Tester

1. Inscrivez-vous avec un nouvel email
2. Vérifiez votre boîte email (et le dossier spam)
3. Cliquez sur le lien de vérification

## 💡 Alternative : Mode développement (sans email)

Si vous voulez tester sans configurer Gmail, ajoutez dans votre `.env` :

```env
SKIP_EMAIL=true
FRONTEND_URL=http://localhost:3000
```

Le lien de vérification sera affiché dans les logs du serveur, vous pourrez le copier-coller directement.

## ❓ Problème persistant ?

1. Vérifiez que le fichier `.env` est bien dans `backend/recyc/` (pas ailleurs)
2. Vérifiez qu'il n'y a pas d'espaces avant/après les `=` dans le `.env`
3. Vérifiez que vous utilisez bien un **mot de passe d'application** (16 caractères), pas votre mot de passe Gmail normal
4. Redémarrez complètement le serveur

Pour plus de détails, voir `EMAIL_SETUP.md`

