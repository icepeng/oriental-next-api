import {
  MiddlewaresConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from '../common/jwt.middleware';
import { Expansion } from '../expansion/expansion.entity';
import { CardController } from './card.controller';
import { Card } from './card.entity';
import { CardService } from './card.service';
import { CardResponse } from '../response/card-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Expansion, CardResponse])],
  components: [CardService],
  controllers: [CardController],
})
export class CardModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        { path: '/cards/:id', method: RequestMethod.ALL },
        { path: '/cards', method: RequestMethod.ALL },
      );
  }
}
