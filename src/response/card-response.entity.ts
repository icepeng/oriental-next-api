import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../card/card.entity';
import { CardResponseDto } from './dto/create-response.dto';
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

  @Column() power: number;

  @Column() generality: number;

  @Column('text') description: string;

  applyData(cardResponseDto: CardResponseDto) {
    this.power = cardResponseDto.power;
    this.generality = cardResponseDto.generality;
    this.description = cardResponseDto.description;
    this.cardId = cardResponseDto.card;
  }
}
