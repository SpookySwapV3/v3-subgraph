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
        Address.fromString('0x23181f21dea5936e24163ffaba4ea3b316b57f3c'),
        'WBTT',
        'Wrapped Bittorrent',
        BigInt.fromI32(18)
      ),
      new StaticTokenDefinition(
        Address.fromString('0xae17940943ba9440540940db0f1877f101d39e8b'),
        'USDC_e',
        'USD Coin (ETH)',
        BigInt.fromI32(6)
      ),
      new StaticTokenDefinition(
        Address.fromString('0x9888221fe6b5a2ad4ce7266c7826d2ad74d40ccf'),
        'WBTC',
        'Wrapped Bitcoin',
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
