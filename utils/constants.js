export const BURNR_WALLET = "tensor-wallet";
export const POLKA_ACCOUNT_ENDPOINTS = {
    polkadotjsexplorer: "polkadot.js.org/apps/?rpc=wss://entrypoint-finney.opentensor.ai:443",
};
export const SS58_FORMAT = 42;
export const NETWORKS = [{
        name: "Bittensor Finney",
        id: "bittensor",
        client: "Sync Node",
        endpoints: [
            "wss://entrypoint-finney.opentensor.ai:443",
        ],
    }];
