import {
  BadRequestException,
  Component,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../card/card.entity';
import {
  MAX_REWARDED_CARD_PER_SURVEY,
  POINT_REWARD_CARD,
} from '../common/config';
import { Survey } from '../survey/survey.entity';
import { User } from '../user/user.entity';
import { CardResponse } from './card-response.entity';
import { CardResponseDto } from './dto/create-response.dto';
import { SurveyResponse } from './survey-response.entity';

@Component()
export class CardResponseService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponse)
    private readonly responseRepository: Repository<SurveyResponse>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(CardResponse)
    private readonly cardResponseRepository: Repository<CardResponse>,
  ) {}

  isRewardRequired(survey: Survey, response: SurveyResponse) {
    return (
      !survey.isPreRelease &&
      response.cardResponses.length <= MAX_REWARDED_CARD_PER_SURVEY
    );
  }

  async save(
    responseId: number,
    surveyId: number,
    user: User,
    cardResponseDto: CardResponseDto,
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
      { relations: ['cardResponses'] },
    );
    if (!response) {
      throw new NotFoundException();
    }

    const card = await this.cardRepository.findOne({
      expansionCode: survey.expansionCode,
      id: cardResponseDto.card,
    });
    if (!card) {
      throw new BadRequestException();
    }

    const existing = response.cardResponses.find(x => x.cardId === card.id);
    if (existing) {
      existing.generality = cardResponseDto.generality;
      existing.power = cardResponseDto.power;
      existing.description = cardResponseDto.description;
    } else {
      const cardResponse = this.cardResponseRepository.create({
        ...cardResponseDto,
        card,
      });
      response.cardResponses.push(cardResponse);
      if (this.isRewardRequired(survey, response)) {
        user.point += POINT_REWARD_CARD;
      }
    }

    return this.responseRepository.manager.save<[SurveyResponse, User]>([
      // TODO: change to entityManager after nest v5
      response,
      user,
    ]);
  }
}
