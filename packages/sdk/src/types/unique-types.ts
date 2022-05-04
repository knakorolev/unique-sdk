import { AnyJson } from '@polkadot/types/types';
import { INamespace } from 'protobufjs';

export enum CollectionMode {
  Nft = 'Nft',
  Fungible = 'Fungible',
  ReFungible = 'ReFungible',
}

export enum CollectionAccess {
  Normal = 'Normal',
  AllowList = 'AllowList',
}

export enum CollectionSchemaVersion {
  ImageURL = 'ImageURL',
  Unique = 'Unique',
}

export interface CollectionSponsorship {
  address: string;
  isConfirmed: boolean;
}

export interface CollectionLimits {
  accountTokenOwnershipLimit?: number;
  sponsoredDataSize?: number;
  sponsoredDataRateLimit?: number;
  tokenLimit?: number;
  sponsorTransferTimeout?: number;
  sponsorApproveTimeout?: number;
  ownerCanTransfer?: boolean;
  ownerCanDestroy?: boolean;
  transfersEnabled?: boolean;
}

export interface CollectionInfo {
  id: number;
  owner: string;
  mode: CollectionMode | `${CollectionMode}`;
  access: CollectionAccess | `${CollectionAccess}`;
  schemaVersion: CollectionSchemaVersion | `${CollectionSchemaVersion}`;
  name: string;
  description: string;
  tokenPrefix: string;
  mintMode: boolean;
  offchainSchema: string;
  sponsorship?: CollectionSponsorship;
  limits: CollectionLimits;
  constOnChainSchema?: INamespace;
  variableOnChainSchema?: AnyJson;
  metaUpdatePermission: string;
}

export interface TokenInfo {
  id: number;
  collectionId: number;
  url: string;
  constData: any;
  variableData: string;
  owner: string;
}
