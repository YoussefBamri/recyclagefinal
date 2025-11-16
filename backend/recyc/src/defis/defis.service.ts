import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Defi, DefiStatut } from './defi.entity';
import { Participation } from '../participation.entity';
import { User } from '../user.entity';

@Injectable()
export class DefisService {
  constructor(
    @InjectRepository(Defi)
    private readonly defiRepo: Repository<Defi>,

    @InjectRepository(Participation)
    private readonly participationRepo: Repository<Participation>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ✅ Créer un nouveau défi
  async create(data: any): Promise<Defi> {
    const defi = this.defiRepo.create({
      titre: data.titre,
      description: data.description,
      sponsor: data.sponsor,
      causeHumanitaire: data.causeHumanitaire || data.cause || '', // ✅ Accepter les deux formats pour compatibilité
      objectif: data.objectif,
      unite: data.unite,
      recompense: data.recompense,
      dateLimite: data.dateLimite,
      montantActuel: 0, // Initialiser à 0
    } as Partial<Defi>); // 👈 corrige le typage TypeORM

    console.log('📦 Défi créé avec causeHumanitaire:', defi.causeHumanitaire);
    return await this.defiRepo.save(defi);
  }

  // ✅ Lister tous les défis
  async findAll(): Promise<Defi[]> {
    return await this.defiRepo.find({
      relations: ['participations', 'participations.user'],
      order: { id: 'DESC' },
    });
  }

  // ✅ Récupérer un défi
  async findOne(id: number): Promise<Defi> {
    const defi = await this.defiRepo.findOne({
      where: { id },
      relations: ['participations', 'participations.user'],
    });
    if (!defi) throw new NotFoundException(`Défi ${id} non trouvé`);
    return defi;
  }

  // ✅ Mettre à jour un défi
  async update(id: number, data: Partial<Defi>): Promise<Defi> {
    const defi = await this.findOne(id);
    
    // Mettre à jour les propriétés
    Object.assign(defi, data);
    
    // Vérifier si l'objectif est atteint et mettre à jour le statut automatiquement
    if (defi.montantActuel !== undefined && defi.objectif !== undefined) {
      if (defi.montantActuel >= defi.objectif && defi.statut !== DefiStatut.COMPLETE) {
        defi.statut = DefiStatut.COMPLETE;
        console.log(`✅ Défi ${id} automatiquement marqué comme COMPLET (objectif atteint: ${defi.montantActuel}/${defi.objectif})`);
      } else if (defi.montantActuel < defi.objectif && defi.statut === DefiStatut.COMPLETE) {
        defi.statut = DefiStatut.EN_COURS;
        console.log(`⚠️ Défi ${id} remis à EN_COURS (montant insuffisant: ${defi.montantActuel}/${defi.objectif})`);
      }
    }
    
    return await this.defiRepo.save(defi);
  }

  // ✅ Supprimer un défi
  async remove(id: number): Promise<void> {
    const defi = await this.findOne(id);
    await this.defiRepo.remove(defi);
  }

  // ✅ Participation d’un utilisateur
  async participer(userId: number, defiId: number, quantite: number): Promise<Participation> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const defi = await this.defiRepo.findOne({ where: { id: defiId } });

    if (!user) throw new NotFoundException(`Utilisateur ${userId} introuvable`);
    if (!defi) throw new NotFoundException(`Défi ${defiId} introuvable`);

    const participation = this.participationRepo.create({
      user,
      defi,
      quantite,
    } as Partial<Participation>);

    return await this.participationRepo.save(participation);
  }

  // ✅ Obtenir les participants d’un défi
  async getParticipants(defiId: number): Promise<Participation[]> {
    return await this.participationRepo.find({
      where: { defi: { id: defiId } },
      relations: ['user'],
    });
  }
}
