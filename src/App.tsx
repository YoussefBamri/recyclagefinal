import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ChallengesProvider } from './contexts/ChallengesContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChatBot } from './components/ChatBot';

import HomePage from './components/HomePage';
import CreerAnnoncePage from './components/CreerAnnoncePage';
import ConnexionPage from './components/ConnexionPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import MessageriePage from './components/MessageriePage';
import ArticleDetailsPage from './components/ArticleDetailsPage';
import AdminPage from './components/AdminPage';
import GoogleTranslate from './components/GoogleTranslate';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ChallengesProvider>
          <Router>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
              <Routes>

                {/* Home */}
                <Route path="/" element={<HomePage />} />

                <Route
                  path="/creer-annonce"
                  element={
                    <ProtectedRoute>
                      <CreerAnnoncePage />
                    </ProtectedRoute>
                  }
                />

                <Route path="/revendre" element={<Navigate to="/creer-annonce?type=revendre" replace />} />
                <Route path="/echanger" element={<Navigate to="/creer-annonce?type=echanger" replace />} />
                <Route path="/donner" element={<Navigate to="/creer-annonce?type=donner" replace />} />
                <Route path="/recycler" element={<Navigate to="/creer-annonce?type=recycler" replace />} />

                <Route path="/connexion" element={<ConnexionPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* Messagerie → protégée */}
                <Route
                  path="/messagerie"
                  element={
                    <ProtectedRoute>
                      <MessageriePage />
                    </ProtectedRoute>
                  }
                />

              

                {/* Admin → nécessite admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                {/* Article */}
                <Route path="/article/:id" element={<ArticleDetailsPage />} />

                {/* Correction bug Vite preview_page.html */}
                <Route path="/preview_page.html" element={<Navigate to="/" replace />} />

                {/* 404 → redirect home */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>

              {/* Chatbot + Traduction */}
              <ChatBot />
              <GoogleTranslate />
            </div>

          </Router>
        </ChallengesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
