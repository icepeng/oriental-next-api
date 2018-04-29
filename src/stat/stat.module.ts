import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../card/card.entity';
import { CardResponse } from '../response/card-response.entity';
import { ExpansionResponse } from '../response/expansion-response.entity';
import { Survey } from '../survey/survey.entity';
import { CardStat } from './card-stat.entity';
import { CardStatFactory } from './card-stat.factory';
import { ExpansionStat } from './expansion-stat.entity';
import { ExpansionStatFactory } from './expansion-stat.factory';
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
  components: [StatService, CardStatFactory, ExpansionStatFactory],
  controllers: [],
})
export class StatModule {}
