import {
  Address,
  BigInt,
} from "@graphprotocol/graph-ts"
  
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
        Address.fromString('0x7507c1dc16935b82698e4c63f2746a2fcf994df8'),
        'WBERA',
        'Wrapped BERA',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x153a59e72bcfaf9bdb8d3864945d44595856a970'),
        'mUSDC',
        'Mock USDC',
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
