import {
    Address,
    BigDecimal,
    BigInt,
  } from "@graphprotocol/graph-ts"
import { StaticTokenDefinition } from "./staticTokenDefinition"

export const DEPLOY_CHAIN_ID = 199

export const BTT_CHAIN_ID = 199
export const FTM_CHAIN_ID = 250
export const EON_CHAIN_ID = 7332

export const SUPPORTED_CHAINS = [
    BTT_CHAIN_ID,
    FTM_CHAIN_ID,
    EON_CHAIN_ID
]

export type SupportedGraphChainIds = (typeof SUPPORTED_CHAINS)[number]
export declare type AddressMap = {
    [chainId in SupportedGraphChainIds]: string;
};

const WNATIVE_ADDRES_MAP:AddressMap = {
    [BTT_CHAIN_ID]: '0x23181F21DEa5936e24163FFABa4Ea3B316B57f3C',
    [FTM_CHAIN_ID]: '',
    [EON_CHAIN_ID]: '',
 }

const PRIMARY_STABLE_ADDRES_MAP:AddressMap = {
    [BTT_CHAIN_ID]: '0x1d163F8aBA2A8c8cCBFEBea30B93473d7B234E0F', // USDT_T WBTT 03
    [FTM_CHAIN_ID]: '',
    [EON_CHAIN_ID]: '',
 }


const BTT_STABLE_COINS: string[] = [
    '0x17F235FD5974318E4E2a5e37919a209f7c37A6d1', // USDD_t
    '0xdB28719F7f938507dBfe4f0eAe55668903D34a15', // USDT_t
    '0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B', // USDT_e
    '0xAE17940943BA9440540940DB0F1877f101D39e8b', // USDC_e
    '0xCa424b845497f7204D9301bd13Ff87C0E2e86FCF', // USDC_b
]

const FTM_STABLE_COINS: string[] = [

]

const EON_STABLE_COINS: string[] = [
]

const STABLE_COIN_MAP = {
    [BTT_CHAIN_ID]: BTT_STABLE_COINS,
    [FTM_CHAIN_ID]: FTM_STABLE_COINS,
    [EON_CHAIN_ID]: EON_STABLE_COINS,
}

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
const BTT_WHITELIST_TOKENS: string[] = [
    WNATIVE_ADDRES_MAP[BTT_CHAIN_ID], // WETH
  ...STABLE_COIN_MAP[BTT_CHAIN_ID],
  '0xAD9A21FF0c9d854cA8C1360AF28D4fcbDaC53B4F', // FTM_e
  '0x43559B1786C06d6B826e3cf9AA667eD8840f9106', // ADA_b
  '0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006', // ETH
  '0x9888221fE6B5A2ad4cE7266c7826D2AD74D40CcF', // WBTC__e
  '0xfd3b093aB6bD4F40810f19e5fF822ac8Cc7e3184', // LINK_e
  '0xEdf53026aeA60f8F75FcA25f8830b7e2d6200662', // TRX
  '0x185a4091027E2dB459a2433F85f894dC3013aeB5', // BNB
]

interface ERC20Fields {
    address: string
    symbol: string
    name: string
    decimals: number
    
}

const BTT_STATIC_TOKENS = [
  new StaticTokenDefinition(
    Address.fromString(WNATIVE_ADDRES_MAP[BTT_CHAIN_ID]),
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

const FTM_STATIC_TOKENS = [
    new StaticTokenDefinition(
        Address.fromString(WNATIVE_ADDRES_MAP[FTM_CHAIN_ID]),
        'WFTM',
        'Wrapped Fantom',
        BigInt.fromI32(18)
    ),
]
const EON_STATIC_TOKEN = [
    new StaticTokenDefinition(
        Address.fromString(WNATIVE_ADDRES_MAP[EON_CHAIN_ID]),
        'WZEN',
        'Wrapped ZEN',
        BigInt.fromI32(18)
    ),
]

const STATIC_TOKENS_MAP = {
    [BTT_CHAIN_ID]: BTT_STATIC_TOKENS,
    [FTM_CHAIN_ID]: FTM_STATIC_TOKENS,
    [EON_CHAIN_ID]: EON_STATIC_TOKEN,
}



const FTM_WHITELIST_TOKENS: string[] = [
    WNATIVE_ADDRES_MAP[FTM_CHAIN_ID], // WFTM
  ...STABLE_COIN_MAP[FTM_CHAIN_ID],
]

const EON_WHITELIST_TOKENS: string[] = [
    WNATIVE_ADDRES_MAP[EON_CHAIN_ID], // WEON
  ...STABLE_COIN_MAP[EON_CHAIN_ID],
]


const WHITELIST_TOKENS_MAP = {
    [BTT_CHAIN_ID]: BTT_WHITELIST_TOKENS,
    [FTM_CHAIN_ID]: FTM_WHITELIST_TOKENS,
    [EON_CHAIN_ID]: EON_WHITELIST_TOKENS,
}


// These Factors are calculated in relation to the eth price
// On eth chain minimum eth locked is 60, eth price ranges however its been around 2500$
// So to calculate the other factors we weight their wnative to correlate to the min lock 
// Expanded rounghly 150K worth of liquidity for minimum eth locked
const MINIMUM_FACTOR_CHAIN_MAP = 
{
    [BTT_CHAIN_ID]: 2500000000,
    [FTM_CHAIN_ID]: 6800,
    [EON_CHAIN_ID]: 300,
}   

const DEFAULT_ETH_LOCKED = 60;


const FACTORY_ADDRESS_MAP: AddressMap = 
{
    [BTT_CHAIN_ID]: '0xE12b00681dD2e90f51d9Edf55CE1A7D171338165',
    [FTM_CHAIN_ID]: '',
    [EON_CHAIN_ID]: '',
}

export const MINIMUM_ETH_LOCKED = BigDecimal.fromString((DEFAULT_ETH_LOCKED * MINIMUM_FACTOR_CHAIN_MAP[DEPLOY_CHAIN_ID]).toString())
export const PRIMARY_STABLE_WNATIVE_POOL = PRIMARY_STABLE_ADDRES_MAP[DEPLOY_CHAIN_ID]
export const WHITELIST_TOKENS = WHITELIST_TOKENS_MAP[DEPLOY_CHAIN_ID]
export const STABLE_COINS = STABLE_COIN_MAP[DEPLOY_CHAIN_ID]
export const WNATIVE_ADDRESS = WNATIVE_ADDRES_MAP[DEPLOY_CHAIN_ID]
export const FACTORY_ADDRESS = FACTORY_ADDRESS_MAP[DEPLOY_CHAIN_ID]
export const STATIC_TOKENS = STATIC_TOKENS_MAP[DEPLOY_CHAIN_ID]