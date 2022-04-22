import { Module } from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { ConfigService } from '@nestjs/config';

import {
  ChainController,
  BalanceController,
  ExtrinsicsController,
} from './controllers';
import { GlobalConfigModule } from './config/config.module';

export const sdkProvider = {
  inject: [ConfigService],
  provide: Sdk,
  useFactory: async (configService: ConfigService) => {
    const sdk = new Sdk({ chainWsUrl: configService.get('chainWsUrl') });

    await sdk.isReady;

    return sdk;
  },
};

@Module({
  imports: [GlobalConfigModule],
  controllers: [ChainController, BalanceController, ExtrinsicsController],
  providers: [sdkProvider],
})
export class AppModule {}
