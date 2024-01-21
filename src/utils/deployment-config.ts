import {
    Address,
    BigDecimal,
    BigInt,
  } from "@graphprotocol/graph-ts"
import { StaticTokenDefinition } from "./staticTokenDefinition"
import { BTT_FACTORY_ADDRESS, BTT_STABLE_COINS, BTT_STATIC_TOKENS, BTT_WHITELIST_TOKENS, POOL_USDT_T_WBTT_03, WBTT } from "./chainData/bittorrent"
import { FTM_FACTORY_ADDRESS, FTM_STABLE_COINS, FTM_STATIC_TOKENS, FTM_WHITELIST_TOKENS, POOL_TBD_WFTM_03, WFTM } from "./chainData/ftm"
import { EON_FACTORY_ADDRESS, EON_STABLE_COINS, EON_STATIC_TOKENS, EON_WHITELIST_TOKENS, POOL_TBD_WZEN_03, WZEN } from "./chainData/eon"

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
    [BTT_CHAIN_ID]: WBTT,
    [FTM_CHAIN_ID]: WFTM,
    [EON_CHAIN_ID]: WZEN,
 }

const PRIMARY_STABLE_ADDRESS_MAP:AddressMap = {
    [BTT_CHAIN_ID]: POOL_USDT_T_WBTT_03,
    [FTM_CHAIN_ID]: POOL_TBD_WFTM_03,
    [EON_CHAIN_ID]: POOL_TBD_WZEN_03,
}

const STABLE_COIN_MAP = {
    [BTT_CHAIN_ID]: BTT_STABLE_COINS,
    [FTM_CHAIN_ID]: FTM_STABLE_COINS,
    [EON_CHAIN_ID]: EON_STABLE_COINS,
}

const STATIC_TOKENS_MAP = {
    [BTT_CHAIN_ID]: BTT_STATIC_TOKENS,
    [FTM_CHAIN_ID]: FTM_STATIC_TOKENS,
    [EON_CHAIN_ID]: EON_STATIC_TOKENS,
}


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
    [BTT_CHAIN_ID]: BTT_FACTORY_ADDRESS,
    [FTM_CHAIN_ID]: FTM_FACTORY_ADDRESS,
    [EON_CHAIN_ID]: EON_FACTORY_ADDRESS,
}

export const MINIMUM_ETH_LOCKED = BigDecimal.fromString((DEFAULT_ETH_LOCKED * MINIMUM_FACTOR_CHAIN_MAP[DEPLOY_CHAIN_ID]).toString())
export const PRIMARY_STABLE_WNATIVE_POOL = PRIMARY_STABLE_ADDRESS_MAP[DEPLOY_CHAIN_ID]
export const WHITELIST_TOKENS = WHITELIST_TOKENS_MAP[DEPLOY_CHAIN_ID]
export const STABLE_COINS = STABLE_COIN_MAP[DEPLOY_CHAIN_ID]
export const WNATIVE_ADDRESS = WNATIVE_ADDRES_MAP[DEPLOY_CHAIN_ID]
export const FACTORY_ADDRESS = FACTORY_ADDRESS_MAP[DEPLOY_CHAIN_ID]
export const STATIC_TOKENS = STATIC_TOKENS_MAP[DEPLOY_CHAIN_ID]