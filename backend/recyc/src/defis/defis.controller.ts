import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { DefisService } from './defis.service';

@Controller('defis')
export class DefisController {
  constructor(private readonly defisService: DefisService) {}

  // ✅ Créer un nouveau défi
  @Post()
  async create(@Body() data: any) {
    return await this.defisService.create(data);
  }

  // ✅ Lister tous les défis
  @Get()
  async findAll() {
    return await this.defisService.findAll();
  }

  // ✅ Récupérer un défi par ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.defisService.findOne(id);
  }

  // ✅ Mettre à jour un défi
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: any) {
    return await this.defisService.update(id, data);
  }

  // ✅ Supprimer un défi
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.defisService.remove(id);
    return { message: `Défi ${id} supprimé avec succès` };
  }

  // ✅ Participer à un défi
  @Post(':id/participer')
  async participer(
    @Param('id') defiId: number,
    @Body() body: { userId: number; quantite: number },
  ) {
    return await this.defisService.participer(body.userId, defiId, body.quantite);
  }

  // ✅ Récupérer les participants d’un défi
  @Get(':id/participants')
  async getParticipants(@Param('id') id: number) {
    return await this.defisService.getParticipants(id);
  }
}
