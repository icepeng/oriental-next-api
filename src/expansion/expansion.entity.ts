import { CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Card } from '../card/card.entity';
import { Survey } from '../survey/survey.entity';

@Entity()
export class Expansion {
  @PrimaryColumn() code: string;

  @OneToMany(type => Card, card => card.expansion)
  cards: Card[];

  @OneToMany(type => Survey, survey => survey.expansion)
  surveys: Survey[];
}
