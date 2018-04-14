import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Card } from '../card/card.entity';
import { Survey } from '../survey/survey.entity';

@Entity()
export class CardStat {
  @ManyToOne(type => Survey, survey => survey.cardStats, { primary: true })
  survey: Survey;

  @PrimaryColumn() cardId: string;

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
