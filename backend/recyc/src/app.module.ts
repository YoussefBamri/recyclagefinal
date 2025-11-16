import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import AuthController from './auth.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { User } from './user.entity';
import { Article } from './article.entity';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { UserController } from './user.controller';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { RecyclageModule } from './recyclage/recyclage.module';
import { DefisModule } from './defis/defis.module';
import { ParticipationsModule } from './participations/participations.module';
import { Defi } from './defis/defi.entity';
import { Participation } from './participation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ Connexion MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_recyclage',
      entities: [User, Article, Defi, Participation], 
      autoLoadEntities: true,
      synchronize: true,
    }),

    TypeOrmModule.forFeature([User, Article]),

    // Configuration du module d'envoi d'emails
    // Note: Si SKIP_EMAIL=true, les emails ne seront pas envoyés (mode développement)
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true pour 465, false pour les autres ports
        auth: {
          user: process.env.SMTP_USER || 'youssefbamri5@gmail.com',
          pass: process.env.SMTP_PASS || 'your-app-password',
        },
        // Désactiver la vérification TLS en développement si nécessaire
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      },
      defaults: {
        from: `"Recycle App" <${process.env.SMTP_USER || 'your-email@gmail.com'}>`,
      },
    }),

    RecyclageModule,
    DefisModule, // ✅ module des défis
    ParticipationsModule, // ✅ module des participations
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ArticlesController,
  ],
  providers: [AppService, UserService, EmailService, ArticlesService],
})
export class AppModule {}
