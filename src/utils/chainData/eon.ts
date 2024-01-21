
import {
  Address,
  BigInt,
} from "@graphprotocol/graph-ts"
import { StaticTokenDefinition } from "../staticTokenDefinition"

export const WZEN = ''
export const EON_FACTORY_ADDRESS = ''
export const POOL_TBD_WZEN_03 =  ''

export const EON_STABLE_COINS: string[] = [
]

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const EON_WHITELIST_TOKENS: string[] = [
  WZEN, // WNATIVE
...EON_STABLE_COINS,
]

export const EON_STATIC_TOKENS = [
new StaticTokenDefinition(
    Address.fromString(WZEN),
    'WZEN',
    'Wrapped Zen',
    BigInt.fromI32(18)
),
]