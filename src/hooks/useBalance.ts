import { BN } from "@polkadot/util"
import { useEffect, useState } from "react"
import { formatBalance, logger } from "@polkadot/util"
import { Balance, AccountInfo } from "@polkadot/types/interfaces"

import { BURNR_WALLET } from "../utils/constants"
import { useApi } from "./api/useApi"
import { useIsMountedRef } from "./api/useIsMountedRef"

type State = [string, Balance, boolean, string]

const ZERO = new BN(0)

export const useBalance = (address: string): State => {
  const apiCtx = useApi()
  const [state, setState] = useState<State>([
    "0",
    new BN(ZERO) as Balance,
    true,
    "-"
  ])
  const mountedRef = useIsMountedRef()

  useEffect((): (() => void) => {
    const l = logger(BURNR_WALLET)
    let unsubscribe: null | (() => void) = null
    address &&
      apiCtx.api.query.system
        .account(address, ({ data }: AccountInfo): void => {
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
            ])
        })
        .then((u): void => {
          unsubscribe = u
        })
        .catch(l.error)

    return (): void => {
      unsubscribe && unsubscribe()
    }
    
  }, [address, apiCtx, mountedRef])

  return state
}
