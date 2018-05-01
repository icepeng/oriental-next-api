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
import {
  CardResponseDto,
  ExpansionResponseDto,
} from './dto/create-response.dto';
import { ExpansionResponse } from './expansion-response.entity';

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

  @OneToMany(type => CardResponse, cardResponse => cardResponse.response, {
    cascade: true,
  })
  cardResponses: CardResponse[];

  @OneToOne(
    type => ExpansionResponse,
    expansionResponse => expansionResponse.response,
    { cascade: true },
  )
  expansionResponse: ExpansionResponse;

  saveCardResponse(cardResponseDto: CardResponseDto) {
    const existing = this.cardResponses.find(
      x => x.cardId === cardResponseDto.card,
    );
    if (existing) {
      existing.applyData(cardResponseDto);
      return 'Edit';
    }

    const cardResponse = new CardResponse();
    cardResponse.applyData(cardResponseDto);
    this.cardResponses.push(cardResponse);
    return 'Add';
  }

  saveExpansionResponse(expansionResponseDto: ExpansionResponseDto) {
    if (this.expansionResponse) {
      this.expansionResponse.applyData(expansionResponseDto);
      return 'Edit';
    }

    this.expansionResponse = new ExpansionResponse();
    this.expansionResponse.applyData(expansionResponseDto);
    return 'Add';
  }
}
