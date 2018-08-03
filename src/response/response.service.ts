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
      relations: [
        'user',
        'cardResponses',
        'expansionResponse',
        'cardResponses.archives',
        'cardResponses.archives.user',
      ],
    });
  }

  async getRandom(surveyId: number) {
    const randomId = await this.responseRepository
      .query(
        `SELECT r.*
      FROM survey_response r INNER JOIN
           card_response c
           ON c."responseId" = r.id
      GROUP BY r.id
      HAVING COUNT(*) >= 10 ORDER BY random() LIMIT 1;`,
      )
      .then(res => res[0].id);
    return this.responseRepository.findOne(randomId);
  }

  async create(surveyId: number, user: User) {
    const survey = await this.surveyRepository.findOne(surveyId);
    if (!survey) {
      throw new NotFoundException();
    }
    if (survey.isClosed()) {
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
      surveyId,
      userId: user.id,
    });
    return this.responseRepository.save(response);
  }
}
