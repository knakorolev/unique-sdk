import { Module } from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
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
  controllers: [AppController],
  providers: [sdkProvider],
})
export class AppModule {}
