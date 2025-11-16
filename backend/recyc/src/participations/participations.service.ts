import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../participation.entity';
import { User } from '../user.entity';
import { Defi, DefiStatut } from '../defis/defi.entity';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationRepo: Repository<Participation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Defi)
    private readonly defiRepo: Repository<Defi>,
  ) {}

  // ✅ Créer une participation (contribution d'un utilisateur à un défi)
  async create(userId: number, defiId: number, quantite: number): Promise<Participation> {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Utilisateur ${userId} introuvable`);
    }

    // Vérifier que le défi existe
    const defi = await this.defiRepo.findOne({ where: { id: defiId } });
    if (!defi) {
      throw new NotFoundException(`Défi ${defiId} introuvable`);
    }

    // Vérifier que la quantité est valide
    if (quantite <= 0) {
      throw new Error('La quantité doit être supérieure à 0');
    }

    // Vérifier que la quantité ne dépasse pas le restant
    const montantActuel = defi.montantActuel || 0;
    const objectif = defi.objectif || 0;
    const restant = objectif - montantActuel;
    
    if (quantite > restant) {
      throw new Error(`La quantité (${quantite}) dépasse le montant restant (${restant})`);
    }

    // Créer la participation
    const participation = this.participationRepo.create({
      user,
      defi,
      quantite,
    } as Partial<Participation>);

    const savedParticipation = await this.participationRepo.save(participation);

    // Mettre à jour le montant actuel du défi
    const nouveauMontantActuel = montantActuel + quantite;
    
    // Vérifier si l'objectif est atteint et mettre à jour le statut automatiquement
    // (objectif est déjà déclaré plus haut, on le réutilise)
    let nouveauStatut = defi.statut;
    
    if (nouveauMontantActuel >= objectif && defi.statut !== DefiStatut.COMPLETE) {
      nouveauStatut = DefiStatut.COMPLETE;
      console.log(`✅ Défi ${defiId} automatiquement marqué comme COMPLET (objectif atteint: ${nouveauMontantActuel}/${objectif})`);
    }
    
    await this.defiRepo.update(defiId, {
      montantActuel: nouveauMontantActuel,
      statut: nouveauStatut,
    });

    // Retourner la participation avec les relations chargées
    return await this.participationRepo.findOne({
      where: { id: savedParticipation.id },
      relations: ['user', 'defi'],
    });
  }

  // ✅ Récupérer toutes les participations d'un défi
  async findByDefi(defiId: number): Promise<Participation[]> {
    return await this.participationRepo.find({
      where: { defi: { id: defiId } },
      relations: ['user'],
      order: { dateParticipation: 'DESC' },
    });
  }

  // ✅ Récupérer toutes les participations d'un utilisateur
  async findByUser(userId: number): Promise<Participation[]> {
    return await this.participationRepo.find({
      where: { user: { id: userId } },
      relations: ['defi'],
      order: { dateParticipation: 'DESC' },
    });
  }

  // ✅ Récupérer une participation par ID
  async findOne(id: number): Promise<Participation> {
    const participation = await this.participationRepo.findOne({
      where: { id },
      relations: ['user', 'defi'],
    });
    if (!participation) {
      throw new NotFoundException(`Participation ${id} introuvable`);
    }
    return participation;
  }

  // ✅ Supprimer une participation
  async remove(id: number): Promise<void> {
    const participation = await this.findOne(id);
    
    // Mettre à jour le montant actuel du défi en soustrayant la quantité
    const defi = await this.defiRepo.findOne({
      where: { id: participation.defi.id },
    });
    
    if (defi) {
      // Calculer le nouveau montant actuel en soustrayant la quantité de la participation
      const nouveauMontantActuel = Math.max(0, (defi.montantActuel || 0) - participation.quantite);
      await this.defiRepo.update(defi.id, {
        montantActuel: nouveauMontantActuel,
      });
    }

    await this.participationRepo.remove(participation);
  }
}

