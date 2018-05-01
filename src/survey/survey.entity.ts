import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expansion } from '../expansion/expansion.entity';
import { SurveyResponse } from '../response/survey-response.entity';
import { CardStat } from '../stat/card-stat.entity';
import { ExpansionStat } from '../stat/expansion-stat.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn() id: number;

  @CreateDateColumn() createTime: string;

  @Column() expansionCode: string;

  @ManyToOne(type => Expansion, expansion => expansion.surveys)
  @JoinColumn({ name: 'expansionCode' })
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

  isClosed() {
    if (this.status === 'closed') {
      return true;
    }
    if (!this.endTime) {
      return false;
    }
    return new Date(this.endTime).getTime() < new Date().getTime();
  }
}
