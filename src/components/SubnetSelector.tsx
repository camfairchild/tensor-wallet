import { createContext, useContext, useState } from "react";
const SubnetContext = createContext({ state: {}, actions: {} });

import React from "react";
import Stack from "@mui/material/Stack";
import {
  NativeSelect,
  InputLabel,
  FormControl,
  Box,
  Pagination,
  Typography,
} from "@mui/material";

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
}: {
  children: React.ReactNode;
  subnets: number[];
}) {
  const {
    state: { netuid },
    actions: { setNetuid },
  } = useSubnet();

  return (
    <Stack direction="column" spacing={2}>
      {netuid !== undefined && (
        <React.Fragment>
          <Typography variant="h6">Subnet {netuid}</Typography>
          <Box sx={{ minWidth: 120 }}>
            <FormControl style={{ width: "50%" }}>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Subnet
              </InputLabel>
              <NativeSelect
                defaultValue={netuid}
                onChange={(e) => setNetuid(parseInt(e.target.value))}
                inputProps={{
                  name: "netuid",
                  id: "uncontrolled-native",
                }}
              >
                {subnets.map((subnet) => (
                  <option value={subnet} key={subnet}>{subnet}</option>
                ))}
              </NativeSelect>
            </FormControl>
          </Box>
        </React.Fragment>
      )}
      <React.Fragment>{children}</React.Fragment>
    </Stack>
  );
}
