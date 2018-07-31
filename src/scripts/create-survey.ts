import { NestFactory } from '@nestjs/core';

import { ApplicationModule } from '../app.module';
import { SurveyModule } from '../survey/survey.module';
import { SurveyService } from '../survey/survey.service';

async function createSurvey() {
  const app = await NestFactory.create(ApplicationModule);
  const surveyService = app.select(SurveyModule).get(SurveyService);
  surveyService.create({
    expansion: 'boomsday-project',
    startTime: new Date().toISOString(),
    isPreRelease: true,
  });
}

createSurvey();
