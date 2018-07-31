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
  @PrimaryGeneratedColumn() id: number;

  @Column() responseId: number;

  @OneToOne(type => SurveyResponse, response => response.expansionResponse, {
    nullable: false,
  })
  @JoinColumn({ name: 'responseId' })
  response: SurveyResponse;

  @Column() fun: number;

  @Column() balance: number;

  @Column('text') description: string;
}
