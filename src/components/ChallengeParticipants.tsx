import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { UserContribution } from '../types';

interface ChallengeParticipantsProps {
  contributions: UserContribution[];
  challengeUnit: string;
}

export function ChallengeParticipants({ contributions, challengeUnit }: ChallengeParticipantsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!contributions || contributions.length === 0) {
    return null;
  }

  // Grouper les contributions par utilisateur et sommer les quantités
  const groupedContributions = contributions.reduce((acc, contribution) => {
    const userId = contribution.userId;
    
    if (!acc[userId]) {
      acc[userId] = {
        userId: contribution.userId,
        userName: contribution.userName || 'Utilisateur',
        totalAmount: 0,
        firstParticipation: contribution.timestamp,
        lastParticipation: contribution.timestamp,
        participationCount: 0
      };
    }
    
    // Ajouter la quantité au total
    acc[userId].totalAmount += contribution.amount || 0;
    acc[userId].participationCount += 1;
    
    // Mettre à jour les dates (première et dernière participation)
    const contributionDate = new Date(contribution.timestamp);
    const firstDate = new Date(acc[userId].firstParticipation);
    const lastDate = new Date(acc[userId].lastParticipation);
    
    if (contributionDate < firstDate) {
      acc[userId].firstParticipation = contribution.timestamp;
    }
    if (contributionDate > lastDate) {
      acc[userId].lastParticipation = contribution.timestamp;
    }
    
    return acc;
  }, {} as Record<string, {
    userId: string;
    userName: string;
    totalAmount: number;
    firstParticipation: string;
    lastParticipation: string;
    participationCount: number;
  }>);

  // Convertir en tableau et trier par date de dernière participation (plus récent en premier)
  const groupedList = Object.values(groupedContributions).sort((a, b) => {
    return new Date(b.lastParticipation).getTime() - new Date(a.lastParticipation).getTime();
  });

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-gray-700">
            Participants ({groupedList.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {groupedList.map((grouped) => (
            <div
              key={grouped.userId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {grouped.userName}
                  {grouped.participationCount > 1 && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({grouped.participationCount} participation{grouped.participationCount > 1 ? 's' : ''})
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Dernière participation: {new Date(grouped.lastParticipation).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-primary">
                  {grouped.totalAmount} {challengeUnit}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
