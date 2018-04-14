import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from '../app.module';
import { SurveyStatService } from '../survey/stat.service';
import { SurveyModule } from '../survey/survey.module';

async function saveStat() {
  try {
    const app = await NestFactory.create(ApplicationModule);
    const statService = app.select(SurveyModule).get(SurveyStatService);
    await statService.generateStat(2);
  } catch (err) {
    console.error(err);
    return;
  }
}

saveStat();
