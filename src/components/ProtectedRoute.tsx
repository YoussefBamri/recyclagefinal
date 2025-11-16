import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion en sauvegardant la page de destination
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}