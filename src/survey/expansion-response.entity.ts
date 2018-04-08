import { Column, Entity, Generated, JoinColumn, OneToOne } from 'typeorm';

import { SurveyResponse } from './survey-response.entity';

@Entity()
export class ExpansionResponse {
  @Generated('increment')
  @Column('int')
  id: number;

  @OneToOne(type => SurveyResponse, response => response.expansionResponse, {
    primary: true,
  })
  @JoinColumn()
  response: SurveyResponse;

  @Column() fun: number;

  @Column() balance: number;

  @Column('text') description: string;
}
