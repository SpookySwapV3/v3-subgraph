/* eslint-disable prefer-const */
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'
import { Bundle, Pool, Token } from './../types/schema'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { exponentToBigDecimal, safeDiv } from '../utils/index'

const WNATIVE_ADDRESS = '0x23181F21DEa5936e24163FFABa4Ea3B316B57f3C'
const PRIMARY_STABLE_WNATIVE_POOL = '0x1d163F8aBA2A8c8cCBFEBea30B93473d7B234E0F' // USDT_T WBTT 03


// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export let WHITELIST_TOKENS: string[] = [
  WNATIVE_ADDRESS, // WETH
  '0xAD9A21FF0c9d854cA8C1360AF28D4fcbDaC53B4F', // FTM_e
  '0x43559B1786C06d6B826e3cf9AA667eD8840f9106', // ADA_b
  '0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006', // ETH
  '0x17F235FD5974318E4E2a5e37919a209f7c37A6d1', // USDD_t
  '0xdB28719F7f938507dBfe4f0eAe55668903D34a15', // USDT_t
  '0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B', // USDT_e
  '0xAE17940943BA9440540940DB0F1877f101D39e8b', // USDC_e
  '0xCa424b845497f7204D9301bd13Ff87C0E2e86FCF', // USDC_b
  '0x9888221fE6B5A2ad4cE7266c7826D2AD74D40CcF', // WBTC__e
  '0xfd3b093aB6bD4F40810f19e5fF822ac8Cc7e3184', // LINK_e
  '0xEdf53026aeA60f8F75FcA25f8830b7e2d6200662', // TRX
  '0x185a4091027E2dB459a2433F85f894dC3013aeB5', // BNB
]

let STABLE_COINS: string[] = [
  '0x17F235FD5974318E4E2a5e37919a209f7c37A6d1', // USDD_t
  '0xdB28719F7f938507dBfe4f0eAe55668903D34a15', // USDT_t
  '0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B', // USDT_e
  '0xAE17940943BA9440540940DB0F1877f101D39e8b', // USDC_e
  '0xCa424b845497f7204D9301bd13Ff87C0E2e86FCF', // USDC_b
]

let MINIMUM_ETH_LOCKED = BigDecimal.fromString('60')

let Q192 = 2 ** 192
export function sqrtPriceX96ToTokenPrices(sqrtPriceX96: BigInt, token0: Token, token1: Token): BigDecimal[] {
  let num = sqrtPriceX96.times(sqrtPriceX96).toBigDecimal()
  let denom = BigDecimal.fromString(Q192.toString())
  let price1 = num
    .div(denom)
    .times(exponentToBigDecimal(token0.decimals))
    .div(exponentToBigDecimal(token1.decimals))

  let price0 = safeDiv(BigDecimal.fromString('1'), price1)
  return [price0, price1]
}

export function getEthPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin
  let usdcPool = Pool.load(PRIMARY_STABLE_WNATIVE_POOL) // dai is token0
  if (usdcPool !== null) {
    return usdcPool.token0Price
  } else {
    return ZERO_BD
  }
}

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WNATIVE_ADDRESS) {
    return ONE_BD
  }
  let whiteList = token.whitelistPools
  // for now just take USD from pool with greatest TVL
  // need to update this to actually detect best rate based on liquidity distribution
  let largestLiquidityETH = ZERO_BD
  let priceSoFar = ZERO_BD
  let bundle = Bundle.load('1')

  // hardcoded fix for incorrect rates
  // if whitelist includes token - get the safe price
  if (STABLE_COINS.includes(token.id)) {
    priceSoFar = safeDiv(ONE_BD, bundle.ethPriceUSD)
  } else {
    for (let i = 0; i < whiteList.length; ++i) {
      let poolAddress = whiteList[i]
      let pool = Pool.load(poolAddress)

      if (pool.liquidity.gt(ZERO_BI)) {
        if (pool.token0 == token.id) {
          // whitelist token is token1
          let token1 = Token.load(pool.token1)
          // get the derived ETH in pool
          let ethLocked = pool.totalValueLockedToken1.times(token1.derivedETH)
          if (ethLocked.gt(largestLiquidityETH) && ethLocked.gt(MINIMUM_ETH_LOCKED)) {
            largestLiquidityETH = ethLocked
            // token1 per our token * Eth per token1
            priceSoFar = pool.token1Price.times(token1.derivedETH as BigDecimal)
          }
        }
        if (pool.token1 == token.id) {
          let token0 = Token.load(pool.token0)
          // get the derived ETH in pool
          let ethLocked = pool.totalValueLockedToken0.times(token0.derivedETH)
          if (ethLocked.gt(largestLiquidityETH) && ethLocked.gt(MINIMUM_ETH_LOCKED)) {
            largestLiquidityETH = ethLocked
            // token0 per our token * ETH per token0
            priceSoFar = pool.token0Price.times(token0.derivedETH as BigDecimal)
          }
        }
      }
    }
  }
  return priceSoFar // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedAmountUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0USD = token0.derivedETH.times(bundle.ethPriceUSD)
  let price1USD = token1.derivedETH.times(bundle.ethPriceUSD)

  // both are whitelist tokens, return sum of both amounts
  if (WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(price0USD).plus(tokenAmount1.times(price1USD))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST_TOKENS.includes(token0.id) && !WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(price0USD).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount1.times(price1USD).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked amount is 0
  return ZERO_BD
}
