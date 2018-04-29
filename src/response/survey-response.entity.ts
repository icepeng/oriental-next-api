import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Survey } from '../survey/survey.entity';
import { User } from '../user/user.entity';
import { CardResponse } from './card-response.entity';
import { ExpansionResponse } from './expansion-response.entity';
import { CardResponseDto } from './dto/create-response.dto';

@Entity()
@Index(['user', 'survey'], { unique: true })
export class SurveyResponse {
  @PrimaryGeneratedColumn() id: number;

  @CreateDateColumn() createTime: string;

  @Column() surveyId: number;

  @ManyToOne(type => Survey, survey => survey.responses)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @Column() userId: string;

  @ManyToOne(type => User, user => user.responses)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(type => CardResponse, cardResponse => cardResponse.response)
  cardResponses: CardResponse[];

  @OneToOne(
    type => ExpansionResponse,
    expansionResponse => expansionResponse.response,
  )
  expansionResponse: ExpansionResponse;

  saveCardResponse(cardResponseDto: CardResponseDto) {
    const existing = this.cardResponses.find(x => x.cardId === cardResponseDto.card);
    if (existing) {
      existing.applyData(cardResponseDto);
      return;
    }
    const cardResponse = new CardResponse();
    cardResponse.applyData(cardResponseDto);
    this.cardResponses.push(cardResponse);
  }
}
