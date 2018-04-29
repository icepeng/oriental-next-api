import { Component } from '@nestjs/common';
import { Card } from '../card/card.entity';
import { CardResponse } from '../response/card-response.entity';
import { Survey } from '../survey/survey.entity';
import { CardStat } from './card-stat.entity';

@Component()
export class CardStatFactory {
  create(survey: Survey, card: Card, cardResponses: CardResponse[]) {
    const cardStat = new CardStat();
    cardStat.data = this.calculateCardStat(cardResponses);
    cardStat.surveyId = survey.id;
    cardStat.cardId = card.id;
    return cardStat;
  }

  private calculateCardStat(cardResponses: CardResponse[]) {
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
}
