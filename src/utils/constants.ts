import { SimpleProvider } from "./types"

export const BURNR_WALLET = "tensor-wallet"

export const POLKA_ACCOUNT_ENDPOINTS = {
  opentensorexplorer: "explorer.nakamoto.opentensor.ai/",
  polkadotjsexplorer: "polkadot.js.org/apps/?rpc=wss%3A%2F%2Farchivelb.nakamoto.opentensor.ai%3A9943",
}

export const NETWORKS: SimpleProvider[] = [{
  name: "Bittensor Nakamoto",
  id: "bittensor-nakamoto-mainnet",
  client: "Sync Node",
  endpoints: [
    "wss://sub0.tensorswap.com",
    "wss://sub1.tensorswap.com",
  ],
}, {
  name: "Bittensor Nobunaga",
  id: "bittensor-nobunaga-mainnet",
  client: "Sync Node",
  endpoints: [
    "ws://143.244.164.193:9944",
  ],
}]

