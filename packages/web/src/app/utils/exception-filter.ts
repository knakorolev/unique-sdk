import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { BadSignatureError, SdkError } from '@unique-nft/sdk';

@Catch(SdkError)
export class SdkExceptionsFilter extends BaseExceptionFilter {
  catch(exception: SdkError, host: ArgumentsHost) {
    if (exception instanceof BadSignatureError) {
      super.catch(new BadRequestException(exception.message), host);
    } else {
      super.catch(exception, host);
    }
  }
}
