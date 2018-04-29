import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SurveyResponse } from '../response/survey-response.entity';
import { User } from './user.entity';

@Entity()
export class UserPoint {
  @PrimaryGeneratedColumn() id: string;

  @ManyToOne(type => User, user => user.points, { nullable: false })
  user: User;

  @OneToOne(type => SurveyResponse)
  response: SurveyResponse;

  @Column() amount: number;
}
