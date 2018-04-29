import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../card/card.entity';
import { CardResponse } from '../response/card-response.entity';
import { Survey } from '../survey/survey.entity';

@Entity()
@Index(['surveyId', 'cardId'], { unique: true })
export class CardStat {
  @PrimaryGeneratedColumn() id: number;

  @Column() surveyId: number;

  @ManyToOne(type => Survey, survey => survey.cardStats)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @Column() cardId: string;

  @ManyToOne(type => Card, card => card.stats)
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @Column('json')
  data: {
    power: number[];
    generality: number[];
    responseCount: number;
  };
}
