import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { ExpansionModule } from './expansion/expansion.module';
import { SurveyModule } from './survey/survey.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pinkbean',
      database: 'oriental-next',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CardModule,
    ExpansionModule,
    SurveyModule,
  ],
  controllers: [],
  components: [],
})
export class ApplicationModule {}
