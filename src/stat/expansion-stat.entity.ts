import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { ExpansionResponse } from '../response/expansion-response.entity';
import { Survey } from '../survey/survey.entity';

@Entity()
export class ExpansionStat {
  @PrimaryGeneratedColumn() id: number;

  @Index({ unique: true })
  @Column()
  surveyId: number;

  @OneToOne(type => Survey)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @Column('json')
  data: {
    fun: number[];
    balance: number[];
    responseCount: number;
  };
}
