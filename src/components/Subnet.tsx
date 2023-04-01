import React, { ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';

interface SubnetProps {
    netuid: string | number, 
    children?: ReactNode     
}

export default function Subnet({ netuid, children }: SubnetProps) {
    const [expanded, setExpanded] = React.useState<boolean>(false);

    return (
        <Accordion
            square
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
        >
            <AccordionSummary
                aria-controls={`panel${netuid}d-content`}
                id={`panel${netuid}d-header`}
            >
                <Typography>Subnet {netuid}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );          
}