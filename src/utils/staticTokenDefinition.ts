import {
  Address,
  BigInt,
} from "@graphprotocol/graph-ts"
import { WNATIVE_ADDRESS } from "./pricing"
  
// Initialize a Token Definition with the attributes
export class StaticTokenDefinition {
  address : Address
  symbol: string
  name: string
  decimals: BigInt

  // Initialize a Token Definition with its attributes
  constructor(address: Address, symbol: string, name: string, decimals: BigInt) {
    this.address = address
    this.symbol = symbol
    this.name = name
    this.decimals = decimals
  }


  // Get all tokens with a static defintion
  static getStaticDefinitions(): Array<StaticTokenDefinition> {
    return [
      new StaticTokenDefinition(
        Address.fromString(WNATIVE_ADDRESS),
        'WZEN',
        'Wrapped Zen',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x1d7fb99aed3c365b4def061b7978ce5055dfc1e7'),
        'lzWBTC',
        'LayerZero WBTC',
        BigInt.fromI32(8)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x2c2e0b0c643ab9ad03adbe9140627a645e99e054'),
        'lzETH',
        'LayerZero ETH',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x6318374dfb468113e06d3463ec5ed0b6ae0f0982'),
        'lzAVAX',
        'LayerZero AVAX',
        BigInt.fromI32(6)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xdf8dba35962aa0fad7ade0df07501c54ec7c4a89'),
        'lzLINK',
        'LayerZero LINK',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x38c2a6953f86a7453622b1e7103b738239728754'),
        'lzDAI',
        'LayerZero DAI',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xcc44eb064cd32aafeeb2ebb2a47be0b882383b53'),
        'lzUSDC',
        'LayerZero USDC',
        BigInt.fromI32(6)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xa167bcab6791304eda9b636c8beec75b3d2829e6'),
        'lzUSDT',
        'LayerZero USDT',
        BigInt.fromI32(6)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xcead8ee30e03ae87e5e709617f7fdf180eef9973'),
        'ZUSD',
        'ZEN USD',
        BigInt.fromI32(6)
      ),  
    ]
  }

  // Helper for hardcoded tokens
  static fromAddress(tokenAddress: Address) : StaticTokenDefinition | null {
    let staticDefinitions = this.getStaticDefinitions()
    let tokenAddressHex = tokenAddress.toHexString()

    // Search the definition using the address
    for (let i = 0; i < staticDefinitions.length; i++) {
      let staticDefinition = staticDefinitions[i]
      if(staticDefinition.address.toHexString() == tokenAddressHex) {
        return staticDefinition
      }
    }

    // If not found, return null
    return null
  }

}
