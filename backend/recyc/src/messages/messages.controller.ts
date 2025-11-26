import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Créer un nouveau message
  @Post()
  async create(
    @Body() body: { senderId: number; receiverId: number; content: string },
  ) {
    return await this.messagesService.create(
      body.senderId,
      body.receiverId,
      body.content,
    );
  }

  // Récupérer la conversation entre deux utilisateurs
  @Get('conversation/:userId1/:userId2')
  async getConversation(
    @Param('userId1', ParseIntPipe) userId1: number,
    @Param('userId2', ParseIntPipe) userId2: number,
  ) {
    return await this.messagesService.getConversation(userId1, userId2);
  }

  // Récupérer toutes les conversations pour l'admin
  @Get('admin/:adminId')
  async getConversationsForAdmin(
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return await this.messagesService.getConversationsForAdmin(adminId);
  }

  // Récupérer la conversation d'un utilisateur avec l'admin
  @Get('user/:userId/admin/:adminId')
  async getConversationWithAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return await this.messagesService.getConversationWithAdmin(userId, adminId);
  }

  // Marquer une conversation comme lue
  @Patch('read/:userId/:adminId')
  async markConversationAsRead(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    await this.messagesService.markConversationAsRead(userId, adminId);
    return { message: 'Messages marqués comme lus' };
  }
}





