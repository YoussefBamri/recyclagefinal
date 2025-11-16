import { Module } from '@nestjs/common';
import { RecyclageController } from './recyclage.controller';
import { RecyclageService } from './recyclage.service';

@Module({
  controllers: [RecyclageController],
  providers: [RecyclageService],
})
export class RecyclageModule {}
