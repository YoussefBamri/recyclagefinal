import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useAuth } from './AuthContext';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Mail, Lock, User, Phone, Shield, UserCheck, AlertCircle, X } from 'lucide-react';
import { registerUser, loginUser } from '../api/userApi';

export default function ConnexionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [connectionType, setConnectionType] = useState<'user' | 'admin'>('user');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  const handleLoginChange = (field: string, value: string | boolean) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterChange = (field: string, value: string | boolean) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  // === Connexion utilisateur / admin ===
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!loginData.email || !loginData.password) {
      setLoginError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setLoadingLogin(true);
    try {
      const res = await loginUser({ email: loginData.email, password: loginData.password });
      const user = res?.user;
      if (!user) {
        setLoginError(res?.message || 'Réponse inattendue du serveur');
        setLoadingLogin(false);
        return;
      }

      // Vérifier que le rôle correspond au type de connexion sélectionné
      const userRole = user.role?.toLowerCase() || 'user';
      const expectedRole = connectionType === 'admin' ? 'admin' : 'user';
      
      if (userRole !== expectedRole) {
        if (connectionType === 'admin') {
          setLoginError('Accès refusé : Vous devez vous connecter via la zone Utilisateur. Ce compte n\'est pas un compte administrateur.');
        } else {
          setLoginError('Accès refusé : Vous devez vous connecter via la zone Administrateur. Ce compte est un compte administrateur.');
        }
        setLoadingLogin(false);
        return;
      }

      login(user);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Erreur connexion', err);
      // Extraire le message d'erreur de manière plus précise
      let errorMessage = 'Erreur lors de la connexion';
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.data?.error) {
        // NestJS peut retourner l'erreur dans err.data.error
        errorMessage = typeof err.data.error === 'string' ? err.data.error : err.data.error?.message || errorMessage;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setLoginError(errorMessage);
    } finally {
      setLoadingLogin(false);
    }
  };

  // === Inscription utilisateur ===
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);
    
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!registerData.acceptTerms) {
      setRegisterError("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    setLoadingRegister(true);
    try {
      const name = `${registerData.firstName} ${registerData.lastName}`.trim();
      const dto = {
        name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        role: 'USER',
      };

      const res = await registerUser(dto);
      // Ne pas connecter automatiquement car le compte n'est pas encore vérifié
      // Afficher un message de succès avec instructions
      setRegisterSuccess(res?.message || 'Compte créé avec succès ! Veuillez vérifier votre email pour activer votre compte.');
      
      // Réinitialiser le formulaire
      setRegisterData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
      });
    } catch (err: any) {
      console.error('Erreur inscription', err);
      // Extraire le message d'erreur de manière plus précise
      let errorMessage = "Erreur lors de l'inscription";
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.data?.error) {
        // NestJS peut retourner l'erreur dans err.data.error
        errorMessage = typeof err.data.error === 'string' ? err.data.error : err.data.error?.message || errorMessage;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setRegisterError(errorMessage);
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-md mx-auto px-6 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Connexion à Recycle</CardTitle>
            <CardDescription>
              {from === '/messagerie'
                ? 'Connectez-vous pour accéder à votre messagerie'
                : 'Connectez-vous ou créez un compte pour accéder à toutes les fonctionnalités'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v: string) => setActiveTab(v as 'login' | 'register')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Se connecter</TabsTrigger>
                <TabsTrigger value="register">S'inscrire</TabsTrigger>
              </TabsList>

              {/* === LOGIN === */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-3">
                  <Label>Type de connexion</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setConnectionType('user');
                        setLoginError(null);
                      }}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        connectionType === 'user'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <UserCheck className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">Utilisateur</div>
                      <div className="text-sm text-gray-500">Publier des annonces</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setConnectionType('admin');
                        setLoginError(null);
                      }}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        connectionType === 'admin'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Shield className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">Administrateur</div>
                      <div className="text-sm text-gray-500">Gérer la plateforme</div>
                    </button>
                  </div>
                </div>

                {loginError && (
                  <Alert variant="destructive" className="relative">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur de connexion</AlertTitle>
                    <AlertDescription className="pr-8">{loginError}</AlertDescription>
                    <button
                      onClick={() => setLoginError(null)}
                      className="absolute top-3 right-3 text-destructive hover:text-destructive/80"
                      aria-label="Fermer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Adresse email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={
                          connectionType === 'admin'
                            ? 'entrer votre email admin'
                            : 'entrer votre email'
                        }
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => handleLoginChange('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder={
                          connectionType === 'admin'
                            ? 'entrer votre mot de passe admin'
                            : 'entrer votre mot de passe'
                        }
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => handleLoginChange('password', e.target.value)}
                      />
                    </div>
                  </div>


                  <Button
                    type="submit"
                    disabled={loadingLogin}
                    className={`w-full ${
                      connectionType === 'admin' ? 'bg-red-600 hover:bg-red-700' : ''
                    }`}
                  >
                    {loadingLogin
                      ? 'Connexion...'
                      : connectionType === 'admin'
                      ? 'Se connecter en tant qu’Admin'
                      : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>

              {/* === REGISTER === */}
              <TabsContent value="register" className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Création de compte utilisateur</h4>
                  <p className="text-sm text-blue-700">
                    Créez votre compte pour publier des annonces, contacter les vendeurs et gérer
                    vos articles.
                  </p>
                </div>

                {registerError && (
                  <Alert variant="destructive" className="relative">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur d'inscription</AlertTitle>
                    <AlertDescription className="pr-8">{registerError}</AlertDescription>
                    <button
                      onClick={() => setRegisterError(null)}
                      className="absolute top-3 right-3 text-destructive hover:text-destructive/80"
                      aria-label="Fermer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Alert>
                )}

                {registerSuccess && (
                  <Alert className="relative border-green-200 bg-green-50">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Inscription réussie !</AlertTitle>
                    <AlertDescription className="pr-8 text-green-700 space-y-2">
                      <p>{registerSuccess}</p>
                      <p className="text-sm font-medium mt-2">📧 Prochaines étapes :</p>
                      <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                        <li>Vérifiez votre boîte email (et le dossier spam si nécessaire)</li>
                        <li>Cliquez sur le lien de vérification dans l'email</li>
                        <li>Revenez ici pour vous connecter</li>
                      </ul>
                    </AlertDescription>
                    <button
                      onClick={() => setRegisterSuccess(null)}
                      className="absolute top-3 right-3 text-green-600 hover:text-green-800"
                      aria-label="Fermer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Alert>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="first-name"
                          placeholder="entrer votre prénom"
                          className="pl-10"
                          value={registerData.firstName}
                          onChange={(e) => handleRegisterChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last-name">Nom</Label>
                      <Input
                        id="last-name"
                        placeholder="entrer votre nom"
                        value={registerData.lastName}
                        onChange={(e) => handleRegisterChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Adresse email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="entrer votre email"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => handleRegisterChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="entrer votre téléphone"
                        className="pl-10"
                        required
                        value={registerData.phone}
                        onChange={(e) => handleRegisterChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="entrer votre mot de passe"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => handleRegisterChange('password', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="entrer votre mot de passe"
                        className="pl-10"
                        value={registerData.confirmPassword}
                        onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  

                  <Button type="submit" disabled={loadingRegister} className="w-full">
                    {loadingRegister ? 'Création...' : 'Créer mon compte'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
