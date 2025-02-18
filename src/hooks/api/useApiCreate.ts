import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api/promise/Api";
//import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import { logger } from "@polkadot/util/logger";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { NETWORKS, BURNR_WALLET } from "../../utils/constants";
import { useIsMountedRef } from "./useIsMountedRef";
import { ApiCtx } from "../../utils/types";

//import jsonCustomSpec from './nakamotoChainSpecRaw.json';
// Create the provider for the custom chain
//const customSpec = JSON.stringify(jsonCustomSpec);

const l = logger(BURNR_WALLET);

export const useApiCreate = (defaultnetwork: string): ApiCtx => {
  const [api, setApi] = useState<ApiPromise>({} as ApiPromise);
  const [network, setNetwork] = useState<string>(defaultnetwork);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    const choseSmoldot = async (endpoints: string[]): Promise<void> => {
      try {
        //const provider = new ScProvider(customSpec);
        const backupProvider = new WsProvider(endpoints);
        const backupapi = await ApiPromise.create({
          provider: backupProvider,
        });
        l.log(`TensorWallet is now connected to the backup provider`);
        mountedRef.current && setApi(backupapi);
      } catch (err) {
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
