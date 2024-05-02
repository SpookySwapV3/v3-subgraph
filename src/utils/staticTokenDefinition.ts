import { Address, BigInt } from '@graphprotocol/graph-ts'
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
        symbol: 'WFTM',
        name: 'Wrapped Fantom',
        decimals: BigInt.fromI32(18),
      },
      {
        address: Address.fromString('0x28a92dde19d9989f39a49905d7c9c2fac7799bdf'),
        symbol: 'USDC_LZ',
        name: 'USD Coin (Layer Zero)',
        decimals: BigInt.fromI32(6),
      },
      {
        address: Address.fromString('0x1b6382dbdea11d97f24495c9a90b7c88469134a4'),
        symbol: 'USDC_AXL',
        name: 'USD Coin (Axelar)',
        decimals: BigInt.fromI32(8),
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
