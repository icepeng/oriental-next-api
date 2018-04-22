import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Expansion } from '../expansion/expansion.entity';
import { CardResponse } from '../response/card-response.entity';
import { CardStat } from '../stat/card-stat.entity';
import { CardClass, Rarity } from './types/card.types';

@Entity()
export class Card {
  @PrimaryColumn() id: string;

  @ManyToOne(type => Expansion, expansion => expansion.cards)
  expansion: Expansion;

  @OneToMany(type => CardResponse, response => response.card)
  responses: CardResponse[];

  @OneToMany(type => CardStat, stat => stat.card)
  stats: CardStat[];

  @Column() cost: number;

  @Column('text') class: CardClass;

  @Column('text') rarity: Rarity;
}
