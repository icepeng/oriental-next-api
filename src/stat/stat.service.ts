import { Component, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../card/card.entity';
import { CardResponse } from '../response/card-response.entity';
import { ExpansionResponse } from '../response/expansion-response.entity';
import { Survey } from '../survey/survey.entity';
import { CardStat } from './card-stat.entity';
import { ExpansionStat } from './expansion-stat.entity';

@Component()
export class StatService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(CardResponse)
    private readonly cardResponseRepository: Repository<CardResponse>,
    @InjectRepository(ExpansionResponse)
    private readonly expansionResponseRepository: Repository<ExpansionResponse>,
    @InjectRepository(CardStat)
    private readonly cardStatRepository: Repository<CardStat>,
    @InjectRepository(ExpansionStat)
    private readonly expansionStatRepository: Repository<ExpansionStat>,
  ) {}

  calculateCardStat(cardResponses: CardResponse[]) {
    const power = [20, 40, 60, 80].map(
      value =>
        cardResponses.filter(cardResponse => cardResponse.power === value)
          .length,
    );
    const generality = [20, 40, 60, 80].map(
      value =>
        cardResponses.filter(cardResponse => cardResponse.generality === value)
          .length,
    );
    const responseCount = cardResponses.length;
    return {
      power,
      generality,
      responseCount,
    };
  }

  calculateExpansionStat(expansionResponses: ExpansionResponse[]) {
    const fun = [20, 40, 60, 80].map(
      value =>
        expansionResponses.filter(
          expansionResponse => expansionResponse.fun === value,
        ).length,
    );
    const balance = [20, 40, 60, 80].map(
      value =>
        expansionResponses.filter(
          expansionResponse => expansionResponse.balance === value,
        ).length,
    );
    const responseCount = expansionResponses.length;
    return {
      fun,
      balance,
      responseCount,
    };
  }

  getCardStats(survey: Survey, cards: Card[], cardResponses: CardResponse[]) {
    const cardResponsesByCard = Object.entries(
      cardResponses.reduce(
        (obj, cardResponse) => {
          const item = obj[cardResponse.cardId] || [];
          return {
            ...obj,
            [cardResponse.cardId]: [...item, cardResponse],
          };
        },
        {} as { [card: string]: CardResponse[] },
      ),
    );
    const cardMap = cards.reduce(
      (obj, card) => ({ ...obj, [card.id]: card }),
      {} as { [id: string]: Card },
    );
    return cardResponsesByCard.map(item => {
      return {
        card: cardMap[item[0]],
        survey,
        data: this.calculateCardStat(item[1]),
      };
    });
  }

  getExpansionStat(survey: Survey, expansionResponses: ExpansionResponse[]) {
    return {
      survey,
      data: this.calculateExpansionStat(expansionResponses),
    };
  }

  async generateStat(id: number) {
    const survey = await this.surveyRepository.findOne(id);
    if (!survey) {
      throw new NotFoundException();
    }
    const cards = await this.cardRepository
      .createQueryBuilder('card')
      .leftJoin('card.expansion', 'expansion')
      .leftJoin('expansion.surveys', 'survey')
      .where('survey.id = :id', { id })
      .getMany();

    const cardResponses = await this.cardResponseRepository
      .createQueryBuilder('cardResponse')
      .leftJoin('cardResponse.response', 'response')
      .leftJoin('response.survey', 'survey')
      .where('survey.id = :id', { id })
      .getMany();

    const expansionResponses = await this.expansionResponseRepository
      .createQueryBuilder('expansionResponse')
      .leftJoin('expansionResponse.response', 'response')
      .leftJoin('response.survey', 'survey')
      .where('survey.id = :id', { id })
      .getMany();

    const cardStats = this.cardStatRepository.create(
      this.getCardStats(survey, cards, cardResponses),
    );
    const expansionStat = this.expansionStatRepository.create(
      this.getExpansionStat(survey, expansionResponses),
    );
    await this.cardStatRepository.save(cardStats);
    await this.expansionStatRepository.save(expansionStat);
  }
}
