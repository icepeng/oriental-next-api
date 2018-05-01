import {
  MiddlewaresConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../card/card.entity';
import { JwtMiddleware } from '../common/jwt.middleware';
import { Survey } from '../survey/survey.entity';
import { CardResponseService } from './card-response.service';
import { ExpansionResponseService } from './expansion-response.service';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { SurveyResponse } from './survey-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, SurveyResponse, Card])],
  components: [ResponseService, CardResponseService, ExpansionResponseService],
  controllers: [ResponseController],
})
export class ResponseModule implements NestModule {
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
      { path: '/surveys/:surveyId/responses', method: RequestMethod.ALL },
    );
  }
}
