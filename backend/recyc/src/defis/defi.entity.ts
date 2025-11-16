import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Participation } from '../participation.entity';
export enum DefiStatut {
  EN_COURS = 'en_cours',
  COMPLETE = 'complete',
}

@Entity('defis')
export class Defi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sponsor: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  causeHumanitaire: string;

  @Column({ type: 'float', nullable: true })
  objectif: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unite: string;

  @Column({ type: 'float', nullable: true })
  recompense: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  montantActuel: number;

  @Column({ type: 'date', nullable: true })
  dateLimite: Date;
  @Column({
    type: 'enum',
    enum: DefiStatut,
    default: DefiStatut.EN_COURS,
  })
  statut: DefiStatut;

  @OneToMany(() => Participation, (p) => p.defi, { cascade: true })
  participations: Participation[];
}
