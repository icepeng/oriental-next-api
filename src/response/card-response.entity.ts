import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
} from 'typeorm';

import { Card } from '../card/card.entity';
import { SurveyResponse } from './survey-response.entity';
import { UserPoint } from '../user/user-point.entity';

@Entity()
@Index(['card', 'response'], { unique: true })
export class CardResponse {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => SurveyResponse, response => response.cardResponses, {
    nullable: false,
  })
  response: SurveyResponse;

  @Column({ nullable: false })
  cardId: string;

  @ManyToOne(type => Card, card => card.responses)
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @OneToOne(type => UserPoint, point => point.cardResponse, {
    cascade: ['insert'],
  })
  point: UserPoint;

  @Column() power: number;

  @Column() generality: number;

  @Column('text') description: string;
}
