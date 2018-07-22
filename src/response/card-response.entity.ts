import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Archive } from '../archive/archive.entity';
import { Card } from '../card/card.entity';
import { SurveyResponse } from './survey-response.entity';

@Entity()
@Index(['card', 'response'], { unique: true })
export class CardResponse {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => SurveyResponse, response => response.cardResponses, {
    nullable: false,
  })
  response: SurveyResponse;

  @Column() cardId: string;

  @ManyToOne(type => Card, card => card.responses)
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @OneToMany(type => Archive, archive => archive.cardResponse)
  archives: Archive[];

  @Column() power: number;

  @Column() generality: number;

  @Column('text') description: string;
}
