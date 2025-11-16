// src/articles/article.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';


export enum ArticleStatus {
  SALE = 'sale',        // revente
  EXCHANGE = 'exchange', // échange
  GIVEAWAY = 'giveaway', // don
  SOLD = 'sold',         // déjà vendu / échangé
}

@Entity()
export class Article {
@PrimaryGeneratedColumn('uuid')
id: string;


  @Column()
  titre: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  categorie: string;

  @Column({ nullable: true })
  etat: string;

  @Column({ default: 'Tunis Centre' })
  localisation: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.SALE,
  })
  statut: ArticleStatus;

  @Column({ type: 'float', nullable: true })
  prix: number;

  @Column({ nullable: true })
  souhaitEchange: string;

 @Column({ nullable: true })
photo: string;


  @ManyToOne(() => User, (user) => user.articles, { eager: true, onDelete: 'CASCADE' })
  utilisateur: User;

  @CreateDateColumn()
  dateCreation: Date;
}
