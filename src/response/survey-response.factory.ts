import {
  BadRequestException,
  Component,
  NotFoundException,
  Response,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../survey/survey.entity';
import { User } from '../user/user.entity';
import { SurveyResponse } from './survey-response.entity';

@Component()
export class SurveyResponseFactory {
  create(survey: Survey, user: User) {
    if (survey.isClosed()) {
      throw new BadRequestException();
    }

    const response = new SurveyResponse();
    response.surveyId = survey.id;
    response.userId = user.id;
    return response;
  }
}
