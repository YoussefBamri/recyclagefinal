# Configuration de l'envoi d'emails

Ce guide explique comment configurer l'envoi d'emails pour la vérification de compte.

## 📧 Configuration Gmail (Recommandé)

### Étape 1 : Créer un mot de passe d'application

1. Allez sur [Google Account](https://myaccount.google.com/)
2. Sélectionnez **Sécurité** dans le menu de gauche
3. Activez la **Validation en deux étapes** si ce n'est pas déjà fait
4. Allez dans **Mots de passe des applications**
5. Sélectionnez **Autre (nom personnalisé)** et entrez "Recycle App"
6. Cliquez sur **Générer**
7. **Copiez le mot de passe généré** (16 caractères) - vous ne pourrez plus le voir après !

### Étape 2 : Configurer les variables d'environnement

Créez un fichier `.env` à la racine du dossier `backend/recyc/` avec le contenu suivant :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
FRONTEND_URL=http://localhost:3000
```

⚠️ **Important** : Utilisez le **mot de passe d'application** (16 caractères), pas votre mot de passe Gmail normal.

## 📧 Configuration avec un autre fournisseur

### Outlook / Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=votre-email@outlook.com
SMTP_PASS=votre-mot-de-passe
```

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=votre-api-key-sendgrid
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=votre-email
SMTP_PASS=votre-mot-de-passe-mailgun
```

## 🧪 Tester la configuration

1. Démarrez le serveur backend : `npm run start:dev`
2. Inscrivez-vous avec un nouvel email
3. Vérifiez votre boîte email (et le dossier spam)
4. Cliquez sur le lien de vérification

## 🚀 Mode développement (sans email)

Si vous voulez tester l'application sans configurer l'email, vous pouvez activer le mode `SKIP_EMAIL` :

```env
SKIP_EMAIL=true
FRONTEND_URL=http://localhost:3000
```

Avec ce mode activé :
- Les emails ne seront **pas envoyés**
- Le lien de vérification sera affiché dans les logs du serveur
- Vous pourrez copier-coller le lien directement dans votre navigateur pour tester

**Exemple de log :**
```
⚠️  Mode SKIP_EMAIL activé - Email non envoyé pour user@example.com
🔗 Lien de vérification : http://localhost:3000/verify-email?token=abc123...
```

## ⚠️ Dépannage

### Erreur "Invalid login" ou "535-5.7.8 Username and Password not accepted"

**Causes possibles :**
1. ❌ Vous utilisez votre mot de passe Gmail normal au lieu d'un mot de passe d'application
2. ❌ La validation en deux étapes n'est pas activée
3. ❌ Le fichier `.env` n'existe pas ou n'est pas au bon endroit
4. ❌ Les variables d'environnement ne sont pas chargées (redémarrez le serveur)

**Solutions :**

1. **Créer un mot de passe d'application Gmail :**
   - Allez sur https://myaccount.google.com/apppasswords
   - Activez la validation en deux étapes si nécessaire
   - Créez un nouveau mot de passe d'application (16 caractères)
   - Copiez-le dans votre `.env` comme `SMTP_PASS`

2. **Vérifier que le fichier `.env` existe :**
   ```bash
   # Le fichier doit être ici :
   backend/recyc/.env
   ```

3. **Vérifier le contenu du `.env` :**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=votre-email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop  # ← 16 caractères, espaces OK
   FRONTEND_URL=http://localhost:3000
   ```

4. **Redémarrer le serveur** après avoir créé/modifié le `.env`

### Erreur "Connection timeout"

- Vérifiez votre connexion internet
- Vérifiez que le port 587 n'est pas bloqué par votre firewall
- Essayez le port 465 avec `secure: true` dans `app.module.ts`

### Les emails arrivent dans le spam

- C'est normal pour les emails de test
- En production, configurez SPF, DKIM et DMARC pour votre domaine

### Le serveur ne détecte pas la configuration

- Vérifiez que `ConfigModule.forRoot()` est bien importé dans `app.module.ts` ✅ (déjà fait)
- Assurez-vous que le fichier `.env` est à la racine de `backend/recyc/`
- Redémarrez complètement le serveur (arrêtez et relancez)

## 📦 Installation des dépendances

Si vous n'avez pas encore installé les dépendances pour l'envoi d'emails :

```bash
cd backend/recyc
npm install @nestjs-modules/mailer nodemailer
```

