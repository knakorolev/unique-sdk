import {
  AnyJson,
  SignerPayloadJSON,
  SignerPayloadRaw,
} from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

export enum SignatureType {
  Sr25519 = 'sr25519',
  Ed25519 = 'ed25519',
  Ecdsa = 'ecdsa',
  Ethereum = 'ethereum',
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
  section: string; // todo section enum
  method: string; // todo method enum
  args: AnyJson[];
  era?: number;
  isImmortal?: boolean;
}

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}

export interface SubmitTxArgs {
  signerPayloadJSON: SignerPayloadJSON;
  signature: HexString;
  signatureType?: SignatureType;
}

export interface SubmitResult {
  hash: HexString;
}
