import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmail } from '../api/userApi';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Token de vérification manquant. Veuillez utiliser le lien reçu par email.');
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Compte activé avec succès !');
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/connexion', { replace: true });
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        let errorMessage = 'Erreur lors de la vérification de l\'email';
        if (err?.message) {
          errorMessage = err.message;
        } else if (err?.data?.message) {
          errorMessage = err.data.message;
        } else if (err?.data?.error) {
          errorMessage = typeof err.data.error === 'string' ? err.data.error : err.data.error?.message || errorMessage;
        }
        setError(errorMessage);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-md mx-auto px-6 py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === 'loading' && (
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="w-16 h-16 text-green-500" />
              )}
              {status === 'error' && (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {status === 'loading' && 'Vérification en cours...'}
              {status === 'success' && 'Email vérifié !'}
              {status === 'error' && 'Erreur de vérification'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Veuillez patienter pendant que nous vérifions votre compte.'}
              {status === 'success' && 'Votre compte a été activé avec succès.'}
              {status === 'error' && 'Une erreur est survenue lors de la vérification.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {status === 'loading' && (
              <div className="text-center py-4">
                <p className="text-gray-600">Vérification de votre compte en cours...</p>
              </div>
            )}

            {status === 'success' && (
              <>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Succès !</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {message}
                  </AlertDescription>
                </Alert>
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Vous allez être redirigé vers la page de connexion dans quelques secondes...
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/connexion">Se connecter maintenant</Link>
                  </Button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-1">Besoin d'aide ?</h4>
                        <p className="text-sm text-blue-700">
                          Si vous n'avez pas reçu l'email de vérification, vérifiez votre dossier spam ou contactez le support.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" asChild className="flex-1">
                      <Link to="/">Retour à l'accueil</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/connexion">Se connecter</Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

