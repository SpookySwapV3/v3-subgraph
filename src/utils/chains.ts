import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  ARBITRUM_ONE = 42161,
  AVALANCHE = 43114,
  BASE = 8453,
  BLAST_MAINNET = 81457,
  BSC = 56,
  CELO = 42220,
  MAINNET = 1,
  MATIC = 137,
  OPTIMISM = 10,
  ZKSYNC_ERA = 324,
  SONIC = 64165,
}

// subgraph does not support string enums, hence these constants
const SONIC_TEST_NETWORK_NAME = 'sonic'

// Note: All token and pool addresses should be lowercased!
export class SubgraphConfig {
  // deployment address
  // e.g. https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments
  factoryAddress: string

  // the address of a pool where one token is a stablecoin and the other is a
  // token that tracks the price of the native token use this to calculate the
  // price of the native token, so prefer a pool with highest liquidity
  stablecoinWrappedNativePoolAddress: string

  // true is stablecoin is token0, false if stablecoin is token1
  stablecoinIsToken0: boolean

  // the address of a token that tracks the price of the native token, most of
  // the time, this is a wrapped asset but could also be the native token itself
  // for some chains
  wrappedNativeAddress: string

  // the mimimum liquidity in a pool needed for it to be used to help calculate
  // token prices. for new chains, this should be initialized to ~4000 USD
  minimumNativeLocked: BigDecimal

  // list of stablecoin addresses
  stablecoinAddresses: string[]

  // a token must be in a pool with one of these tokens in order to derive a
  // price (in addition to passing the minimumEthLocked check). This is also
  // used to determine whether volume is tracked or not.
  whitelistTokens: string[]

  // token overrides are used to override RPC calls for the symbol, name, and
  // decimals for tokens. for new chains this is typically empty.
  tokenOverrides: StaticTokenDefinition[]

  // skip the creation of these pools in handlePoolCreated. for new chains this is typically empty.
  poolsToSkip: string[]

  // initialize this list of pools and token addresses on factory creation. for new chains this is typically empty.
  poolMappings: Array<Address[]>
}

export function getSubgraphConfig(): SubgraphConfig {
  // Update this value to the corresponding chain you want to deploy
  const selectedNetwork = dataSource.network()

  // subgraph does not support case switch with strings, hence this if else block
    return {
      factoryAddress: '0xbaa8353cc9d02733ef12f9556ed999521f6e554c',
      stablecoinWrappedNativePoolAddress: '0x1888bda067706d1242d4975efd5b5f1b0e25b9f2', 
      stablecoinIsToken0: false,
      wrappedNativeAddress: '0x4200000000000000000000000000000000000006', // WETH
      minimumNativeLocked: BigDecimal.fromString('0.00001'),
      stablecoinAddresses: [
        '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca', // USDC.e
        '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
      ],
      whitelistTokens: [
        '0x4200000000000000000000000000000000000006', // weth
        '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca', // USDC.e
        '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
      ],
      tokenOverrides: [
        // {
        //   address: Address.fromString('0xe1ad845d93853fff44990ae0dcecd8575293681e'),
        //   symbol: 'USDT',
        //   name: 'USD Tether (LZ)',
        //   decimals: BigInt.fromI32(6),
        // },
        // {
        //   address: Address.fromString('0x3022b87ac063DE95b1570F46f5e470F8B53112D8'),
        //   symbol: 'USDC.e',
        //   name: 'USD Coin (LZ)',
        //   decimals: BigInt.fromI32(6),
        // },
        // {
        //   address: Address.fromString('0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f'),
        //   symbol: 'WETH',
        //   name: 'Wrapped Ether (LZ)',
        //   decimals: BigInt.fromI32(18),
        // },
      ],
      poolsToSkip: [],
      poolMappings: [],
    }
}
