import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Challenge } from '../types';
import { getAllDefis, createDefi, deleteDefi, updateDefi } from '../api/defiApi';
import { createParticipation } from '../api/participationApi';
import { toast } from 'sonner';

interface ChallengesContextType {
  challenges: Challenge[];
  loading: boolean;
  addChallenge: (challenge: Challenge) => Promise<void>;
  updateChallenge: (id: string, updates: Partial<Challenge>) => Promise<void>;
  deleteChallenge: (id: string) => Promise<void>;
  contributeToChallenge: (challengeId: string, amount: number, userId: string, userName: string) => Promise<void>;
  completeChallenge: (id: string) => Promise<void>;
  refreshChallenges: () => Promise<void>;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

// Fonction pour mapper les données du backend vers le type Challenge
const mapDefiToChallenge = (defi: any): Challenge => {
  // Normaliser le statut - s'assurer qu'il est 'active', 'completed' ou 'expired'
  let status = defi.statut || defi.status || 'active';
  
  if (status && typeof status === 'object') {
    if (status.value) {
      status = status.value;
    } else if (status.toString) {
      status = status.toString();
    }
  }
  
  // Convertir en string et normaliser
  let statusStr = String(status).toLowerCase();
  
  // Nettoyer la chaîne (enlever les espaces, underscores, etc.)
  statusStr = statusStr.replace(/_/g, ' ').trim();
  
  // Mapper les variantes possibles du backend vers le format frontend
  if (statusStr === 'en cours' || statusStr === 'en_cours' || statusStr === 'actif' || statusStr === 'en cours') {
    status = 'active';
  } else if (statusStr === 'complété' || statusStr === 'complete' || statusStr === 'termine' || statusStr === 'completed' || statusStr === 'complété') {
    status = 'completed';
  } else if (statusStr === 'expiré' || statusStr === 'expire' || statusStr === 'expired') {
    status = 'expired';
  } else {
    // Si le montant actuel >= objectif, considérer comme complété même si le statut n'est pas correct
    const montantActuel = Number(defi.montantActuel || defi.currentAmount || 0);
    const objectif = Number(defi.objectif || defi.targetAmount || 0);
    if (objectif > 0 && montantActuel >= objectif) {
      status = 'completed';
      console.log('⚠️ Statut corrigé automatiquement: défi avec objectif atteint mais statut incorrect');
    } else {
      status = 'active';
    }
  }
  
  // Normaliser les contributions
  let contributions = defi.contributions || defi.contributions || [];
  if (defi.participations && Array.isArray(defi.participations)) {
    // Si le backend retourne des participations, les convertir en contributions
    contributions = defi.participations.map((part: any) => {
      // Récupérer le nom de l'utilisateur depuis la relation user
      const userName = part.user?.name || 
                       part.user?.nom || 
                       (part.user?.firstName && part.user?.lastName ? `${part.user.firstName} ${part.user.lastName}` : null) ||
                       part.userName || 
                       'Utilisateur';
      
      return {
        userId: String(part.user?.id || part.userId || part.utilisateurId || ''),
        userName: userName,
        amount: part.quantite || part.amount || 0,
        timestamp: part.dateParticipation || part.timestamp || part.createdAt || new Date().toISOString()
      };
    });
  }
  
  const mapped = {
    id: String(defi.id || defi._id || defi.ID),
    title: defi.titre || defi.title || '',
    description: defi.description || defi.desc || '',
    sponsor: defi.sponsor || defi.sponsorName || '',
    targetAmount: Number(defi.objectif || defi.targetAmount || defi.target || 0),
    currentAmount: Number(defi.montantActuel || defi.currentAmount || defi.montant || 0),
    unit: defi.unite || defi.unit || '',
    reward: Number(defi.recompense || defi.reward || 0),
    cause: defi.causeHumanitaire || defi.cause || '',
    deadline: defi.dateLimite || defi.deadline || defi.dateFin || '',
    status: status as 'active' | 'completed' | 'expired',
    createdAt: defi.dateCreation || defi.createdAt || defi.created_at || new Date().toISOString(),
    contributions: contributions,
    completedAt: defi.dateCompletion || defi.completedAt || defi.date_completion
  };
  
  console.log('🔄 Mapping défi:', { 
    id: mapped.id, 
    title: mapped.title, 
    statutOriginal: defi.statut, 
    statutMappé: mapped.status,
    montantActuel: mapped.currentAmount,
    objectif: mapped.targetAmount,
    estComplet: mapped.currentAmount >= mapped.targetAmount
  });
  return mapped;
};

export function ChallengesProvider({ children }: { children: ReactNode }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les défis depuis l'API
  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await getAllDefis();
      console.log('📦 Données reçues du backend:', data);
      
      // Si c'est un tableau, mapper chaque élément, sinon traiter comme un seul élément
      let challengesArray: any[] = [];
      if (Array.isArray(data)) {
        challengesArray = data;
      } else if (data && typeof data === 'object') {
        // Si c'est un objet avec une propriété qui contient le tableau
        challengesArray = data.defis || data.data || data.challenges || [];
      }
      
      console.log('📋 Tableau de défis extrait:', challengesArray);
      const mappedChallenges = challengesArray.map(mapDefiToChallenge);
      console.log('✅ Défis mappés:', mappedChallenges);
      setChallenges(mappedChallenges);
    } catch (error: any) {
      console.error('❌ Erreur lors du chargement des défis:', error);
      toast.error('Erreur lors du chargement des défis');
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const addChallenge = async (challenge: Challenge) => {
    try {
      // Préparer les données pour l'API (format backend)
      const defiData = {
        titre: challenge.title,
        description: challenge.description,
        sponsor: challenge.sponsor,
        objectif: challenge.targetAmount,
        unite: challenge.unit,
        recompense: challenge.reward,
        causeHumanitaire: challenge.cause, // ✅ Utiliser causeHumanitaire pour correspondre au backend
        dateLimite: challenge.deadline,
        statut: challenge.status || 'active',
        montantActuel: challenge.currentAmount || 0,
        contributions: challenge.contributions || []
      };

      await createDefi(defiData);
      await loadChallenges(); // Recharger les défis après création
      toast.success('Défi créé avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur lors de la création du défi:', error);
      toast.error('Erreur lors de la création du défi');
      throw error;
    }
  };

  const updateChallenge = async (id: string, updates: Partial<Challenge>) => {
    try {
      // Préparer les données pour l'API
      const updateData: any = {};
      if (updates.title) updateData.titre = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.sponsor) updateData.sponsor = updates.sponsor;
      if (updates.targetAmount !== undefined) updateData.objectif = updates.targetAmount;
      if (updates.unit) updateData.unite = updates.unit;
      if (updates.reward !== undefined) updateData.recompense = updates.reward;
      if (updates.cause) updateData.causeHumanitaire = updates.cause; // ✅ Utiliser causeHumanitaire pour correspondre au backend
      if (updates.deadline) updateData.dateLimite = updates.deadline;
      // Mapper le statut frontend vers le format backend
      if (updates.status) {
        if (updates.status === 'completed') {
          updateData.statut = 'complete'; // Backend utilise 'complete' (sans 'd')
        } else if (updates.status === 'active') {
          updateData.statut = 'en_cours'; // Backend utilise 'en_cours'
        } else {
          updateData.statut = updates.status;
        }
      }
      if (updates.currentAmount !== undefined) updateData.montantActuel = updates.currentAmount;
      if (updates.contributions) updateData.contributions = updates.contributions;
      if (updates.completedAt) updateData.dateCompletion = updates.completedAt;

      await updateDefi(id, updateData);
      await loadChallenges(); // Recharger les défis après mise à jour
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour du défi:', error);
      toast.error('Erreur lors de la mise à jour du défi');
      throw error;
    }
  };

