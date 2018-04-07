import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

import { User } from '../user/user.entity';
import { CardResponse } from './card-response.entity';
import { Survey } from './survey.entity';
import { ExpansionResponse } from './expansion-response.entity';

@Entity()
export class SurveyResponse {
  @PrimaryGeneratedColumn() id: string;

  @CreateDateColumn() createTime: string;

  @ManyToOne(type => Survey, survey => survey.responses)
  survey: Survey;

  @ManyToOne(type => User, user => user.responses)
  user: User;

  @OneToMany(type => CardResponse, cardResponse => cardResponse.response)
  cardResponses: CardResponse[];

  @OneToOne(
    type => ExpansionResponse,
    expansionResponse => expansionResponse.response,
  )
  expansionResponse: ExpansionResponse;
}
