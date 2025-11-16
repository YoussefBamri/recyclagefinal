import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { User } from './user.entity';
import { Role } from './role.enum';

export class RegisterDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: Role;
}

export class LoginDto {
  email: string;
  password: string;
}

export class SendMessageDto {
  receiverId: number;
  content: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: Role;
}

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string; user: Partial<User> }> {
    const { user, verificationToken } = await this.userService.register(registerDto);
    const { password, ...userWithoutPassword } = user;
    
    // Envoyer l'email de vérification
    try {
      await this.emailService.sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de vérification:', error.message);
      
      // Vérifier si c'est une erreur d'authentification
      if (error.message && error.message.includes('Invalid login')) {
        console.error('\n⚠️  PROBLÈME D\'AUTHENTIFICATION GMAIL DÉTECTÉ !');
        console.error('📧 Pour résoudre ce problème :');
        console.error('1. Créez un fichier .env dans backend/recyc/ avec :');
        console.error('   SMTP_HOST=smtp.gmail.com');
        console.error('   SMTP_PORT=587');
        console.error('   SMTP_USER=votre-email@gmail.com');
        console.error('   SMTP_PASS=votre-mot-de-passe-application');
        console.error('   FRONTEND_URL=http://localhost:3000');
        console.error('\n2. Utilisez un MOT DE PASSE D\'APPLICATION Gmail (pas votre mot de passe normal)');
        console.error('   Créez-le ici : https://myaccount.google.com/apppasswords');
        console.error('   (La validation en deux étapes doit être activée)');
        console.error('\n3. Redémarrez le serveur après avoir créé le fichier .env');
        console.error('\n💡 En mode développement, vous pouvez aussi activer le mode "skip email"');
        console.error('   en ajoutant SKIP_EMAIL=true dans votre .env\n');
      }
      
      // En mode développement, on peut continuer même si l'email échoue
      // mais on informe l'utilisateur
      if (process.env.NODE_ENV === 'development' || process.env.SKIP_EMAIL === 'true') {
        console.warn('⚠️  Mode développement : L\'inscription continue sans email');
        console.warn(`🔗 Lien de vérification manuel : http://localhost:3000/verify-email?token=${verificationToken}`);
      }
    }
    
    return {
      message: 'Compte créé avec succès ! Veuillez vérifier votre email pour activer votre compte.',
      user: userWithoutPassword
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ message: string; user: Partial<User> }> {
    const user = await this.userService.login(loginDto.email, loginDto.password);
    
    return {
      message: 'Connexion réussie',
      user
    };
  }

  @Post(':id/send-message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @Param('id') senderId: number,
    @Body() sendMessageDto: SendMessageDto
  ): Promise<{ message: string }> {
    await this.userService.sendMessage(senderId, sendMessageDto.receiverId, sendMessageDto.content);
    
    return {
      message: 'Message envoyé avec succès'
    };
  }

  @Get()
  async findAll(): Promise<{ users: User[] }> {
    const users = await this.userService.findAll();
    return { users };
  }

  // Routes statiques doivent être définies AVANT les routes dynamiques (:id)
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query('token') token: string): Promise<{ message: string; user: Partial<User> }> {
    if (!token) {
      throw new BadRequestException('Token de vérification manquant');
    }
    const user = await this.userService.verifyEmail(token);
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'Compte activé avec succès ! Vous pouvez maintenant vous connecter.',
      user: userWithoutPassword
    };
  }

  @Get('roles/available')
  async getAvailableRoles(): Promise<{ roles: Role[] }> {
    return {
      roles: Object.values(Role)
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<{ user: User }> {
    const user = await this.userService.findOne(id);
    return { user };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<{ message: string; user: Partial<User> }> {
    const user = await this.userService.update(id, updateUserDto);
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'Utilisateur mis à jour avec succès',
      user: userWithoutPassword
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }
}
