import {
  UpDataStructsCollectionLimits,
  UpDataStructsCreateCollectionData,
  UpDataStructsSponsorshipState,
} from '@unique-nft/types/unique/types';
import { Registry } from '@polkadot/types/types';
import { UpDataStructsCollection } from '@unique-nft/types/unique';
import { objectSpread } from '@polkadot/util';
import type {
  CollectionInfo,
  CollectionLimits,
  CollectionSponsorship,
} from '../types';
import {
  sponsoredDataRateLimitToNumber,
  toBoolean,
  toNumber,
} from './option.utils';
import {
  bytesToString,
  utf16ToString,
  stringToUTF16,
  bytesToJson,
} from './string.utils';

export function decodeCollectionSponsorship(
  sponsorship: UpDataStructsSponsorshipState,
): CollectionSponsorship | undefined {
  return sponsorship.isDisabled
    ? undefined
    : {
        address: sponsorship.value.toString(),
        isConfirmed: sponsorship.isConfirmed,
      };
}

export function decodeCollectionLimits(
  limits: UpDataStructsCollectionLimits,
): CollectionLimits {
  return {
    accountTokenOwnershipLimit: toNumber(limits.accountTokenOwnershipLimit),
    sponsoredDataSize: toNumber(limits.sponsoredDataSize),
    sponsoredDataRateLimit: sponsoredDataRateLimitToNumber(
      limits.sponsoredDataRateLimit,
    ),
    tokenLimit: toNumber(limits.tokenLimit),
    sponsorTransferTimeout: toNumber(limits.sponsorTransferTimeout),
    sponsorApproveTimeout: toNumber(limits.sponsorApproveTimeout),
    ownerCanTransfer: toBoolean(limits.ownerCanTransfer),
    ownerCanDestroy: toBoolean(limits.ownerCanDestroy),
    transfersEnabled: toBoolean(limits.transfersEnabled),
  };
}

export function decodeCollection(
  id: number,
  collection: UpDataStructsCollection,
): CollectionInfo {
  return {
    id,
    mode: collection.mode.type,
    access: collection.access.type,
    name: utf16ToString(collection.name),
    description: utf16ToString(collection.description),
    tokenPrefix: bytesToString(collection.tokenPrefix),
    mintMode: collection.mintMode.toHuman(),
    offchainSchema: bytesToString(collection.offchainSchema),
    constOnChainSchema: bytesToJson(collection.constOnChainSchema),
    variableOnChainSchema: bytesToJson(collection.variableOnChainSchema),
    schemaVersion: collection.schemaVersion.type,
    sponsorship: decodeCollectionSponsorship(collection.sponsorship),
    metaUpdatePermission: collection.metaUpdatePermission.type,
    owner: collection.owner.toString(),
    limits: decodeCollectionLimits(collection.limits),
  };
}

export function encodeCollection(
  registry: Registry,
  collectionInfo: Partial<CollectionInfo>,
): UpDataStructsCreateCollectionData {
  const params = objectSpread(
    {},
    collectionInfo,
    collectionInfo.name ? { name: stringToUTF16(collectionInfo.name) } : {},
    collectionInfo.description
      ? { name: stringToUTF16(collectionInfo.description) }
      : {},
    collectionInfo.tokenPrefix
      ? { name: stringToUTF16(collectionInfo.tokenPrefix) }
      : {},
  );

  return registry.createType<UpDataStructsCreateCollectionData>(
    'UpDataStructsCreateCollectionData',
    params,
  );
}
