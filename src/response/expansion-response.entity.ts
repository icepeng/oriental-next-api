import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

import { SurveyResponse } from './survey-response.entity';
import { UserPoint } from '../user/user-point.entity';

@Entity()
export class ExpansionResponse {
  @PrimaryGeneratedColumn() id: number;

  @OneToOne(type => SurveyResponse, response => response.expansionResponse, {
    nullable: false,
  })
  @JoinColumn()
  response: SurveyResponse;

  @Column() fun: number;

  @Column() balance: number;

  @Column('text') description: string;
}
