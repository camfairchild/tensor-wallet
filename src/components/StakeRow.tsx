import { AccountCard, BalanceValue, ErrorBoundary } from "."
import { StakeColumn, StakeInfo } from "../utils/types"
import { BN } from "@polkadot/util"
import { Balance } from "@polkadot/types/interfaces"
import StakeForm from "./StakeForm"

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React from "react"
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion"
interface Props {
    row: StakeInfo
    columns: StakeColumn[]
    unit?: string
    expanded: string | false
    onChange?: () => void
    refreshMeta: () => void
}

export default function StakeRow({columns, unit, row, expanded, onChange, refreshMeta }: Props) {

    return (
      <Accordion expanded={expanded === row['hotkey']} onChange={onChange} >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" >
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          {columns.map((column) => {
            const value: string | number = row[column.id]
            return (
              <React.Fragment key={column.id}>
                {column.id === "hotkey" && (
                  <AccountCard account={{ address: value.toString(), name: "" }} addressFormat="Full" />
                )}
                {column.id === "stake" && // This may look overwhelming but is just for "dump" data until page is fixed
                  (typeof value === "number" || typeof value === "string") && (
                    <BalanceValue
                      isVisible={true}
                      value={new BN(value) as Balance}
                      unit={unit}
                      size="large"
                      style={{ width: "100%", justifyContent: "flex-end" }}
                    />
                  )}
              </React.Fragment>
            )
          })}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box justifyContent="flex-end" flexDirection="row" alignItems="flex-start">
            <ErrorBoundary>
              <StakeForm hotkeyAddr={row['hotkey']} stake={row.stake} refreshMeta={() => {}} />
            </ErrorBoundary>
          </Box>
        </AccordionDetails>
    </Accordion>
    )
}