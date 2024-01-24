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
        Address.fromString('0x1d7fb99AED3C365B4DEf061B7978CE5055Dfc1e7'),
        'lzWBTC',
        'LayerZero WBTC',
        BigInt.fromI32(8)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x2c2E0B0c643aB9ad03adBe9140627A645E99E054'),
        'lzETH',
        'LayerZero ETH',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x6318374DFb468113E06d3463ec5Ed0B6Ae0F0982'),
        'lzAVAX',
        'LayerZero AVAX',
        BigInt.fromI32(6)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xDF8DBA35962Aa0fAD7ade0Df07501c54Ec7c4A89'),
        'lzLINK',
        'LayerZero LINK',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x38C2a6953F86a7453622B1E7103b738239728754'),
        'lzDAI',
        'LayerZero DAI',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xCc44eB064CD32AAfEEb2ebb2a47bE0B882383b53'),
        'lzUSDC',
        'LayerZero USDC',
        BigInt.fromI32(6)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xA167bcAb6791304EDa9B636C8beEC75b3D2829E6'),
        'lzUSDT',
        'LayerZero USDT',
        BigInt.fromI32(6)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xCEad8ee30e03aE87E5E709617f7FdF180Eef9973'),
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