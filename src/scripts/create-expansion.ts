import { NestFactory } from '@nestjs/core';

import { ApplicationModule } from '../app.module';
import { ExpansionModule } from '../expansion/expansion.module';
import { ExpansionService } from '../expansion/expansion.service';

async function createExpansion() {
  const app = await NestFactory.create(ApplicationModule);
  const expansionService = app.select(ExpansionModule).get(ExpansionService);
  expansionService.create({ code: 'boomsday-project' });
}

createExpansion();
