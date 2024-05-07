import {
  Address,
  BigInt,
} from "@graphprotocol/graph-ts"
import { WNATIVE_ADDRESS } from "./pricing"
  
// Initialize a Token Definition with the attributes
export class StaticTokenDefinition {
  address: Address
  symbol: string
  name: string
  decimals: BigInt

  // Get all tokens with a static defintion
  static getStaticDefinitions(): Array<StaticTokenDefinition> {
    const staticDefinitions: Array<StaticTokenDefinition> = [
      {
        address: Address.fromString(WNATIVE_ADDRESS),
        symbol: 'WZEN',
        name: 'Wrapped Zen',
        decimals: BigInt.fromI32(18),
      },
      {
        address: Address.fromString('0x1d7fb99aed3c365b4def061b7978ce5055dfc1e7'),
        symbol: 'lzWBTC',
        name: 'LayerZero WBTC',
        decimals: BigInt.fromI32(8),
      },
      {
        address: Address.fromString('0x2c2e0b0c643ab9ad03adbe9140627a645e99e054'),
        symbol: 'lzETH',
        name: 'LayerZero ETH',
        decimals: BigInt.fromI32(18),
      },
      {
        address: Address.fromString('0x6318374dfb468113e06d3463ec5ed0b6ae0f0982'),
        symbol: 'lzAVAX',
        name: 'LayerZero AVAX',
        decimals: BigInt.fromI32(18),
      },
      {
        address: Address.fromString('0xdf8dba35962aa0fad7ade0df07501c54ec7c4a89'),
        symbol: 'lzLINK',
        name: 'LayerZero LINK',
        decimals: BigInt.fromI32(18),
      },
      {
        address: Address.fromString('0x38c2a6953f86a7453622b1e7103b738239728754'),
        symbol: 'lzDAI',
        name: 'LayerZero DAI',
        decimals: BigInt.fromI32(18),
      },
      {
        address: Address.fromString('0xcc44eb064cd32aafeeb2ebb2a47be0b882383b53'),
        symbol: 'lzUSDC',
        name: 'LayerZero USDC',
        decimals: BigInt.fromI32(6),
      },
      {
        address: Address.fromString('0xa167bcab6791304eda9b636c8beec75b3d2829e6'),
        symbol: 'lzUSDT',
        name: 'LayerZero USDT',
        decimals: BigInt.fromI32(18),
      },
      {
        address: Address.fromString('0xcead8ee30e03ae87e5e709617f7fdf180eef9973'),
        symbol: 'ZUSD',
        name: 'ZEN USD',
        decimals: BigInt.fromI32(6),
      },
    ]
    return staticDefinitions
  }

  // Helper for hardcoded tokens
  static fromAddress(tokenAddress: Address): StaticTokenDefinition | null {
    const staticDefinitions = this.getStaticDefinitions()
    const tokenAddressHex = tokenAddress.toHexString()

    // Search the definition using the address
    for (let i = 0; i < staticDefinitions.length; i++) {
      const staticDefinition = staticDefinitions[i]
      if (staticDefinition.address.toHexString() == tokenAddressHex) {
        return staticDefinition
      }
    }

    // If not found, return null
    return null
  }
}
