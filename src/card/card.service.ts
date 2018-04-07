import { Component, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expansion } from '../expansion/expansion.entity';
import { Card } from './card.entity';

@Component()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(Expansion)
    private readonly expansionRepository: Repository<Expansion>,
  ) {}

  async findAll() {
    return this.cardRepository.find();
  }

  async findOne(id: string) {
    return this.cardRepository.findOne(id);
  }

  async saveCards(expansionCode: string, cards: Card[]) {
    const expansion = await this.expansionRepository.findOne(expansionCode);
    if (!expansion) {
      throw new NotFoundException();
    }

    const cardEntities = cards.map(card =>
      this.cardRepository.create({ ...card, expansion }),
    );

    return this.cardRepository.save(cardEntities);
  }
}
