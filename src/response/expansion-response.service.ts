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
import { ExpansionResponse } from './expansion-response.entity';

@Component()
export class ExpansionResponseService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponse)
    private readonly responseRepository: Repository<SurveyResponse>,
    @InjectRepository(ExpansionResponse)
    private readonly expansionResponseRepository: Repository<ExpansionResponse>,
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

    if (response.expansionResponse) {
      response.expansionResponse.description = expansionResponseDto.description;
      response.expansionResponse.balance = expansionResponseDto.balance;
      response.expansionResponse.fun = expansionResponseDto.fun;
    } else {
      const expansionResponse = this.expansionResponseRepository.create({
        ...expansionResponseDto,
      });
      response.expansionResponse = expansionResponse;
      if (!survey.isPreRelease) {
        user.point += POINT_REWARD_EXPANSION;
      }
    }

    return this.responseRepository.manager.save<[SurveyResponse, User]>([
      // TODO: change to entityManager after nest v5
      response,
      user,
    ]);
  }
}
