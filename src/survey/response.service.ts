import {
  BadRequestException,
  Component,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../card/card.entity';
import { Expansion } from '../expansion/expansion.entity';
import { User } from '../user/user.entity';
import { CardResponse } from './card-response.entity';
import {
  CardResponseDto,
  ExpansionResponseDto,
  CreateResponseDto,
} from './dto/create-response.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { ExpansionResponse } from './expansion-response.entity';
import { SurveyResponse } from './survey-response.entity';
import { Survey } from './survey.entity';

@Component()
export class ResponseService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponse)
    private readonly responseRepository: Repository<SurveyResponse>,
    @InjectRepository(CardResponse)
    private readonly cardResponseRepository: Repository<CardResponse>,
    @InjectRepository(ExpansionResponse)
    private readonly expansionResponseRepository: Repository<ExpansionResponse>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
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
    const survey = await this.surveyRepository.findOne(surveyId, {
      relations: ['expansion'],
    });
    if (!survey) {
      throw new NotFoundException();
    }
    if (
      survey.endTime &&
      new Date(survey.endTime).getTime() < new Date().getTime()
    ) {
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

  async createCardResponse(
    responseId: number,
    surveyId: number,
    user: User,
    cardResponseDto: CardResponseDto,
  ) {
    const survey = await this.surveyRepository.findOne(surveyId, {
      relations: ['expansion'],
    });
    if (!survey) {
      throw new NotFoundException();
    }
    if (
      survey.endTime &&
      new Date(survey.endTime).getTime() < new Date().getTime()
    ) {
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

    const card = await this.cardRepository.findOne({
      expansion: survey.expansion,
      id: cardResponseDto.card,
    });
    if (!card) {
      throw new BadRequestException();
    }

    const cardResponse = this.cardResponseRepository.create({
      ...cardResponseDto,
      card,
      response,
    });

    return this.cardResponseRepository.save(cardResponse);
  }

  async createExpansionResponse(
    responseId: number,
    surveyId: number,
    user: User,
    expansionResponseDto: ExpansionResponseDto,
  ) {
    const survey = await this.surveyRepository.findOne(surveyId, {
      relations: ['expansion'],
    });
    if (!survey) {
      throw new NotFoundException();
    }
    if (
      survey.endTime &&
      new Date(survey.endTime).getTime() < new Date().getTime()
    ) {
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
