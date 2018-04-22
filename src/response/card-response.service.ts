import {
  BadRequestException,
  Component,
  InternalServerErrorException,
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
import { UserInfo } from '../user/user-info.entity';
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
    @InjectRepository(CardResponse)
    private readonly cardResponseRepository: Repository<CardResponse>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  async savePreRelease(cardResponse: CardResponse) {
    return this.cardResponseRepository.save(cardResponse);
  }

  async saveAfterRelease(user: User, cardResponse: CardResponse) {
    const existing = await this.cardResponseRepository.findOne({
      response: cardResponse.response,
      card: cardResponse.card,
    });
    if (existing) {
      throw new BadRequestException();
    }

    const userInfo = await this.userInfoRepository.findOne({ user });
    if (!userInfo) {
      throw new InternalServerErrorException();
    }

    const responsedCount = await this.cardResponseRepository.count({
      response: cardResponse.response,
    });

    if (responsedCount < MAX_REWARDED_CARD_PER_SURVEY) {
      userInfo.point += POINT_REWARD_CARD;
    }

    await this.userInfoRepository.save(userInfo);
    return this.cardResponseRepository.save(cardResponse);
  }

  async save(
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

    return survey.isPreRelease
      ? this.savePreRelease(cardResponse)
      : this.saveAfterRelease(user, cardResponse);
  }
}
