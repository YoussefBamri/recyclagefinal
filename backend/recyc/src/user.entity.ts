import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from './role.enum';
import { Article } from './article.entity';
import { Participation } from './participation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationToken: string | null;

  // 🔥 Articles supprimés automatiquement si user supprimé
  @OneToMany(() => Article, (article) => article.utilisateur, {
    cascade: true,
    orphanedRowAction: 'delete', // TypeORM 0.3+
  })
  articles: Article[];

  @OneToMany(() => Participation, (participation) => participation.user, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  participations: Participation[];

  // Méthode utilitaire
  sendMessage(receiver: User, content: string): void {
    console.log(`Message de ${this.name} à ${receiver.name}: ${content}`);
  }
}
