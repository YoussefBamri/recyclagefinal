import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';
import { Participation } from '../participation.entity';
import { User } from '../user.entity';
import { Defi } from '../defis/defi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation, User, Defi]),
  ],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
  exports: [ParticipationsService],
})
export class ParticipationsModule {}

