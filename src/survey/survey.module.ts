import {
  MiddlewaresConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../card/card.entity';
import { JwtMiddleware } from '../common/jwt.middleware';
import { Expansion } from '../expansion/expansion.entity';
import { CardResponse } from './card-response.entity';
import { ExpansionResponse } from './expansion-response.entity';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { SurveyResponse } from './survey-response.entity';
import { SurveyController } from './survey.controller';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyResponse,
      CardResponse,
      ExpansionResponse,
      Expansion,
      Card,
    ]),
  ],
  components: [SurveyService, ResponseService],
  controllers: [SurveyController, ResponseController],
})
export class SurveyModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(
      {
        path: '/surveys/:surveyId/responses/:id/card-responses',
        method: RequestMethod.ALL,
      },
      {
        path: '/surveys/:surveyId/responses/:id/expansion-response',
        method: RequestMethod.ALL,
      },
      { path: '/surveys/:surveyId/responses/:id', method: RequestMethod.POST },
      { path: '/surveys/:id/responses', method: RequestMethod.ALL },
      { path: '/surveys/:id', method: RequestMethod.ALL },
      { path: '/surveys', method: RequestMethod.ALL },
    );
  }
}
