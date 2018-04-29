import { Component, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../card/card.entity';
import { CardResponse } from '../response/card-response.entity';
import { ExpansionResponse } from '../response/expansion-response.entity';
import { Survey } from '../survey/survey.entity';
import { CardStat } from './card-stat.entity';
import { CardStatFactory } from './card-stat.factory';
import { ExpansionStat } from './expansion-stat.entity';
import { ExpansionStatFactory } from './expansion-stat.factory';

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
    private readonly cardStatFactory: CardStatFactory,
    private readonly expansionStatFactory: ExpansionStatFactory,
  ) {}

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

    const cardResponsesByCard = cardResponses.reduce(
      (obj, cardResponse) => {
        const item = obj[cardResponse.cardId] || [];
        return {
          ...obj,
          [cardResponse.cardId]: [...item, cardResponse],
        };
      },
      {} as { [card: string]: CardResponse[] },
    );

    const cardStats = cards.map(card =>
      this.cardStatFactory.create(survey, card, cardResponsesByCard[card.id]),
    );
    const expansionStat = this.expansionStatFactory.create(
      survey,
      expansionResponses,
    );
    await this.cardStatRepository.save(cardStats);
    await this.expansionStatRepository.save(expansionStat);
  }
}
