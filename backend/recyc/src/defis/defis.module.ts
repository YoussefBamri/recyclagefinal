import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefisService } from './defis.service';
import { DefisController } from './defis.controller';
import { Defi } from './defi.entity';
import { Participation } from '../participation.entity';
import { User } from '../user.entity';

@Module({
  imports: [
    // ✅ On enregistre ici les entités utilisées dans ce module
    TypeOrmModule.forFeature([Defi, Participation, User]),
  ],
  controllers: [DefisController],
  providers: [DefisService],
  exports: [DefisService], // utile si un autre module doit l'utiliser
})
export class DefisModule {}
