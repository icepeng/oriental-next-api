import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Survey } from '../survey/survey.entity';

@Entity()
export class ExpansionStat {
  @OneToOne(type => Survey, { primary: true })
  @JoinColumn()
  survey: Survey;

  @Column('json')
  data: {
    fun: number[];
    balance: number[];
    responseCount: number;
  };
}
