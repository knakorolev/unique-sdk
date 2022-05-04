import type { Option, bool } from '@polkadot/types-codec';
import type { INumber } from '@polkadot/types-codec/types';
import { UpDataStructsSponsoringRateLimit } from '@unique-nft/types/unique/types';

export function toNumber(input: Option<INumber>): number | undefined {
  return input.unwrapOr(undefined)?.toNumber();
}

export function toBoolean(input: Option<bool>): boolean | undefined {
  return input.unwrapOr(undefined)?.toHuman();
}

export function sponsoredDataRateLimitToNumber(
  input: Option<UpDataStructsSponsoringRateLimit>,
): number | undefined {
  const sponsoringRateLimit = input.unwrapOr(undefined);

  return sponsoringRateLimit && sponsoringRateLimit.isBlocks
    ? sponsoringRateLimit.asBlocks.toNumber()
    : undefined;
}
