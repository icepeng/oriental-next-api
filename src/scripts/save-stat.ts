import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from '../app.module';
import { StatModule } from '../stat/stat.module';
import { StatService } from '../stat/stat.service';

async function saveStat() {
  try {
    const app = await NestFactory.create(ApplicationModule);
    const statService = app.select(StatModule).get(StatService);
    await statService.generateStat(2);
  } catch (err) {
    console.error(err);
    return;
  }
}

saveStat();
