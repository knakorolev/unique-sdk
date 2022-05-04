import {
  AddressArg,
  Balance,
  ChainProperties,
  CollectionIdArg,
  CollectionInfo,
  ISdkQuery,
  SdkOptions,
  TokenIdArg,
  TokenInfo,
} from '@unique-nft/sdk';
import { ApiPromise } from '@polkadot/api';
import { decodeCollection } from '../utils/collection-transformers';
import { formatBalance } from '@polkadot/util';
import { Option } from '@polkadot/types-codec';
import { PalletNonfungibleItemData } from '@unique-nft/types';
import { deserializeConstData } from '../utils/protobuf.utils';
import { INamespace } from 'protobufjs';

export class SkdQuery implements ISdkQuery {
  constructor(readonly options: SdkOptions, readonly api: ApiPromise) {}

  chainProperties(): ChainProperties {
    return {
      SS58Prefix: this.api.registry.chainSS58 || 0,
      token: this.api.registry.chainTokens[0],
      decimals: this.api.registry.chainDecimals[0],
      wsUrl: this.options.chainWsUrl,
    };
  }

  async balance({ address }: AddressArg): Promise<Balance> {
    // todo `get`: this.api[section][method]?
    // todo getBalance(address) { this.get('balances', 'all', address);
    const { availableBalance } = await this.api.derive.balances.all(address);

    return {
      amount: availableBalance.toBigInt().toString(),
      formatted: formatBalance(availableBalance, {
        decimals: this.api.registry.chainDecimals[0],
        withUnit: this.api.registry.chainTokens[0],
      }),
      // todo formatted -> formatted, withUnit, as number?
    };
  }

  async collection({
    collectionId,
  }: CollectionIdArg): Promise<CollectionInfo | undefined> {
    const collectionOption = await this.api.rpc.unique.collectionById(
      collectionId,
    );
    const collection = collectionOption.unwrapOr(undefined);

    if (collection === undefined) return collection;

    return decodeCollection(collectionId, collection);
  }

  async token({
    collectionId,
    tokenId,
  }: TokenIdArg): Promise<TokenInfo | undefined> {
    const collection = await this.collection({ collectionId });

    if (!collection) return;
    const { offchainSchema, constOnChainSchema } = collection;

    const tokenDataOption: Option<PalletNonfungibleItemData> =
      await this.api.query.nonfungible.tokenData(collectionId, tokenId);

    const tokenData = tokenDataOption.unwrapOr(undefined);

    if (!tokenData) return undefined;

    const { constData, variableData, owner } = tokenData;

    return {
      url: offchainSchema.replace('{id}', tokenId.toString()),
      constData: deserializeConstData({
        schema: constOnChainSchema as INamespace,
        buffer: constData,
      }),
      variableData: variableData.toString(),
      owner: owner.value.toString(),
    } as any;
  }
}
