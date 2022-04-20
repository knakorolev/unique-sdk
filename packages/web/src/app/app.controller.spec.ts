import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { KeyringPair } from '@polkadot/keyring/types';
import { INestApplication } from '@nestjs/common';

import { AppController } from './app.controller';
import { GlobalConfigModule } from './config/config.module';
import { sdkProvider } from './app.module';
import { Keyring } from '@polkadot/keyring';

describe('AppController', () => {
  let app: INestApplication;
  let alice: KeyringPair;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [GlobalConfigModule],
      controllers: [AppController],
      providers: [sdkProvider],
    }).compile();

    app = testingModule.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
  });

  describe('first', () => {
    it('GET /api/balance - ok', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/balance?address=${alice.address}`,
      );

      expect(response.ok).toEqual(true);

      expect(response.body).toMatchObject({
        amount: expect.any(String),
        formatted: expect.any(String),
      });
    });

    it('GET /api/balance - not ok', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/balance?address=foo`,
      );

      expect(response.ok).toEqual(false);
    });
  });
});
