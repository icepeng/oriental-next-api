import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { ExpansionModule } from './expansion/expansion.module';
import { ResponseModule } from './response/response.module';
import { StatModule } from './stat/stat.module';
import { SurveyModule } from './survey/survey.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    CardModule,
    ExpansionModule,
    SurveyModule,
    ResponseModule,
    StatModule,
  ],
  controllers: [],
  components: [],
})
export class ApplicationModule {}
