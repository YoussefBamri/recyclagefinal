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
  
  @OneToMany(() => Article, (article) => article.utilisateur, { cascade: true })
  articles: Article[];
    @OneToMany(() => Participation, (participation) => participation.user)
  participations: Participation[];


  // Méthodes utilitaires de l'entité
  sendMessage(receiver: User, content: string): void {
    // Méthode utilitaire pour l'affichage
    console.log(`Message de ${this.name} à ${receiver.name}: ${content}`);
  }
}
