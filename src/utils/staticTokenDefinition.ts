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

    // Add DGD
    return [
      new StaticTokenDefinition(
        Address.fromString(WNATIVE_ADDRESS),
        'WFTM',
        'Wrapped Fantom',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x28a92dde19d9989f39a49905d7c9c2fac7799bdf'),
        'USDC_LZ',
        'USD Coin (Layer Zero)',
        BigInt.fromI32(6)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x1b6382dbdea11d97f24495c9a90b7c88469134a4'),
        'USDC_AXL',
        'USD Coin (Axelar)',
        BigInt.fromI32(8)
      )
  
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
