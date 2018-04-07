import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Expansion } from '../expansion/expansion.entity';
import { SurveyResponse } from './survey-response.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn() id: string;

  @CreateDateColumn() createTime: string;

  @ManyToOne(type => Expansion, expansion => expansion.surveys)
  expansion: Expansion;

  @OneToMany(type => SurveyResponse, response => response.survey)
  responses: Response[];

  @Column('timestamp without time zone') startTime: string;

  @Column('timestamp without time zone', { nullable: true })
  endTime: string | null;

  @Column() isPreRelease: boolean;

  @Column() status: 'ongoing' | 'closed';
}
