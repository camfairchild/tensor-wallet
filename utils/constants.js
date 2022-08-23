export const BURNR_WALLET = "tensor-wallet";
export const POLKA_ACCOUNT_ENDPOINTS = {
    opentensorexplorer: "explorer.nakamoto.opentensor.ai",
};
export const NETWORKS = [{
        name: "Bittensor Nakamoto",
        id: "bittensor-nakamoto-mainnet",
        client: "Light client",
        endpoints: [
            "wss://sub0.tensorswap.com",
            "wss://sub1.tensorswap.com",
        ],
    }, {
        name: "Bittensor Nobunaga",
        id: "bittensor-nobunaga-mainnet",
        client: "Light client",
        endpoints: [
            "ws://143.244.164.193:9944",
        ],
    }];
