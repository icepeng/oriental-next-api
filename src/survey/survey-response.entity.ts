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
import { User } from '../user/user.entity';
import { CardResponse } from './card-response.entity';
import { ExpansionResponse } from './expansion-response.entity';
import { Survey } from './survey.entity';

@Entity()
@Index(['user', 'survey'], { unique: true })
export class SurveyResponse {
  @PrimaryGeneratedColumn() id: number;

  @CreateDateColumn() createTime: string;

  @Column() surveyId: string;

  @ManyToOne(type => Survey, survey => survey.responses, { nullable: false })
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @ManyToOne(type => User, user => user.responses, { nullable: false })
  user: User;

  @OneToMany(type => CardResponse, cardResponse => cardResponse.response)
  cardResponses: CardResponse[];

  @OneToOne(
    type => ExpansionResponse,
    expansionResponse => expansionResponse.response,
  )
  expansionResponse: ExpansionResponse;
}
