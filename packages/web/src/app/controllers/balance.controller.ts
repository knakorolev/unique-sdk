import { Controller, Get, Query, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { BalanceRequest, BalanceResponse } from '../dto';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { ApiTags } from '@nestjs/swagger';

@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: BalanceRequest): Promise<BalanceResponse> {
    return await this.sdk.getBalance(args);
  }
}
