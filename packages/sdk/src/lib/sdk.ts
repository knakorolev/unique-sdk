import '@polkadot/api-augment/polkadot';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { SignerPayload, ExtrinsicEra } from '@polkadot/types/interfaces';
import { SignatureOptions } from '@polkadot/types/types/extrinsic';
import { formatBalance, objectSpread } from '@polkadot/util';
import {
  SdkOptions,
  ChainProperties,
  Balance,
  GetBalanceArgs,
  UnsignedTxPayload,
  TxBuildArgs,
  SubmitTxArgs,
  SubmitResult,
} from './types';
import { getSignerPayloadHex, verifyTxSignature } from './helpers';

export class Sdk {
  private readonly api: ApiPromise;
  readonly isReady: Promise<boolean>;

  constructor(private readonly options: SdkOptions) {
    const provider = new WsProvider(this.options.chainWsUrl);

    this.api = new ApiPromise({ provider });
    this.isReady = this.api.isReadyOrError
      .catch(() => {
        // ignore
      })
      .then(() => {
        console.log(`connected to ${this.options.chainWsUrl}`);

        return true;
      });
  }

  async getBalance({ address }: GetBalanceArgs): Promise<Balance> {
    const { availableBalance } = await this.api.derive.balances.all(address);

    return {
      amount: availableBalance.toBigInt().toString(),
      formatted: formatBalance(availableBalance, {
        decimals: this.api.registry.chainDecimals[0],
        withUnit: this.api.registry.chainTokens[0],
      }),
    };
  }

  async getChainProperties(): Promise<ChainProperties> {
    return {
      SS58Prefix: this.api.registry.chainSS58 || 0,
      token: this.api.registry.chainTokens[0],
      decimals: this.api.registry.chainDecimals[0],
      wsUrl: this.options.chainWsUrl,
    };
  }

  async buildTx(buildArgs: TxBuildArgs): Promise<UnsignedTxPayload> {
    const { address, section, method, args } = buildArgs;

    const signingInfo = await this.api.derive.tx.signingInfo(
      address,
      undefined,
      buildArgs.isImmortal ? 0 : undefined
    );

    const { nonce, header, mortalLength } = signingInfo;
    const extrinsicEra = !buildArgs.isImmortal
      ? this.api.registry.createTypeUnsafe<ExtrinsicEra>('ExtrinsicEra', [
          {
            current: header!.number,
            period: buildArgs.era || mortalLength,
          },
        ])
      : undefined;

    const blockHash = buildArgs.isImmortal
      ? this.api.genesisHash
      : header!.hash;

    const tx = this.api.tx[section][method](...args);

    const signatureOptions: SignatureOptions = {
      blockHash,
      era: extrinsicEra,
      genesisHash: this.api.genesisHash,
      nonce,
      runtimeVersion: this.api.runtimeVersion,
      signedExtensions: this.api.registry.signedExtensions,
    };

    const signerPayload = this.api.registry.createTypeUnsafe<SignerPayload>(
      'SignerPayload',
      [
        objectSpread({}, signatureOptions, {
          address,
          blockNumber: header ? header.number : 0,
          method: tx.method,
          version: tx.version,
        }),
      ]
    );

    const signerPayloadRaw = signerPayload.toRaw();

    return {
      signerPayloadJSON: signerPayload.toPayload(),
      signerPayloadRaw,
      signerPayloadHex: getSignerPayloadHex(this.api, signerPayloadRaw),
    };
  }

  async submitTx(args: SubmitTxArgs): Promise<SubmitResult> {
    const { signerPayloadJSON, signature, signatureType } = args;
    const { method, version, address } = signerPayloadJSON;

    const signatureWithType = signatureType
      ? this.api.registry
          .createType('ExtrinsicSignature', { [signatureType]: signature })
          .toHex()
      : signature;

    console.log(signatureWithType, 'signatureWithType');
    console.log(signature, 'signature');

    const isValid = verifyTxSignature(this.api, signerPayloadJSON, signature);

    console.log('isValid ', isValid);

    if (!isValid) throw new Error('Bad signature');

    const extrinsic = this.api.registry.createType('Extrinsic', {
      method,
      version,
    });

    extrinsic.addSignature(address, signatureWithType, signerPayloadJSON);

    const hash = await this.api.rpc.author.submitExtrinsic(extrinsic);

    console.log(hash.toHex(), 'hash');
    return { hash: hash.toHex() };
  }
}
