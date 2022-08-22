import { BN } from "@polkadot/util";
import { useEffect, useState } from "react";
import { formatBalance, logger } from "@polkadot/util";
import { BURNR_WALLET } from "../utils/constants";
import { useApi } from "./api/useApi";
import { useIsMountedRef } from "./api/useIsMountedRef";
const ZERO = new BN(0);
export const useBalance = (address) => {
    const apiCtx = useApi();
    const [state, setState] = useState([
        "0",
        new BN(ZERO),
        true,
        "-"
    ]);
    const mountedRef = useIsMountedRef();
    useEffect(() => {
        const l = logger(BURNR_WALLET);
        let unsubscribe = null;
        address &&
            apiCtx.api.query.system
                .account(address, ({ data }) => {
                mountedRef.current &&
                    setState([
                        formatBalance(data.free, {
                            decimals: 9,
                            forceUnit: "TAO",
                            withSi: false,
                        }),
                        data.free,
                        data.free.isZero(),
                        "TAO"
                    ]);
            })
                .then((u) => {
                unsubscribe = u;
            })
                .catch(l.error);
        return () => {
            unsubscribe && unsubscribe();
        };
    }, [address, apiCtx, mountedRef]);
    return state;
};
