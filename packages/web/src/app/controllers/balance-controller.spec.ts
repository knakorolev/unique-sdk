import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { KeyringPair } from '@polkadot/keyring/types';
import { INestApplication } from '@nestjs/common';

import { BalanceController } from './balance-controller';
import { GlobalConfigModule } from '../config/config.module';
import { AppModule, sdkProvider } from '../app.module';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';

describe(BalanceController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await waitReady();

    app = testingModule.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
  });

  describe('GET /api/balance', () => {
    it('ok', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/balance`)
        .query({ address: alice.address });

      expect(response.ok).toEqual(true);

      expect(response.body).toMatchObject({
        amount: expect.any(String),
        formatted: expect.any(String),
      });
    });

    it('not ok', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/balance`)
        .query({ address: 'foo' });

      expect(response.ok).toEqual(false);
    });
  });
});
