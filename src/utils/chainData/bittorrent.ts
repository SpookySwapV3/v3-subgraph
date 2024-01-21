
import {
    Address,
    BigInt,
  } from "@graphprotocol/graph-ts"
import { StaticTokenDefinition } from "../staticTokenDefinition"

export const WBTT = '0x23181F21DEa5936e24163FFABa4Ea3B316B57f3C'
export const POOL_USDT_T_WBTT_03 =  '0x1d163F8aBA2A8c8cCBFEBea30B93473d7B234E0F' // USDT_T WBTT 03
export const BTT_FACTORY_ADDRESS = '0xE12b00681dD2e90f51d9Edf55CE1A7D171338165'

export const BTT_STABLE_COINS: string[] = [
    '0x17F235FD5974318E4E2a5e37919a209f7c37A6d1', // USDD_t
    '0xdB28719F7f938507dBfe4f0eAe55668903D34a15', // USDT_t
    '0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B', // USDT_e
    '0xAE17940943BA9440540940DB0F1877f101D39e8b', // USDC_e
    '0xCa424b845497f7204D9301bd13Ff87C0E2e86FCF', // USDC_b
]

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const BTT_WHITELIST_TOKENS: string[] = [
    WBTT, // WNATIVE
  ...BTT_STABLE_COINS,
  '0xAD9A21FF0c9d854cA8C1360AF28D4fcbDaC53B4F', // FTM_e
  '0x43559B1786C06d6B826e3cf9AA667eD8840f9106', // ADA_b
  '0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006', // ETH
  '0x9888221fE6B5A2ad4cE7266c7826D2AD74D40CcF', // WBTC__e
  '0xfd3b093aB6bD4F40810f19e5fF822ac8Cc7e3184', // LINK_e
  '0xEdf53026aeA60f8F75FcA25f8830b7e2d6200662', // TRX
  '0x185a4091027E2dB459a2433F85f894dC3013aeB5', // BNB
]

export const BTT_STATIC_TOKENS = [
    new StaticTokenDefinition(
      Address.fromString(WBTT),
      'WBTT',
      'Wrapped Bittorrent',
      BigInt.fromI32(18)
    ),
    new StaticTokenDefinition(
      Address.fromString('0xAE17940943BA9440540940DB0F1877f101D39e8b'),
      'USDC_e',
      'USD Coin (ETH)',
      BigInt.fromI32(6)
    ),
    new StaticTokenDefinition(
      Address.fromString('0x9888221fE6B5A2ad4cE7266c7826D2AD74D40CcF'),
      'WBTC',
      'Wrapped Bitcoin',
      BigInt.fromI32(8)
    )
  ]
  