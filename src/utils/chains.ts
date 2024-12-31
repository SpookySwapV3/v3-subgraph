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
  if (selectedNetwork == SONIC_TEST_NETWORK_NAME) {
    return {
      factoryAddress: '0x3d91b700252e0e3ee7805d12e048a988ab69c8ad',
      stablecoinWrappedNativePoolAddress: '0x216a86c8716fad79e05d23b1622ca432a739582a', // USDC.e/WETH 0.05% pool
      stablecoinIsToken0: false,
      wrappedNativeAddress: '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38', // WETH
      minimumNativeLocked: BigDecimal.fromString('2000'),
      stablecoinAddresses: [
        '0x29219dd400f2bf60e5a23d13be72b486d4038894', // USDC.e
      ],
      whitelistTokens: [
        '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38', // WETH
        '0x29219dd400f2bf60e5a23d13be72b486d4038894', // USDC.e
      ],
      tokenOverrides: [
        // {
        //   address: Address.fromString('0xaf93888cbd250300470a1618206e036e11470149'),
        //   symbol: 'CORAL',
        //   name: 'Coral',
        //   decimals: BigInt.fromI32(18),
        // },
      ],
      poolsToSkip: [],
      poolMappings: [],
    }
  } else {
    throw new Error('Unsupported Network')
  }
}
