import { DynamicInfo } from "../utils/types";
import { Stack, Typography } from "@mui/material";
import BalanceValue from "./BalanceValue";
import { BN } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";

import React from "react";

export default function SubnetPrice({
  netuid,
  dynamicInfo,
}: {
  netuid: number | null;
  dynamicInfo: DynamicInfo | null;
}) {
  console.debug("dynamicInfo", dynamicInfo);

  let price = dynamicInfo ? dynamicInfo.taoIn / dynamicInfo.alphaIn : null;
  if (netuid === 0) {
    price = 1.0;
  }
  price = price ? price * 1e9 : null;

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      minWidth="10em"
      alignContent="center"
      justifyContent="space-between"
    >
      {price !== null && (
        <React.Fragment>
          <BalanceValue
            isVisible={true}
            value={new BN(price) as Balance}
            unit={`TAO/${dynamicInfo?.tokenSymbol}`}
            size="large"
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            round={false}
          />
        </React.Fragment>
      )}
    </Stack>
  );
}
