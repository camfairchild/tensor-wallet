import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";
import { logger } from "@polkadot/util";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { NETWORKS, BURNR_WALLET } from "../../utils/constants";
import { useIsMountedRef } from "./useIsMountedRef";
import { ApiCtx } from "../../utils/types";
import {} from "@polkadot/extension-dapp";

const l = logger(BURNR_WALLET);

export const useApiCreate = (defaultnetwork: string): ApiCtx => {
  const [api, setApi] = useState<ApiPromise>({} as ApiPromise);
  const [network, setNetwork] = useState<string>(defaultnetwork);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    const choseSmoldot = async (endpoints: string[]): Promise<void> => {
      try {
        const provider = new WsProvider(endpoints);
        await provider.connect();
        const api = await ApiPromise.create({ provider });
        l.log(`TensorWallet is now connected`);
        mountedRef.current && setApi(api);
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
