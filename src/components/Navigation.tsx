import { Link, useLocation } from 'react-router-dom';
import { Recycle, LogOut, Package, Settings, Languages, MessageSquare } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState } from 'react';
import { AdminMessagerieDialog } from './AdminMessagerieDialog';

export function Navigation() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessagerieOpen, setIsMessagerieOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@recycle.com';

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="gradient-primary p-2.5 rounded-xl shadow-md group-hover:shadow-colored transition-all duration-300 group-hover:scale-110">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Recycle</span>
          </Link>
          
          <div className="hidden md:flex space-x-2">
            {isAdmin ? (
              // Navigation pour admin : seulement Accueil et Administration
              <>
                <Link 
                  to="/" 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/') 
                      ? 'gradient-primary text-white shadow-md' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {t('nav.home') || 'Accueil'}
                </Link>
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/admin') 
                      ? 'gradient-primary text-white shadow-md' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {t('nav.administration')}
                </Link>
              </>
            ) : (
              // Navigation normale pour les utilisateurs
              <>
                <Link 
                  to="/creer-annonce" 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/creer-annonce') 
                      ? 'gradient-primary text-white shadow-md' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {t('nav.createListing')}
                </Link>
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/mes-annonces" 
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive('/mes-annonces') 
                          ? 'gradient-primary text-white shadow-md' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {t('nav.myListings')}
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => setIsMessagerieOpen(true)}
                      className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-50 text-gray-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Proposer des offres/défis
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
         

          {isAuthenticated ? (
            <>
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src="" alt={user?.firstName} />
                      <AvatarFallback className="gradient-primary text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogTitle className="sr-only">{t('nav.profile')}</DialogTitle>
                  <DialogDescription className="sr-only">
                    {t('nav.profileInfo')}
                  </DialogDescription>
                  <div className="flex flex-col items-center space-y-6 p-6">
                    {/* Avatar large */}
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-xl">
                        <AvatarImage src="" alt={user?.firstName} />
                        <AvatarFallback className="gradient-primary text-white text-3xl">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white"></div>
                    </div>
                    
                    {/* Informations utilisateur */}
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-gray-600 break-all text-sm">
                        {user?.email}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col w-full space-y-3">
                      {isAdmin ? (
                        // Pour admin : seulement le lien Administration
                        <Link 
                          to="/admin" 
                          className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 hover:shadow-md font-medium"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-5 h-5 text-purple-600" />
                          <span className="text-purple-600">{t('nav.administration')}</span>
                        </Link>
                      ) : (
                        // Pour utilisateurs normaux : lien Mes annonces
                        <Link 
                          to="/mes-annonces" 
                          className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-300 hover:shadow-md font-medium"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Package className="w-5 h-5 text-primary" />
                          <span>{t('nav.myListings')}</span>
                        </Link>
                      )}
                      
                      <Button 
                        onClick={handleLogout}
                        variant="destructive" 
                        className="w-full flex items-center justify-center space-x-2 rounded-xl py-6 font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>{t('nav.logout')}</span>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Link 
              to="/connexion" 
              className="gradient-primary text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-colored transition-all duration-300 hover:scale-105 font-medium"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
      
      {/* Dialog de messagerie pour les utilisateurs */}
      {isAuthenticated && !isAdmin && (
        <AdminMessagerieDialog 
          open={isMessagerieOpen} 
          onOpenChange={setIsMessagerieOpen}
        />
      )}
    </nav>
  );
}
