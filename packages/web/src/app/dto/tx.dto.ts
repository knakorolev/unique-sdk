import {
  UnsignedTxPayload,
  HexString,
  SignerPayloadRaw,
  SignerPayloadJSON,
  TxBuildArgs,
  SubmitTxArgs,
  SubmitResult,
  SignatureType,
} from '@unique-nft/sdk';
import { ApiProperty } from '@nestjs/swagger';

export class SignerPayloadJSONDto implements SignerPayloadJSON {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  address: string;
  /**
   * @description The checkpoint hash of the block, in hex
   */
  blockHash: string;
  /**
   * @description The checkpoint block number, in hex
   */
  blockNumber: string;
  /**
   * @description The era for this transaction, in hex
   */
  era: string;
  /**
   * @description The genesis hash of the chain, in hex
   */
  genesisHash: string;
  /**
   * @description The encoded method (with arguments) in hex
   */
  method: string;
  /**
   * @description The nonce for this transaction, in hex
   */
  nonce: string;
  /**
   * @description The current spec version for the runtime
   */
  specVersion: string;
  /**
   * @description The tip for this transaction, in hex
   */
  tip: string;
  /**
   * @description The current transaction version for the runtime
   */
  transactionVersion: string;
  /**
   * @description The applicable signed extensions for this runtime
   */
  signedExtensions: string[];
  /**
   * @description The version of the extrinsic we are dealing with
   */
  version: number;
}
export class BuildTxDto implements TxBuildArgs {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  address: string;

  /**
   * @example 'balances'
   */
  section: string;

  /**
   * @example 'transfer'
   */
  method: string;

  /**
   * @example ['yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK', 100000000]
   */
  args: Array<string | number | Record<string, string | number>>; // todo Oo ArgType? see packages/sdk/src/lib/types/index.ts line 31

  /**
   * @example '64'
   */
  era: number;

  /**
   * @example 'false'
   */
  isImmortal: boolean;
}

export class SignerPayloadRawDto implements SignerPayloadRaw {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  address: string;
  /**
   * @description The hex-encoded data for this request
   */
  data: string;
  /**
   * @description The type of the contained data
   */
  type: 'bytes' | 'payload';
}

export class UnsignedTxPayloadDto implements UnsignedTxPayload {
  @ApiProperty({ type: String })
  signerPayloadHex: HexString;

  signerPayloadJSON: SignerPayloadJSONDto;

  signerPayloadRaw: SignerPayloadRawDto;
}

export class SubmitTxArgsDto implements SubmitTxArgs {
  @ApiProperty({ type: String })
  signature: HexString;

  @ApiProperty({ enum: SignatureType })
  signatureType?: SignatureType;

  signerPayloadJSON: SignerPayloadJSONDto;
}

export class SubmitResultDto implements SubmitResult {
  @ApiProperty({ type: String })
  hash: HexString;
}
