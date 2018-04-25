import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as consolidate from 'consolidate';
import * as cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

import { ApplicationModule } from './app.module';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/server.key', 'utf-8'),
    cert: fs.readFileSync('./secrets/server.crt', 'utf-8'),
  };

  const server = express();
  const app = await NestFactory.create(ApplicationModule, server, {});
  app.set('views', path.join(__dirname, '../view'));
  server.engine('html', consolidate.mustache);
  app.set('view engine', 'html');
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1');
  await app.init();

  http.createServer(server).listen(3001);
  https.createServer(httpsOptions, server).listen(3002);
}
bootstrap();
