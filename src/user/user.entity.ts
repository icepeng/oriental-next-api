import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { SurveyResponse } from '../response/survey-response.entity';
import { UserPoint } from './user-point.value';

@Entity()
export class User {
  @PrimaryColumn() id: string;

  @CreateDateColumn() createTime: string;

  @Column() battletag: string;

  @Column(type => UserPoint)
  point: UserPoint;

  @OneToMany(type => SurveyResponse, response => response.user)
  responses: SurveyResponse[];
}
