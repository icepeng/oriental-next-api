import {
  MiddlewaresConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtMiddleware } from '../common/jwt.middleware';
import { Expansion } from '../expansion/expansion.entity';
import { SurveyController } from './survey.controller';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { SurveyResponse } from './survey-response.entity';
import { CardResponse } from './card-response.entity';
import { ExpansionResponse } from './expansion-response.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyResponse,
      CardResponse,
      ExpansionResponse,
      Expansion,
    ]),
  ],
  components: [SurveyService],
  exports: [SurveyService],
  controllers: [SurveyController],
})
export class SurveyModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        { path: '/surveys/:id', method: RequestMethod.ALL },
        { path: '/surveys', method: RequestMethod.ALL },
      );
  }
}
