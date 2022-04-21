import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import {
  ChainPropertiesResponse,
  BalanceRequest,
  BalanceResponse,
  ExtrinsicBuildResponse,
  ExtrinsicBuildRequest,
  ExtrinsicSubmitRequest,
  ExtrinsicSubmitResponse,
} from './dto';

@Controller()
export class AppController {
  constructor(private readonly sdk: Sdk) {}

  @Get('chain_properties')
  async getChainProperties(): Promise<ChainPropertiesResponse> {
    return await this.sdk.getChainProperties();
  }

  @Get('balance')
  async getBalance(@Query() args: BalanceRequest): Promise<BalanceResponse> {
    return await this.sdk.getBalance(args);
  }

  @Post('/extrinsic/build')
  async buildTx(
    @Body() args: ExtrinsicBuildRequest,
  ): Promise<ExtrinsicBuildResponse> {
    return await this.sdk.buildTx(args);
  }

  @Post('/extrinsic/submit')
  async submitTx(
    @Body() args: ExtrinsicSubmitRequest,
  ): Promise<ExtrinsicSubmitResponse> {
    return await this.sdk.submitTx(args);
  }
}
