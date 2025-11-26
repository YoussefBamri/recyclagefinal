import { useState } from 'react';
import type React from 'react';
import { Challenge } from '../types';
import { useAuth } from './AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Target, Award, Calendar, TrendingUp, Users, Trophy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChallengesSectionProps {
  challenges: Challenge[];
  onContribute?: (challengeId: string, amount: number) => void;
}

export function ChallengesSection({ challenges, onContribute }: ChallengesSectionProps) {
  const { user } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');

  // Format date FR simple
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (current: number, target: number) =>
    Math.min((current / target) * 100, 100);

  const handleParticipate = (challenge: Challenge) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour participer.");
      return;
    }
    setSelectedChallenge(challenge);
    setContributionAmount('');
  };

  const handleSubmitContribution = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedChallenge || !contributionAmount) return;

    const amount = parseFloat(contributionAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Veuillez entrer un montant valide.");
      return;
    }

    const remaining =
      selectedChallenge.targetAmount - selectedChallenge.currentAmount;

    if (amount > remaining) {
      toast.error(
        `La contribution ne peut pas dépasser ${remaining.toFixed(1)} ${selectedChallenge.unit}.`
      );
      return;
    }

    try {
      if (onContribute) {
        await onContribute(selectedChallenge.id, amount);
      }

      toast.success("Contribution enregistrée !", {
        description: "Merci pour votre participation !",
      });

      setSelectedChallenge(null);
      setContributionAmount('');
    } catch (error) {
      console.error("Contribution error:", error);
    }
  };

  const getStatusBadge = (status: Challenge['status']) => {
    const config = {
      active: { label: "En cours", className: "bg-green-100 text-green-700 border-green-200" },
      completed: { label: "Complété", className: "bg-blue-100 text-blue-700 border-blue-200" },
      expired: { label: "Expiré", className: "bg-gray-100 text-gray-700 border-gray-200" }
    }[status];

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const totalReward = challenges.reduce((sum, c) => sum + c.reward, 0);
  const totalParticipants = new Set(
    challenges.flatMap(c => c.contributions.map(contrib => contrib.userId))
  ).size;

  const totalProgress =
    challenges.reduce((sum, c) => sum + (c.currentAmount / c.targetAmount) * 100, 0) /
    Math.max(challenges.length, 1);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10">

          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-white" />
              <h2 className="text-white">Défis Écologiques</h2>
            </div>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              Participez aux défis sponsorisés pour aider des causes humanitaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
              <Award className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{totalReward.toLocaleString()} DT</div>
              <div className="text-sm text-white/80 mt-1">Récompenses Totales</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{totalParticipants}</div>
              <div className="text-sm text-white/80 mt-1">Contributeurs</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{totalProgress.toFixed(0)}%</div>
              <div className="text-sm text-white/80 mt-1">Progression Moyenne</div>
            </div>
          </div>

        </div>
      </div>

      {/* CHALLENGES LIST */}
      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl mb-2 text-gray-600">Aucun défi actif pour le moment</h3>
          <p className="text-muted-foreground">
            Revenez bientôt pour participer aux prochains défis écologiques !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const progress = getProgressPercentage(challenge.currentAmount, challenge.targetAmount);
            const remaining = challenge.targetAmount - challenge.currentAmount;

            return (
              <Card key={challenge.id} className="overflow-hidden hover-lift border-2 transition-all duration-300 hover:border-primary/50">

                <div className="p-6 pb-4 gradient-primary text-white">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="line-clamp-2">{challenge.title}</h3>
                    {getStatusBadge(challenge.status)}
                  </div>
                  <p className="text-white/90 text-sm line-clamp-2">
                    {challenge.description}
                  </p>
                </div>

                <div className="p-6 space-y-4">

                  {/* Sponsor */}
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Sponsorisé par:</span>
                    <span  className="notranslate" >{challenge.sponsor}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-primary" />
                        Progression
                      </span>
                      <span className="text-primary">{progress.toFixed(0)}%</span>
                    </div>

                    <Progress value={progress} className="h-3" />

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Collecté: <strong className="text-foreground">{challenge.currentAmount} {challenge.unit}</strong>
                      </span>
                      <span>
                        Objectif: <strong className="text-foreground">{challenge.targetAmount} {challenge.unit}</strong>
                      </span>
                    </div>

                    {challenge.status === 'active' && remaining > 0 && (
                      <p className="text-xs text-center text-muted-foreground">
                        Restant: <strong className="text-orange-600">{remaining.toFixed(1)} {challenge.unit}</strong>
                      </p>
                    )}
                  </div>

                  {/* Reward & Cause */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Récompense</p>
                      <p className="text-primary">{challenge.reward} DT</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Cause</p>
                      <p className="text-sm line-clamp-1">{challenge.cause}</p>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(challenge.deadline)}
                  </div>

                  {/* Contributors */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Contributeurs:</span>
                    <span>{challenge.contributions.length}</span>
                  </div>

                  {/* Completed message */}
                  {challenge.status === 'completed' && (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Trophy className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-green-900">
                          Défi réussi ! Le montant de <strong>{challenge.reward} DT</strong> sera reversé à <strong>{challenge.cause}</strong> !
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Button */}
                  {challenge.status === 'active' && (
                    challenge.currentAmount >= challenge.targetAmount ? (
                      <Button disabled className="w-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-70">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Objectif Atteint !
                      </Button>
                    ) : (
                      <Button onClick={() => handleParticipate(challenge)} className="w-full gradient-primary">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Participer
                      </Button>
                    )
                  )}

                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* POPUP */}
      <Dialog open={!!selectedChallenge} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Votre contribution</DialogTitle>
            <DialogDescription>
              {selectedChallenge?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedChallenge && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Objectif:</span>
                  <span>{selectedChallenge.targetAmount} {selectedChallenge.unit}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Collecté:</span>
                  <span className="text-primary">{selectedChallenge.currentAmount} {selectedChallenge.unit}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Restant:</span>
                  <span className="text-orange-600">
                    {(selectedChallenge.targetAmount - selectedChallenge.currentAmount).toFixed(1)} {selectedChallenge.unit}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Quantité ({selectedChallenge?.unit})</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSubmitContribution}
              disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
              className="gradient-primary"
            >
              Envoyer ma contribution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
