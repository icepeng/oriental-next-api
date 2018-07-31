import { Component, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expansion } from '../expansion/expansion.entity';
import { Card } from './card.entity';
import { CardResponse } from '../response/card-response.entity';

@Component()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(CardResponse)
    private readonly cardResponseRepository: Repository<CardResponse>,
    @InjectRepository(Expansion)
    private readonly expansionRepository: Repository<Expansion>,
  ) {}

  async findAll() {
    return this.cardRepository.find();
  }

  async findOne(id: string) {
    return this.cardRepository.findOne(id);
  }

  async getRandomResponses(id: string) {
    const card = await this.cardRepository.findOne(id);
    if (!card) {
      throw new NotFoundException();
    }

    const count = await this.cardResponseRepository
      .createQueryBuilder('cardResponse')
      .leftJoin('cardResponse.response', 'response')
      .leftJoin('response.survey', 'survey')
      .where('cardResponse.cardId = :cardId', { cardId: card.id })
      .andWhere('char_length(cardResponse.description) > 0')
      .andWhere('survey.isPreRelease = true')
      .getCount();

    return this.cardResponseRepository
      .createQueryBuilder('cardResponse')
      .leftJoinAndSelect('cardResponse.response', 'response')
      .leftJoinAndSelect('response.user', 'user')
      .leftJoin('response.survey', 'survey')
      .where('cardResponse.cardId = :cardId', { cardId: card.id })
      .andWhere('char_length(cardResponse.description) > 0')
      .andWhere('survey.isPreRelease = true')
      .skip(Math.floor(Math.random() * (count - 3)))
      .take(4)
      .getMany();
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
