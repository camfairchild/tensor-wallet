import Stack from "@mui/material/Stack";
import React from "react";
import { DynamicInfo, SubnetState } from "../utils/types";
import { Typography } from "@mui/material";
import SubnetPrice from "./SubnetPrice";


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
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Typography variant="h6">
          {netuid !== null &&
            `Subnet ${netuid} ${
              dynamicInfo
                ? `(${dynamicInfo.subnetName}) - ${dynamicInfo.tokenSymbol}`
                : ""
            }`}
        </Typography>
        <SubnetPrice netuid={netuid} dynamicInfo={dynamicInfo} />
      </Stack>
    </React.Fragment>
  );
}
