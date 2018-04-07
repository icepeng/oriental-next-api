import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SurveyResponse } from './survey-response.entity';

@Entity()
export class ExpansionResponse {
  @PrimaryGeneratedColumn() id: string;

  @OneToOne(type => SurveyResponse, response => response.cardResponses)
  @JoinColumn()
  response: SurveyResponse;

  @Column() fun: number;

  @Column() balance: number;

  @Column('text') description: string;
}
