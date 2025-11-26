import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message.entity';
import { User } from '../user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(senderId: number, receiverId: number, content: string) {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const receiver = await this.userRepo.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const message = this.messageRepo.create({
      sender,
      receiver,
      content,
      isRead: false,
    });

    return await this.messageRepo.save(message);
  }

  // Récupérer tous les messages entre deux utilisateurs
  async getConversation(userId1: number, userId2: number) {
    return await this.messageRepo.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }

  // Récupérer toutes les conversations d'un utilisateur (pour l'admin)
  async getConversationsForAdmin(adminId: number) {
    // Récupérer tous les messages où l'admin est le receiver
    const messages = await this.messageRepo.find({
      where: { receiver: { id: adminId } },
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });

    // Grouper par utilisateur (sender)
    const conversationsMap = new Map<number, any>();
    
    messages.forEach((message) => {
      const senderId = message.sender.id;
      if (!conversationsMap.has(senderId)) {
        conversationsMap.set(senderId, {
          userId: senderId,
          userName: message.sender.name,
          userEmail: message.sender.email,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: 0,
        });
      }
      const conversation = conversationsMap.get(senderId);
      if (message.createdAt > conversation.lastMessageTime) {
        conversation.lastMessage = message.content;
        conversation.lastMessageTime = message.createdAt;
      }
      if (!message.isRead) {
        conversation.unreadCount++;
      }
    });

    return Array.from(conversationsMap.values());
  }

  // Récupérer la conversation d'un utilisateur avec l'admin
  async getConversationWithAdmin(userId: number, adminId: number) {
    return await this.getConversation(userId, adminId);
  }

  // Marquer les messages comme lus
  async markAsRead(messageIds: number[]) {
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('id IN (:...ids)', { ids: messageIds })
      .execute();
  }

  async markConversationAsRead(userId: number, adminId: number) {
    await this.messageRepo.update(
      {
        sender: { id: userId },
        receiver: { id: adminId },
        isRead: false,
      },
      { isRead: true },
    );
  }
}

