import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Card } from '../card/card.entity';
import { SurveyResponse } from './survey-response.entity';

@Entity()
export class CardResponse {
  @PrimaryGeneratedColumn() id: string;

  @ManyToOne(type => SurveyResponse, response => response.cardResponses)
  response: SurveyResponse;

  @ManyToOne(type => Card, card => card.responses)
  card: Card;

  @Column() power: number;

  @Column() generality: number;

  @Column('text') description: string;
}
