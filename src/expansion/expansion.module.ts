import {
  MiddlewaresConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtMiddleware } from '../common/jwt.middleware';
import { ExpansionController } from './expansion.controller';
import { Expansion } from './expansion.entity';
import { ExpansionService } from './expansion.service';
import { ExpansionResponse } from '../response/expansion-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expansion, ExpansionResponse])],
  components: [ExpansionService],
  exports: [ExpansionService],
  controllers: [ExpansionController],
})
export class ExpansionModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/expansions/:id', method: RequestMethod.ALL });
  }
}
