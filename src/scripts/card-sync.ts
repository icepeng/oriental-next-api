import { NestFactory } from '@nestjs/core';

import { ApplicationModule } from '../app.module';
import { CardModule } from '../card/card.module';
import { CardService } from '../card/card.service';
import * as Witchwood from './the-witchwood';
import * as Boomsday from './boomsday-project';

async function cardSync() {
  const app = await NestFactory.create(ApplicationModule);
  const cardService = app.select(CardModule).get(CardService);
  cardService.saveCards('boomsday-project', Boomsday.cards);
}

cardSync();
