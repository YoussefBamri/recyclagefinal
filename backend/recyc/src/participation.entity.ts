import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Defi } from './defis/defi.entity';
@Entity('participations')
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.participations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Defi, (defi) => defi.participations, { onDelete: 'CASCADE' })
  defi: Defi;

  @Column({ type: 'float', nullable: true })
  quantite: number;

  @CreateDateColumn()
  dateParticipation: Date;
}