  const deleteChallenge = async (id: string) => {
    try {
      await deleteDefi(id);
      await loadChallenges(); // Recharger les défis après suppression
      toast.success('Défi supprimé avec succès');
    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression du défi:', error);
      toast.error('Erreur lors de la suppression du défi');
      throw error;
    }
  };

  const contributeToChallenge = async (challengeId: string, amount: number, userId: string, userName: string) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) {
        throw new Error('Défi non trouvé');
      }

      // Convertir userId en nombre (si c'est une string)
      const userIdNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      const defiIdNumber = typeof challengeId === 'string' ? parseInt(challengeId, 10) : parseInt(challengeId, 10);

      if (isNaN(userIdNumber) || isNaN(defiIdNumber)) {
        throw new Error('ID utilisateur ou défi invalide');
      }

      // Créer la participation dans le backend (qui mettra aussi à jour le montantActuel du défi)
      const participation = await createParticipation({
        userId: userIdNumber,
        defiId: defiIdNumber,
        quantite: amount,
      });

      // Mapper la participation en contribution pour l'affichage
      const newContribution = {
        userId: String(participation.user?.id || userId),
        userName: participation.user?.name || 
                  (participation.user?.firstName && participation.user?.lastName ? `${participation.user.firstName} ${participation.user.lastName}` : null) ||
                  participation.user?.nom || 
                  userName,
        amount: participation.quantite,
        timestamp: participation.dateParticipation || new Date().toISOString()
      };

      // Mise à jour optimiste : mettre à jour l'état local immédiatement
      const updatedContributions = [...(challenge.contributions || []), newContribution];
      const newCurrentAmount = challenge.currentAmount + amount;
      
      // Vérifier si l'objectif est atteint pour mettre à jour le statut
      const isCompleted = newCurrentAmount >= challenge.targetAmount;

      setChallenges(prev => prev.map(c => 
        c.id === challengeId 
          ? { 
              ...c, 
              currentAmount: newCurrentAmount, 
              contributions: updatedContributions,
              status: isCompleted ? 'completed' : c.status,
              completedAt: isCompleted ? new Date().toISOString() : c.completedAt
            }
          : c
      ));

      // Recharger les défis depuis le backend pour avoir le statut à jour
      await loadChallenges();

      toast.success('Contribution enregistrée avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur lors de la contribution:', error);
      
      // Message d'erreur personnalisé selon le type d'erreur
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Erreur lors de l\'enregistrement de votre contribution');
      }
      
      throw error;
    }
  };

  const completeChallenge = async (id: string) => {
    try {
      await updateChallenge(id, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      toast.success('Défi marqué comme complété !');
    } catch (error: any) {
      console.error('❌ Erreur lors de la complétion du défi:', error);
      toast.error('Erreur lors de la complétion du défi');
      throw error;
    }
  };

  return (
    <ChallengesContext.Provider value={{
      challenges,
      loading,
      addChallenge,
      updateChallenge,
      deleteChallenge,
      contributeToChallenge,
      completeChallenge,
      refreshChallenges: loadChallenges
    }}>
      {children}
    </ChallengesContext.Provider>
  );
}

export function useChallenges() {
  const context = useContext(ChallengesContext);
  if (context === undefined) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
}
