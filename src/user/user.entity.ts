import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { SurveyResponse } from '../survey/survey-response.entity';

@Entity()
export class User {
  @PrimaryColumn() id: string;

  @CreateDateColumn() createTime: string;

  @Column() battletag: string;

  @OneToMany(type => SurveyResponse, response => response.user)
  responses: SurveyResponse[];
}
