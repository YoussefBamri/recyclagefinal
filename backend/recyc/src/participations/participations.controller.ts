import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ParticipationsService } from './participations.service';

@Controller('participations')
export class ParticipationsController {
  constructor(private readonly participationsService: ParticipationsService) {}

  // ✅ Créer une participation (contribution)
  @Post()
  async create(
    @Body() body: { userId: number; defiId: number; quantite: number },
  ) {
    return await this.participationsService.create(
      body.userId,
      body.defiId,
      body.quantite,
    );
  }

  // ✅ Récupérer toutes les participations d'un défi
  @Get('defi/:defiId')
  async findByDefi(@Param('defiId', ParseIntPipe) defiId: number) {
    return await this.participationsService.findByDefi(defiId);
  }

  // ✅ Récupérer toutes les participations d'un utilisateur
  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.participationsService.findByUser(userId);
  }

  // ✅ Récupérer une participation par ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.participationsService.findOne(id);
  }

  // ✅ Supprimer une participation
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.participationsService.remove(id);
    return { message: `Participation ${id} supprimée avec succès` };
  }
}

