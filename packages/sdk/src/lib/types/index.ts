import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

export { HexString } from '@polkadot/util/types';
export { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

export interface SdkOptions {
  chainWsUrl: string;
}

export interface ChainProperties {
  SS58Prefix: number;
  token: string;
  decimals: number;
  wsUrl: string;
}

export interface GetBalanceArgs {
  address: string;
}

export interface Balance {
  amount: string;
  formatted: string;
}

export interface TxBuildArgs {
  address: string;
  section: string;
  method: string;
  args: any[];
  era?: number;
  isImmortal?: boolean;
}

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}

export enum SignatureType {
  sr25519 = 'sr25519',
  ed25519 = 'ed25519',
  ecdsa = 'ecdsa',
  ethereum = 'ethereum',
}

export interface SubmitTxArgs {
  signerPayloadJSON: SignerPayloadJSON;
  signature: HexString;
  signatureType?: SignatureType;
}

export interface SubmitResult {
  hash: HexString;
}
