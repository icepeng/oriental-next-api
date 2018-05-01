import {
  BadRequestException,
  Component,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POINT_REWARD_EXPANSION } from '../common/config';
import { Survey } from '../survey/survey.entity';
import { User } from '../user/user.entity';
import { ExpansionResponseDto } from './dto/create-response.dto';
import { SurveyResponse } from './survey-response.entity';

@Component()
export class ExpansionResponseService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponse)
    private readonly responseRepository: Repository<SurveyResponse>,
  ) {}

  async save(
    responseId: number,
    surveyId: number,
    user: User,
    expansionResponseDto: ExpansionResponseDto,
  ) {
    const survey = await this.surveyRepository.findOne(surveyId);
    if (!survey) {
      throw new NotFoundException();
    }
    if (survey.isClosed()) {
      throw new BadRequestException();
    }

    const response = await this.responseRepository.findOne(
      {
        id: responseId,
        surveyId,
        userId: user.id,
      },
      { relations: ['expansionResponse'] },
    );
    if (!response) {
      throw new NotFoundException();
    }

    const saveResult = response.saveExpansionResponse(expansionResponseDto);

    if (saveResult === 'Add' && !survey.isPreRelease) {
      user.point.increment(POINT_REWARD_EXPANSION);
    }

    return this.responseRepository.manager.save<[SurveyResponse, User]>([
      // TODO: change to entityManager after nest v5
      response,
      user,
    ]);
  }
}
