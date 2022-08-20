import { SimpleProvider } from "./types"

export const BURNR_WALLET = "tensor-wallet"

export const POLKA_ACCOUNT_ENDPOINTS = {
  opentensorexplorer: "explorer.nakamoto.opentensor.ai",
}

export const NETWORKS: SimpleProvider[] = [{
  name: "Bittensor Nakamoto",
  id: "bittensor-nakamoto-mainnet",
  client: "Light client",
  endpoints: [
    "wss://explorernode.nakamoto.opentensor.ai",
    //"ws://159.223.185.195:9944",
    //"ws://192.81.211.21:9944",
    //"ws://208.68.36.46:9944",
    "wss://st.fairchild.dev:9944",
  ],
}, {
  name: "Bittensor Nobunaga",
  id: "bittensor-nobunaga-mainnet",
  client: "Light client",
  endpoints: [
    "ws://143.244.164.193:9944",
  ],
}]

