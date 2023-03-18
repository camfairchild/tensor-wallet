import { AccountCard, BalanceValue, ErrorBoundary } from "."
import { DelegateColumn, DelegateInfo, DelegateInfoRow } from "../utils/types"
import { BN } from "@polkadot/util"
import { Balance } from "@polkadot/types/interfaces"
import StakeForm from "./StakeForm"

import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion"
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React, { useEffect } from "react"
import { Typography } from "@material-ui/core"
import { valueToPercent } from "@mui/base"

interface Props {
    delegate: DelegateInfo
    columns: DelegateColumn[]
    unit?: string
    coldkey_ss58: string
    expanded: string | false
    onChange?: () => void
    refreshMeta: () => void
}



export default function DelegateRow({columns, unit, delegate, expanded, onChange, refreshMeta, coldkey_ss58 }: Props) {
    const [delegate_row, setDelegateRow] = React.useState<DelegateInfoRow>({} as DelegateInfoRow)

    useEffect(() => {
        let _row: DelegateInfoRow = {
            stake: 0,
            take: delegate.take,
            owner_ss58: delegate.owner_ss58,
            delegate_ss58: delegate.delegate_ss58,
            total_stake: delegate.nominators.reduce((acc, [_, staked]) => acc + staked, 0),
            nominators: delegate.nominators.length
        };
        delegate.nominators.filter(([nom, staked]: [string, number]) => {
            if (nom === coldkey_ss58) {
                _row = {
                    ..._row,
                    stake: staked
                }
            }

        })

        setDelegateRow({
            ...delegate_row,
            ..._row
        })

    }, [delegate])

    return (
    <React.Fragment>
        <ErrorBoundary>
            {!!Object.keys(delegate_row).length && (
                <Accordion expanded={expanded === delegate_row.delegate_ss58} onChange={onChange} >
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                    {columns.map((column) => {
                        if (!["delegate_ss58", "stake"].includes(column.id)) {
                            return null;
                        }
                        const value: string | number = delegate_row[column.id];
                        return (
                        <React.Fragment key={column.id}>
                            {column.id === "delegate_ss58" && (
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                        {columns.map((column) => {
                            if (!["owner_ss58"].includes(column.id)) {
                                return null;
                            }
                            const value: string | number = delegate_row[column.id];
                            return (
                            <React.Fragment key={column.id}>
                                {column.id === "owner_ss58" && (
                                <Box flex={3} >
                                    <AccountCard account={{ address: value.toString(), name: "Delegate Owner" }} addressFormat="Short" />
                                </Box>

                                )}
                            </React.Fragment>
                            )
                        })}
                        <Stack direction="column" justifyContent="space-between" alignItems="center" width="100%" flex={1} >
                        {columns.map((column) => {
                            if (!["take", "nominators"].includes(column.id)) {
                                return null;
                            }
                            const value: string | number = delegate_row[column.id];
                            return (
                            <React.Fragment key={column.id}>
                                {["take", "nominators"].includes(column.id) && 
                                (typeof value === "number") && (
                                    <React.Fragment>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" >
                                            <Typography style={{
                                                fontWeight: "bold",
                                            }} >{column.id}:</Typography>
                                            <Typography>{value < 1 && value > 0 ? `${(value * 100).toFixed(1)}%` : value.toString() }</Typography>
                                        </Stack>
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                            )
                        })}
                        </Stack>
                    </Stack>
                    <Box justifyContent="flex-end" flexDirection="row" alignItems="center">
                        <ErrorBoundary>
                        <StakeForm hotkeyAddr={delegate_row.delegate_ss58} stake={delegate_row.stake} refreshMeta={refreshMeta} />
                        </ErrorBoundary>
                    </Box>
                    </AccordionDetails>
                </Accordion>
            )}
        </ErrorBoundary>
    </React.Fragment>
    )
}