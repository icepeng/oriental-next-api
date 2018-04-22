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

@Component()
export class ResponseService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponse)
    private readonly responseRepository: Repository<SurveyResponse>,
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

  private isSurveyClosed(survey: Survey) {
    return (
      survey.endTime &&
      new Date(survey.endTime).getTime() < new Date().getTime()
    );
  }

  async create(surveyId: number, user: User) {
    const survey = await this.surveyRepository.findOne(surveyId);
    if (!survey) {
      throw new NotFoundException();
    }
    if (this.isSurveyClosed(survey)) {
      throw new BadRequestException();
    }

    const existing = await this.responseRepository.findOne({
      survey,
      user,
    });
    if (existing) {
      throw new BadRequestException();
    }

    const response = await this.responseRepository.create({
      survey,
      user,
    });
    return this.responseRepository.save(response);
  }
}
