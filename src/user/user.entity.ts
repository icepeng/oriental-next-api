import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { SurveyResponse } from '../response/survey-response.entity';
import { UserInfo } from './user-info.entity';

@Entity()
export class User {
  @PrimaryColumn() id: string;

  @CreateDateColumn() createTime: string;

  @Column() battletag: string;

  @OneToOne(type => UserInfo, info => info.user)
  info: UserInfo;

  @OneToMany(type => SurveyResponse, response => response.user)
  responses: SurveyResponse[];
}
