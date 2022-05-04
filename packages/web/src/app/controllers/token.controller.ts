import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ExtrinsicBuildResponse, TokenGetRequest } from '../dto';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { ApiTags } from '@nestjs/swagger';
import {
  BurnTokenRequest,
  CreateTokenRequest,
  TransferTokenRequest,
} from '../dto/token.dto';

@UseFilters(SdkExceptionsFilter)
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getToken(@Query() args: TokenGetRequest): Promise<any> {
    return this.sdk.query.token(args);
  }

  @Post()
  async createToken(
    @Body() args: CreateTokenRequest,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.collection.create(args);
  }

  @Delete()
  async burnToken(
    @Body() args: BurnTokenRequest,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.token.burn(args);
  }

  @Patch('transfer')
  async transferToken(
    @Body() args: TransferTokenRequest,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.token.transfer(args);
  }
}
