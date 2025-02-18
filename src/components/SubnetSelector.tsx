import { createContext, useContext, useState } from "react";
const SubnetContext = createContext({ state: {}, actions: {} });

import React from "react";
import Stack from "@mui/material/Stack";
import {
  NativeSelect,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { DynamicInfo, SubnetState as SubnetStateInfo } from "../utils/types";
import SubnetHeader from "./SubnetHeader";

export const SubnetProvider = ({
  defaultNetuid,
  children,
}: {
  defaultNetuid: number | null;
  children: React.ReactNode;
}) => {
  const [netuid, setNetuid] = useState(defaultNetuid);
  const value = {
    state: { netuid },
    actions: { setNetuid },
  };
  return (
    <SubnetContext.Provider value={value}>{children}</SubnetContext.Provider>
  );
};

export type SubnetState = {
  netuid: number | null;
};

export type SubnetActions = {
  setNetuid: (netuid: number | null) => void;
};

export function useSubnet(): { state: SubnetState; actions: SubnetActions } {
  const { state, actions } = useContext(SubnetContext) as {
    state: SubnetState;
    actions: SubnetActions;
  };
  return { state, actions };
}

export default function SubnetSelector({
  children,
  subnets,
  dynamicInfo,
  subnetState,
}: {
  children: React.ReactNode;
  subnets: number[];
  dynamicInfo: DynamicInfo | null;
  subnetState: SubnetStateInfo | null;
}) {

  const {
    state: { netuid },
    actions: { setNetuid },
  } = useSubnet();

  return (
    <Stack direction="column" spacing={2}>
      {netuid !== undefined && (
        <React.Fragment>
          <SubnetHeader dynamicInfo={dynamicInfo} subnetState={subnetState} netuid={netuid} />
          <Box sx={{ minWidth: 120 }}>
            <FormControl style={{ width: "50%" }}>
              <InputLabel variant="outlined" htmlFor="uncontrolled-native">
                Subnet
              </InputLabel>
              <Autocomplete
                disablePortal
                sx={{ width: 300 }}
                options={
                  subnets.map((subnet) => ({
                    label: `Subnet ${subnet}`,
                    value: subnet,
                  }))
                }
                onChange={(e, value) => setNetuid(value?.value !== undefined ? value.value : null)}
                renderInput={(params) => <TextField {...params} label="Subnet" />}
              />
            </FormControl>
          </Box>
        </React.Fragment>
      )}
      <React.Fragment>{children}</React.Fragment>
    </Stack>
  );
}
