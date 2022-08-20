import { useContext } from "react"
import "@polkadot/api-augment"

import { ApiContext } from "../../utils/contexts"
import { ApiCtx } from "../../utils/types"

export const useApi = (): ApiCtx => {
  return useContext<ApiCtx>(ApiContext)
}
