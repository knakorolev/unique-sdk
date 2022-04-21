/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import '@polkadot/api-augment';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { addSwagger } from './app/utils/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api'; // todo to config, do not use as default
  app.setGlobalPrefix(globalPrefix);

  // todo `npm start --with-swagger`? `npm run build:web:swagger`?
  addSwagger(app);

  const port = app.get(ConfigService).get('port');
  await app.listen(port);
  Logger.log(`Application is running on :${port}/${globalPrefix}`);
}

bootstrap();
