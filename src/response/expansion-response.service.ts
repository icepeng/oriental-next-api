import {
  BadRequestException,
  Component,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../survey/survey.entity';
import { User } from '../user/user.entity';
import { ExpansionResponseDto } from './dto/create-response.dto';
import { ExpansionResponse } from './expansion-response.entity';
import { SurveyResponse } from './survey-response.entity';

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

    const response = await this.responseRepository.findOne({
      id: responseId,
      survey,
      user,
    });
    if (!response) {
      throw new NotFoundException();
    }

    const expansionResponse = this.expansionResponseRepository.create({
      ...expansionResponseDto,
      response,
    });

    return this.expansionResponseRepository.save(expansionResponse);
  }
}
