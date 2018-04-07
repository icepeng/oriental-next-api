import { Component, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expansion } from '../expansion/expansion.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Survey } from './survey.entity';

@Component()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Expansion)
    private readonly expansionRepository: Repository<Expansion>,
  ) {}

  async create(createSurveyDto: CreateSurveyDto) {
    const expansion = await this.expansionRepository.findOne(
      createSurveyDto.expansion,
    );
    if (!expansion) {
      throw new NotFoundException();
    }

    const survey = this.surveyRepository.create({
      ...createSurveyDto,
      expansion,
      status: 'ongoing',
    });
    return this.surveyRepository.save(survey);
  }

  async findAll() {
    return this.surveyRepository.find();
  }

  async findOne(id: string) {
    return this.surveyRepository.findOne(id);
  }
}
