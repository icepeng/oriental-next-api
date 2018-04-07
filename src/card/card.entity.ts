import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

import { Expansion } from '../expansion/expansion.entity';
import { CardClass, Rarity } from './types/card.types';
import { CardResponse } from '../survey/card-response.entity';

@Entity()
export class Card {
  @PrimaryColumn() id: string;

  @ManyToOne(type => Expansion, expansion => expansion.cards)
  expansion: Expansion;

  @OneToMany(type => CardResponse, response => response.card)
  responses: CardResponse[];

  @Column() cost: number;

  @Column('text') class: CardClass;

  @Column('text') rarity: Rarity;
}
