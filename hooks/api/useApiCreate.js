import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api/promise/Api";
//import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import { logger } from "@polkadot/util/logger";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { NETWORKS, BURNR_WALLET } from "../../utils/constants";
import { useIsMountedRef } from "./useIsMountedRef";
//import jsonCustomSpec from './nakamotoChainSpecRaw.json';
// Create the provider for the custom chain
//const customSpec = JSON.stringify(jsonCustomSpec);
const l = logger(BURNR_WALLET);
export const useApiCreate = (defaultnetwork) => {
    const [api, setApi] = useState({});
    const [network, setNetwork] = useState(defaultnetwork);
    const mountedRef = useIsMountedRef();
    useEffect(() => {
        const choseSmoldot = async (endpoints) => {
            try {
                //const provider = new ScProvider(customSpec);
                const backupProvider = new WsProvider(endpoints);
                await backupProvider.connect();
                const backupapi = await ApiPromise.create({
                    provider: backupProvider,
                });
                l.log(`TensorWallet is now connected to the backup provider`);
                mountedRef.current && setApi(backupapi);
                // not connected to the provider
                /* TODO: Substrate connect isn't working with the nakamoto nodes yet
        
        
                backupProvider.on('connected', async () => {
                  const backupapi = await ApiPromise.create({
                    provider: backupProvider,
                  });
                  l.log(`TensorWallet is now connected to the backup provider`);
                  //if (!provider.isConnected) {
                    setApi(backupapi);
                  //} else {
                  //  await backupapi.disconnect();
                  //}
                })
        
                // try to connect to the sc provider
                await provider.connect();
                // wait for connected
                provider.on('connected', (): void => {
                    // probably good?
                    // replace the old api with the new one
                    ApiPromise.create({
                      provider: provider,
                    }).then(async (api_: ApiPromise): Promise<void> => {
                      setApi(api_);
                      // disconnect the old api
                      await backupProvider.disconnect();
                    });
                });*/
            }
            catch (err) {
                l.error("Error:", err);
            }
        };
        void choseSmoldot(NETWORKS[parseInt(network)].endpoints);
    }, [mountedRef, network]);
    return {
        api,
        network,
        setNetwork,
    };
};
