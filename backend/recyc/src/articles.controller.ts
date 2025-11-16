import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('create/:userId')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📦 Données reçues du front :', body);
    console.log('🖼️ Fichier reçu :', file?.filename || 'Aucun');

    // Stocker le chemin relatif de la photo
    const photoPath = file ? `uploads/${file.filename}` : null;

    return this.articlesService.create(userId, body, photoPath);
  }

  @Get()
  async findAll() {
    return this.articlesService.findAll();
  }

  @Get('user/:id')
  async findByUser(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findByUser(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.articlesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
