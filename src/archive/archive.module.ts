import {
  MiddlewaresConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from '../common/jwt.middleware';
import { CardResponse } from '../response/card-response.entity';
import { ArchiveController } from './archive.controller';
import { Archive } from './archive.entity';
import { ArchiveService } from './archive.service';

@Module({
  imports: [TypeOrmModule.forFeature([Archive, CardResponse])],
  components: [ArchiveService],
  controllers: [ArchiveController],
})
export class ArchiveModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/archives',
      method: RequestMethod.ALL,
    });
  }
}
