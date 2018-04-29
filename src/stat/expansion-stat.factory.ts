import { Component } from '@nestjs/common';
import { ExpansionResponse } from '../response/expansion-response.entity';
import { Survey } from '../survey/survey.entity';
import { ExpansionStat } from './expansion-stat.entity';

@Component()
export class ExpansionStatFactory {
  create(survey: Survey, expansionResponses: ExpansionResponse[]) {
    const expansionStat = new ExpansionStat();
    expansionStat.surveyId = survey.id;
    expansionStat.data = this.calculateExpansionStat(expansionResponses);
    return expansionStat;
  }

  private calculateExpansionStat(expansionResponses: ExpansionResponse[]) {
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
}
