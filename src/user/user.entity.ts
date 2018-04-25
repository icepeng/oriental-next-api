import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { SurveyResponse } from '../response/survey-response.entity';
import { UserPoint } from './user-point.entity';

@Entity()
export class User {
  @PrimaryColumn() id: string;

  @CreateDateColumn() createTime: string;

  @Column() battletag: string;

  @OneToMany(type => UserPoint, point => point.user)
  points: UserPoint[];

  @OneToMany(type => SurveyResponse, response => response.user)
  responses: SurveyResponse[];
}
