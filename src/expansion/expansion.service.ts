import { Component, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expansion } from './expansion.entity';
import { CreateExpansionDto } from './dto/create-expansion.dto';
import { ExpansionResponse } from '../response/expansion-response.entity';

@Component()
export class ExpansionService {
  constructor(
    @InjectRepository(Expansion)
    private readonly expansionRepository: Repository<Expansion>,
    @InjectRepository(ExpansionResponse)
    private readonly expansionResponseRepository: Repository<ExpansionResponse>,
  ) {}

  async create(createExpansionDto: CreateExpansionDto) {
    const expansion = this.expansionRepository.create(createExpansionDto);
    return this.expansionRepository.save(expansion);
  }

  async findAll() {
    return this.expansionRepository
      .createQueryBuilder('expansion')
      .leftJoinAndSelect('expansion.cards', 'card')
      .leftJoinAndSelect('expansion.surveys', 'survey')
      .leftJoinAndSelect('survey.expansionStat', 'expansionStat')
      .leftJoinAndSelect('survey.cardStats', 'cardStat')
      .orderBy('card.class', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    return this.expansionRepository.findOne(id, {
      relations: [
        'cards',
        'surveys',
        'surveys.expansionStat',
        'surveys.cardStats',
      ],
    });
  }

  async getRandomResponses(id: string) {
    const expansion = await this.expansionRepository.findOne(id);
    if (!expansion) {
      throw new NotFoundException();
    }

    const count = await this.expansionResponseRepository
      .createQueryBuilder('expansionResponse')
      .leftJoin('expansionResponse.response', 'response')
      .leftJoin('response.survey', 'survey')
      .where('survey.expansionCode = :id', { id })
      .andWhere('char_length(expansionResponse.description) > 0')
      .andWhere('survey.isPreRelease = true')
      .getCount();

    return this.expansionResponseRepository
      .createQueryBuilder('expansionResponse')
      .leftJoinAndSelect('expansionResponse.response', 'response')
      .leftJoinAndSelect('response.user', 'user')
      .leftJoin('response.survey', 'survey')
      .where('survey.expansionCode = :id', { id })
      .andWhere('char_length(expansionResponse.description) > 0')
      .andWhere('survey.isPreRelease = true')
      .skip(Math.floor(Math.random() * Math.max(count - 3, 0)))
      .take(4)
      .getMany();
  }
}
