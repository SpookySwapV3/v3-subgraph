
import {
    Address,
    BigInt,
  } from "@graphprotocol/graph-ts"
import { StaticTokenDefinition } from "../staticTokenDefinition"

export const WFTM = ''
export const FTM_FACTORY_ADDRESS = ''
export const POOL_TBD_WFTM_03 =  ''


export const FTM_STABLE_COINS: string[] = [
]

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const FTM_WHITELIST_TOKENS: string[] = [
    WFTM, // WNATIVE
  ...FTM_STABLE_COINS,
]

export const FTM_STATIC_TOKENS = [
  new StaticTokenDefinition(
      Address.fromString(WFTM),
      'WFTM',
      'Wrapped Fantom',
      BigInt.fromI32(18)
  ),
]