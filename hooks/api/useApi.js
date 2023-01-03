import { useContext } from "react";
import "@polkadot/api-augment";
import { ApiContext } from "../../utils/contexts";
export const useApi = () => {
    return useContext(ApiContext);
};
