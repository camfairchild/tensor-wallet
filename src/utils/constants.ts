import { SimpleProvider } from "./types"

export const BURNR_WALLET = "tensor-wallet"

export const NETWORKS: SimpleProvider[] = [{
  name: "Bittensor Finney",
  id: "bittensor",
  client: "Sync Node",
  endpoints: [
    "wss://test.chain.opentensor.ai:443",
  ],
}]

export const POLKA_ACCOUNT_ENDPOINTS = {
  polkadotjsexplorer: `polkadot.js.org/apps/?rpc=${NETWORKS[0].endpoints[0]}`,
  scantensor: "https://scan.bittensor.com",
  taostats: "https://x.taostats.io",
}

export const SS58_FORMAT = 42
