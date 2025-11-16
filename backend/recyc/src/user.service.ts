import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Méthode pour créer un utilisateur (role optionnel, default = USER)
  async register(userData: { name: string; email: string; password: string; phone: string; role?: Role }): Promise<{ user: User; verificationToken: string }> {
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) throw new ConflictException('Un utilisateur avec cet email existe déjà');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || Role.USER,  // si role fourni => utilisé, sinon USER
      isVerified: false,
      verificationToken,
    });

    const savedUser = await this.userRepository.save(user);
    return { user: savedUser, verificationToken };
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Mot de passe incorrect');

    if (!user.isVerified) {
      throw new UnauthorizedException('Votre compte n\'est pas encore vérifié. Veuillez vérifier votre email pour activer votre compte.');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { verificationToken: token } });
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Lien de vérification invalide ou expiré');
    }

    user.isVerified = true;
    user.verificationToken = null;
    return await this.userRepository.save(user);
  }

  async sendMessage(senderId: number, receiverId: number, content: string): Promise<void> {
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) throw new NotFoundException('Expéditeur non trouvé');

    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });
    if (!receiver) throw new NotFoundException('Destinataire non trouvé');

    console.log(`Message de ${sender.name} (${sender.email}) à ${receiver.name} (${receiver.email}): ${content}`);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ select: ['id', 'name', 'email', 'phone', 'role'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, select: ['id', 'name', 'email', 'phone', 'role'] });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
