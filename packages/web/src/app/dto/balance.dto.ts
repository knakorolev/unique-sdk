import { Balance, GetBalanceArgs } from '@unique-nft/sdk';
export class BalanceDto implements Balance {
  /**
   * @example '411348197000000000000'
   */
  amount: string;

  /**
   * @example '411.3481 QTZ'
   */
  formatted: string;

  // todo see sdk.ts line 50
  // todo formatted: string
  // todo withUnit: string
}

export class GetBalanceArgsDto implements GetBalanceArgs {
  /**
   * @example 'yGEeaYLrnw8aiTFj5QZAmwWRKu6QdxUkaASLCQznuZX2Lyj7q'
   */
  address: string;
}
