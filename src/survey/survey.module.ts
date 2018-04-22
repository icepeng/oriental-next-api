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

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Expansion])],
  components: [SurveyService],
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
