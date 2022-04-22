import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { KeyringPair } from '@polkadot/keyring/types';
import { INestApplication } from '@nestjs/common';

import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import { AppModule } from '../app.module';
import { ExtrinsicsController } from './extrinsics-controller';
import { UnsignedTxPayload } from '@unique-nft/sdk';
import { u8aToHex } from '@polkadot/util';

describe(ExtrinsicsController.name, () => {
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

  describe('/extrinsic/build & /extrinsic/submit', () => {
    it('ok', async () => {
      expect(true).toEqual(true);

      const payloadResponse = await request(app.getHttpServer())
        .post(`/api/extrinsic/build`)
        .send({
          address: alice.address,
          section: 'balances',
          method: 'transfer',
          args: [alice.address, 100000000],
        });

      expect(payloadResponse.ok).toBe(true);

      const { signerPayloadHex, signerPayloadJSON } =
        payloadResponse.body as UnsignedTxPayload;

      const badSignature = u8aToHex(
        alice.sign('not_a_payload_hex', {
          withType: true,
        }),
      );

      const badSubmit = await request(app.getHttpServer())
        .post(`/api/extrinsic/submit`)
        .send({
          signerPayloadJSON,
          signature: badSignature,
        });

      expect(badSubmit.status).toEqual(400);
    });
  });
});
