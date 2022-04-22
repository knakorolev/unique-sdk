import { ChainProperties } from '@unique-nft/sdk';

export class ChainPropertiesResponse implements ChainProperties {
  /**
   * @example 255
   */
  SS58Prefix: number;

  /**
   * @example 18
   */
  decimals: number;

  /**
   * @example 'QTZ'
   */
  token: string;

  /**
   * @example 'wss://ws-quartz.unique.network'
   */
  wsUrl: string;
}
