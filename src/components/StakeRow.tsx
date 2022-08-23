import { AccountCard, BalanceValue } from "."
import { StakeColumn, StakeData } from "../utils/types"
import { BN } from "@polkadot/util"
import { Balance } from "@polkadot/types/interfaces"
import StakeForm from "./StakeForm"

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React from "react"

interface Props {
    row: StakeData
    columns: StakeColumn[]
    unit?: string
    stake?: (amount: number) => void
    expanded: string | false
    onChange?: () => void
    refreshStake: (hotkeyAddr: string) => void
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function StakeRow({columns, unit, row, expanded, onChange, refreshStake }: Props) {
    const setStake = (amount: number | string) => {
        row.stake = amount
    }

    return (
      <Accordion expanded={expanded === row['address']} onChange={onChange} >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          {columns.map((column) => {
            const value: string | number = row[column.id]
            return (
              <React.Fragment key={column.id}>
                {column.id === "address" && (
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
            <StakeForm hotkeyAddr={row['address']} stake={row.stake} refreshStake={refreshStake} />
          </Box>
        </AccordionDetails>
    </Accordion>
    )
}