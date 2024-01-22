/* eslint-disable prefer-const */
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'
import { Bundle, Pool, Token } from './../types/schema'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { exponentToBigDecimal, safeDiv } from '../utils/index'

export const WNATIVE_ADDRESS = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83'
const PRIMARY_STABLE_WNATIVE_POOL = '0xf6021f2f63ab3bcdddbaf32939cd66a8b9e4c21c' // USDC_LZ_WFTM_03_POOL


// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export let WHITELIST_TOKENS: string[] = [
  WNATIVE_ADDRESS, // WETH
  '0x82f0B8B456c1A451378467398982d4834b6829c1', // MIM
  '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf', // USDC_LZ
  '0xcc1b99dDAc1a33c201a742A1851662E87BC7f22C', // USDT_LZ
  '0xf1648C50d2863f780c57849D812b4B7686031A3D', // BTC_LZ
  '0xdf5C2c48cf3E50417b31Da8aa7B6Afd0Ce30af8A', // WETH_LZ
  '0x1B6382DBDEa11d97f24495C9A90b7c88469134a4', // USDC_AXL
  '0xd226392C23fb3476274ED6759D4a478db3197d82', // USDT_AXL
  '0xD5d5350F42CB484036A1C1aF5F2DF77eAFadcAFF', // DAI_AXL
  '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC_MULTI
  '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI_MULTI
  '0x049d68029688eAbF473097a2fC38ef61633A3C7A', // USDT_MULTI
  '0x321162Cd933E2Be498Cd2267a90534A804051b11', // BTC_MULTI
  '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH_MULTI
  '0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE', // BOO
  '0x29b0Da86e484E1C0029B56e817912d778aC0EC69', //YFI
  '0x56ee926bD8c72B2d5fa1aF4d9E4Cbb515a1E3Adc', //SNX
  '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8', //LINK
  '0x1E4F97b9f9F913c46F1632781732927B9019C68b', //CRV
  '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', //BNB
  '0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7', //TOMB
  '0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355', //FRAX
  '0xC5e2B037D30a390e62180970B3aa4E91868764cD', //TAROT
  '0x468003B688943977e6130F4F68F23aad939a1040', //SPELL
  '0xfB98B335551a418cD0737375a2ea0ded62Ea213b', //MAI
  '0x9879aBDea01a879644185341F7aF7d8343556B7a', //TUSD
  '0x85dec8c4B2680793661bCA91a8F129607571863d', //BRUSH
  '0x40DF1Ae6074C35047BFF66675488Aa2f9f6384F3', //MATIC
]

let STABLE_COINS: string[] = [
  '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf', // USDC_LZ
  '0xcc1b99dDAc1a33c201a742A1851662E87BC7f22C', // USDT_LZ
  '0x1B6382DBDEa11d97f24495C9A90b7c88469134a4', // USDC_AXL
  '0xd226392C23fb3476274ED6759D4a478db3197d82', // USDT_AXL
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
  let usdcPool = Pool.load(PRIMARY_STABLE_WNATIVE_POOL) // USDC_LZ is token1
  if (usdcPool !== null) {
    return usdcPool.token1Price
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
