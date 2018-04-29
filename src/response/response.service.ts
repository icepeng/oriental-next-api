import {
  BadRequestException,
  Component,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../survey/survey.entity';
import { User } from '../user/user.entity';
import { SurveyResponse } from './survey-response.entity';
import { SurveyResponseFactory } from './survey-response.factory';

@Component()
export class ResponseService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponse)
    private readonly responseRepository: Repository<SurveyResponse>,
    private readonly responseFactory: SurveyResponseFactory,
  ) {}

  async getOne(id: number) {
    return this.responseRepository.findOne(id, {
      relations: ['user', 'cardResponses', 'expansionResponse'],
    });
  }

  async getRandom(surveyId: number) {
    return this.responseRepository
      .createQueryBuilder('response')
      .where('response.surveyId = :surveyId', { surveyId })
      .orderBy('random()')
      .take(1)
      .getOne();
  }

  async create(surveyId: number, user: User) {
    const survey = await this.surveyRepository.findOne(surveyId);
    if (!survey) {
      throw new NotFoundException();
    }

    const existing = await this.responseRepository.findOne({
      survey,
      user,
    });
    if (existing) {
      throw new BadRequestException();
    }

    const response = this.responseFactory.create(survey, user);
    return this.responseRepository.save(response);
  }
}
