import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../card/card.entity';
import { CardResponse } from '../response/card-response.entity';
import { ExpansionResponse } from '../response/expansion-response.entity';
import { Survey } from '../survey/survey.entity';
import { CardStat } from './card-stat.entity';
import { ExpansionStat } from './expansion-stat.entity';
import { StatService } from './stat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      CardResponse,
      ExpansionResponse,
      Card,
      CardStat,
      ExpansionStat,
    ]),
  ],
  components: [StatService],
  controllers: [],
})
export class StatModule {}
