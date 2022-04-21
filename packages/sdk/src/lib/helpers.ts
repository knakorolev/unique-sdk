import { ApiPromise } from '@polkadot/api';
import {
  SignerPayloadRaw,
  SignerPayloadJSON,
} from '@polkadot/types/types/extrinsic';
import { HexString } from '@polkadot/util/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';

// todo helper per file? helpers as @unique-nft/sdk/helpers ... @unique-nft/sdk/helpers/get_signer_payload_hex ...
export const getSignerPayloadHex = (
  api: ApiPromise,
  signerPayloadRaw: SignerPayloadRaw,
): HexString => {
  const rawPayloadDataU8a = hexToU8a(signerPayloadRaw.data);

  if (rawPayloadDataU8a.length > 256) {
    const payloadHash = api.registry.hash(rawPayloadDataU8a);

    return u8aToHex(payloadHash);
  }

  return signerPayloadRaw.data as HexString;
};

export const getSignerPayloadRaw = (
  api: ApiPromise,
  signerPayloadJSON: SignerPayloadJSON,
): SignerPayloadRaw => {
  const rawPayloadDataU8a = api.registry
    .createType('ExtrinsicPayload', signerPayloadJSON, {
      version: signerPayloadJSON.version,
    })
    .toU8a({ method: true });

  return {
    address: signerPayloadJSON.address,
    data: u8aToHex(rawPayloadDataU8a),
    type: 'payload',
  };
};

export const verifyTxSignature = (
  api: ApiPromise,
  signerPayloadJSON: SignerPayloadJSON,
  signature: HexString,
): boolean => {
  const signerPayloadRaw = getSignerPayloadRaw(api, signerPayloadJSON);
  const signerPayloadHex = getSignerPayloadHex(api, signerPayloadRaw);

  try {
    const verifyResult = signatureVerify(
      signerPayloadHex,
      signature,
      signerPayloadJSON.address,
    );

    return verifyResult.isValid;
  } catch (error) {
    console.error(error);

    return false;
  }
};
