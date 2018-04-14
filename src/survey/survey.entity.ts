import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Expansion } from '../expansion/expansion.entity';
import { SurveyResponse } from './survey-response.entity';
import { ExpansionStat } from './expansion-stat.entity';
import { CardStat } from './card-stat.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn() id: number;

  @CreateDateColumn() createTime: string;

  @ManyToOne(type => Expansion, expansion => expansion.surveys)
  expansion: Expansion;

  @OneToMany(type => SurveyResponse, response => response.survey)
  responses: SurveyResponse[];

  @OneToOne(type => ExpansionStat, expansionStat => expansionStat.survey)
  expansionStat: ExpansionStat;

  @OneToMany(type => CardStat, cardStat => cardStat.survey)
  cardStats: CardStat[];

  @Column('timestamp without time zone') startTime: string;

  @Column('timestamp without time zone', { nullable: true })
  endTime: string | null;

  @Column() isPreRelease: boolean;

  @Column() status: 'ongoing' | 'closed';
}
