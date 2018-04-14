import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expansion } from './expansion.entity';
import { CreateExpansionDto } from './dto/create-expansion.dto';

@Component()
export class ExpansionService {
  constructor(
    @InjectRepository(Expansion)
    private readonly expansionRepository: Repository<Expansion>,
  ) {}

  async create(createExpansionDto: CreateExpansionDto) {
    const expansion = this.expansionRepository.create(createExpansionDto);
    return this.expansionRepository.save(expansion);
  }

  async findAll() {
    return this.expansionRepository.find({
      relations: [
        'cards',
        'surveys',
        'surveys.expansionStat',
        'surveys.cardStats',
      ],
    });
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
}
