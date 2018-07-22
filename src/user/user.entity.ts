import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { SurveyResponse } from '../response/survey-response.entity';
import { Archive } from '../archive/archive.entity';

@Entity()
export class User {
  @PrimaryColumn() id: string;

  @CreateDateColumn() createTime: string;

  @Column() battletag: string;

  @Column({ type: 'int', default: 0 })
  point: number;

  @OneToMany(type => SurveyResponse, response => response.user)
  responses: SurveyResponse[];

  @OneToMany(type => Archive, archive => archive.user)
  archives: Archive[];
}
