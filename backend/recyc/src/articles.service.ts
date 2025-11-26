import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './article.entity';
import { User } from './user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ✅ Création d’un article avec une seule photo
  async create(userId: number, data: any, photoPath?: string) {
    console.log('🧩 Données reçues du front :', data);

    // Vérifier si l'utilisateur existe
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`Utilisateur avec ID ${userId} introuvable`);
    }

    // Déterminer le statut à partir du type ou du statut envoyé
    const statut = this.mapTypeToStatus(data.type || data.statut) ?? ArticleStatus.SALE;

    // Créer un nouvel article
    const article = this.articleRepo.create({
      titre: data.titre || data.title,
      description: data.description,
      categorie: data.categorie || data.category,
      localisation: data.localisation || data.location,
      etat: data.etat || data.condition,
      statut,
      prix: data.prix ? Number(data.prix) : data.price ? Number(data.price) : null,
      souhaitEchange: data.souhaitEchange || data.exchangeFor || null,
      photo: photoPath || null, // ✅ une seule photo
      utilisateur: user,
    });

    // Vérification du titre obligatoire
    if (!article.titre) {
      throw new Error("Le champ 'titre' est requis");
    }

    console.log('📦 Article prêt à sauvegarder :', article);

    // Sauvegarde dans la base
    return await this.articleRepo.save(article);
  }

  // ✅ Conversion du type d’action en statut d’article
  private mapTypeToStatus(type: string): ArticleStatus {
    switch (type) {
      case 'revendre':
        return ArticleStatus.SALE;
      case 'echanger':
        return ArticleStatus.EXCHANGE;
      case 'donner':
        return ArticleStatus.GIVEAWAY;
      default:
        return ArticleStatus.SALE;
    }
  }

  // ✅ Récupérer tous les articles
  async findAll() {
    return await this.articleRepo.find({
      relations: ['utilisateur'],
      order: { dateCreation: 'DESC' },
    });
  }

  // ✅ Récupérer les articles d’un utilisateur
  async findByUser(userId: number) {
    return await this.articleRepo.find({
      where: { utilisateur: { id: userId } },
      relations: ['utilisateur'],
      order: { dateCreation: 'DESC' },
    });
  }

  // ✅ Récupérer un seul article
  async findOne(id: string) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['utilisateur'],
    });

    if (!article) {
      throw new NotFoundException('Article non trouvé');
    }

    return article;
  }

  async remove(id: string) {
    const article = await this.findOne(id);
    await this.articleRepo.remove(article);
    return { message: `Article ${id} supprimé avec succès` };
  }

  async update(id: string, data: Partial<Article>) {
    const article = await this.findOne(id);
    
    if (data.statut !== undefined) {
      article.statut = data.statut;
    }
    if (data.titre !== undefined) {
      article.titre = data.titre;
    }
    if (data.description !== undefined) {
      article.description = data.description;
    }
    if (data.prix !== undefined) {
      article.prix = data.prix;
    }
    if (data.localisation !== undefined) {
      article.localisation = data.localisation;
    }
    
    return await this.articleRepo.save(article);
  }
}
