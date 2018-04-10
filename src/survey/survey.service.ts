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
} from './dto/create-response.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { ExpansionResponse } from './expansion-response.entity';
import { SurveyResponse } from './survey-response.entity';
import { Survey } from './survey.entity';

@Component()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponse)
    private readonly responseRepository: Repository<SurveyResponse>,
    @InjectRepository(CardResponse)
    private readonly cardResponseRepository: Repository<CardResponse>,
    @InjectRepository(ExpansionResponse)
    private readonly expansionResponseRepository: Repository<ExpansionResponse>,
    @InjectRepository(Expansion)
    private readonly expansionRepository: Repository<Expansion>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
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

  async findOne(id: number) {
    return this.surveyRepository.findOne(id);
  }

  async createResponse(surveyId: number, user: User) {
    const survey = await this.surveyRepository.findOne(surveyId, {
      relations: ['expansion'],
    });
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

    const response = await this.responseRepository.findOne({
      id: responseId,
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
    user: User,
    expansionResponseDto: ExpansionResponseDto,
  ) {
    const response = await this.responseRepository.findOne({
      id: responseId,
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
