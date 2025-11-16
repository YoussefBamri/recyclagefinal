import React, { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  content: string;
  timestamp: Date;
}

interface CommentsSectionProps {
  articleId: string;
  articleTitle: string;
  articleOwnerId: string;
  onNewComment?: (comment: Comment) => void;
}

export function CommentsSection({ articleId, articleTitle, articleOwnerId, onNewComment }: CommentsSectionProps) {
  const { isAuthenticated, user, addNotification } = useAuth();
  
  // Mock comments based on article ID
  const getCommentsForArticle = (id: string) => {
    const allComments: Record<string, Comment[]> = {
      '1': [ // Grille-pain Moulinex
        {
          id: '1-1',
          author: {
            id: '2',
            firstName: 'Marie',
            lastName: 'Dubois',
            email: 'marie@example.com'
          },
          content: 'Bonjour ! Le grille-pain fonctionne-t-il bien des deux côtés ? Merci !',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: '1-2',
          author: {
            id: '3',
            firstName: 'Pierre',
            lastName: 'Martin',
            email: 'pierre@example.com'
          },
          content: 'Parfait pour ma cuisine d\'étudiant ! Est-ce que je peux passer le récupérer demain ?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        }
      ],
      '2': [ // Canapé vintage
        {
          id: '2-1',
          author: {
            id: '4',
            firstName: 'Lucas',
            lastName: 'Bernard',
            email: 'lucas@example.com'
          },
          content: 'Magnifique canapé ! Contre quoi souhaiteriez-vous l\'échanger ?',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        }
      ],
      '7': [ // Chaise de bureau
        {
          id: '7-1',
          author: {
            id: '8',
            firstName: 'Emma',
            lastName: 'Petit',
            email: 'emma@example.com'
          },
          content: 'Bonjour, les accoudoirs sont-ils réglables également ? Merci !',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        },
        {
          id: '7-2',
          author: {
            id: '9',
            firstName: 'Antoine',
            lastName: 'Roux',
            email: 'antoine@example.com'
          },
          content: 'Parfait pour mon bureau ! Je peux venir la chercher ce weekend si elle est encore dispo.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
        }
      ],
      '8': [ // Jouets en bois
        {
          id: '8-1',
          author: {
            id: '10',
            firstName: 'Lucie',
            lastName: 'Girard',
            email: 'lucie@example.com'
          },
          content: 'C\'est très généreux ! Mes jumeaux de 4 ans seraient ravis. Puis-je venir les récupérer ?',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        },
        {
          id: '8-2',
          author: {
            id: '11',
            firstName: 'Mathieu',
            lastName: 'Blanc',
            email: 'mathieu@example.com'
          },
          content: 'Super initiative ! Si personne n\'est passé, je suis intéressé pour ma fille de 3 ans.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        }
      ],
      '9': [ // Radiateur électrique
        {
          id: '9-1',
          author: {
            id: '12',
            firstName: 'Sophie',
            lastName: 'Moreau',
            email: 'sophie@example.com'
          },
          content: 'Bonjour, est-ce qu\'il chauffe bien une pièce de 15m² ? Mon bureau est un peu froid !',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
        }
      ],
      '10': [ // Plantes vertes
        {
          id: '10-1',
          author: {
            id: '13',
            firstName: 'Clémence',
            lastName: 'Durand',
            email: 'clemence@example.com'
          },
          content: 'Elles sont magnifiques ! J\'adore les plantes mais je débute. Avez-vous des conseils d\'entretien ?',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
          id: '10-2',
          author: {
            id: '14',
            firstName: 'Maxime',
            lastName: 'Laurent',
            email: 'maxime@example.com'
          },
          content: 'Parfait timing ! Je viens d\'emménager et je cherchais justement des plantes. Les pots sont inclus ?',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        }
      ]
    };
    
    return allComments[id] || [];
  };
  
  const [comments, setComments] = useState<Comment[]>(getCommentsForArticle(articleId));
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} jour(s)`;
    return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        author: user,
        content: newComment.trim(),
        timestamp: new Date()
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');

      // Add notification for article owner if commenter is not the owner
      if (user.id !== articleOwnerId) {
        addNotification({
          type: 'comment',
          articleId,
          articleTitle,
          commenterName: `${user.firstName} ${user.lastName}`,
          message: newComment.trim()
        });
      }

      onNewComment?.(comment);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmitComment();
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* Add comment form */}
      {isAuthenticated ? (
        <div className="mb-6">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user?.firstName} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre commentaire..."
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  Ctrl + Entrée pour publier
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? (
                    'Publication...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publier
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">
            Connectez-vous pour laisser un commentaire
          </p>
          <Link to="/connexion">
            <Button size="sm">Se connecter</Button>
          </Link>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucun commentaire pour le moment</p>
            <p className="text-sm">Soyez le premier à commenter !</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 border-b border-gray-100 pb-4 last:border-b-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={comment.author.firstName} />
                <AvatarFallback>
                  {comment.author.firstName[0]}{comment.author.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.author.firstName} {comment.author.lastName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(comment.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}