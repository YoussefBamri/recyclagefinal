import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {
    this.checkEmailConfiguration();
  }

  private checkEmailConfiguration() {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || smtpUser === 'your-email@gmail.com' || !smtpPass || smtpPass === 'your-app-password') {
      this.logger.warn(' Configuration email non définie ou incomplète !');
      this.logger.warn('Les emails ne pourront pas être envoyés.');
      this.logger.warn(' Créez un fichier .env dans backend/recyc/ avec vos identifiants SMTP');
      this.logger.warn(' Voir EMAIL_SETUP.md pour plus d\'informations');
    } else {
      this.logger.log(' Configuration email détectée');
    }
  }

  async sendVerificationEmail(email: string, name: string, verificationToken: string): Promise<void> {
    // Vérifier si on doit ignorer l'envoi d'emails (mode développement)
    if (process.env.SKIP_EMAIL === 'true') {
      this.logger.warn(`⚠️  Mode SKIP_EMAIL activé - Email non envoyé pour ${email}`);
      this.logger.warn(`🔗 Lien de vérification : ${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`);
      return;
    }
    

    const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Active ton compte Recycle App ♻️',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>♻️ Recycle App</h1>
            </div>
            <div class="content">
              <h2>Bienvenue ${name} !</h2>
              <p>Merci de t'être inscrit sur Recycle App. Pour activer ton compte et commencer à publier des annonces, clique sur le bouton ci-dessous :</p>
              <div style="text-align: center;">
                <a href="${verifyLink}" class="button" style="color: white;">Activer mon compte</a>
              </div>
              <p>Ou copie-colle ce lien dans ton navigateur :</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; font-size: 12px;">${verifyLink}</p>
              <p><strong>⚠️ Important :</strong> Ce lien expirera dans 24 heures.</p>
              <p>Si tu n'as pas créé de compte sur Recycle App, tu peux ignorer cet email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Recycle App - Tous droits réservés</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  }
}

