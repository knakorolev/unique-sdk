import { Controller, Get, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ChainPropertiesResponse } from '../dto';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { ApiTags } from '@nestjs/swagger';

@UseFilters(SdkExceptionsFilter)
@ApiTags('chain')
@Controller('chain')
export class ChainController {
  constructor(private readonly sdk: Sdk) {}

  @Get('properties')
  async getChainProperties(): Promise<ChainPropertiesResponse> {
    return await this.sdk.getChainProperties();
  }
}
