import Stack from "@mui/material/Stack";
import React from "react";
import { DynamicInfo, SubnetState } from "../utils/types";
import { Typography } from "@mui/material";

export default function SubnetHeader({
  dynamicInfo,
  subnetState,
  netuid,
}: {
  dynamicInfo: DynamicInfo | null;
  subnetState: SubnetState | null;
  netuid: number | null;
}) {
  return (
    <React.Fragment>
      <Stack direction="row" spacing={2}>
        <Typography variant="h6">
          {netuid !== null &&
            `Subnet ${netuid} ${
              dynamicInfo ? `(${dynamicInfo.subnetName}) - ${dynamicInfo.tokenSymbol}` : ""
            }`}
        </Typography>
      </Stack>
    </React.Fragment>
  );
}
