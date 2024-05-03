/* eslint-disable prefer-const */
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'
import { Bundle, Pool, Token } from './../types/schema'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { exponentToBigDecimal, safeDiv } from '../utils/index'



export const WNATIVE_ADDRESS = '0xf5cb8652a84329a2016a386206761f455bcedab6'
const PRIMARY_STABLE_WNATIVE_POOL = '0x76b59e4b1145c692ade271edb4f67d813a5568e4' // USDC_LZ_WZEN_03_POOL


// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export let WHITELIST_TOKENS: string[] = [
  WNATIVE_ADDRESS, // WETH
  '0x1d7fb99aed3c365b4def061b7978ce5055dfc1e7', // lzWBTC
  '0x2c2e0b0c643ab9ad03adbe9140627a645e99e054', // lzETH
  '0xdf8dba35962aa0fad7ade0df07501c54ec7c4a89', // lzLINK
  '0x6318374dfb468113e06d3463ec5ed0b6ae0f0982' // lzAVAX

]

let STABLE_COINS: string[] = [
  '0x38c2a6953f86a7453622b1e7103b738239728754', // lzDAI
  '0xcead8ee30e03ae87e5e709617f7fdf180eef9973', // ZUSD
  '0xa167bcab6791304eda9b636c8beec75b3d2829e6', // lzUSDT
  '0xcc44eb064cd32aafeeb2ebb2a47be0b882383b53' // lzUSDC
]

let MINIMUM_ETH_LOCKED = BigDecimal.fromString('100')

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
  let usdcPool = Pool.load(PRIMARY_STABLE_WNATIVE_POOL) // USDC_LZ is token0
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


