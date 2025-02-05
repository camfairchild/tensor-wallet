import React, { ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';
import { Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
    accordion: {
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        border: '1px solid rgba(0, 0, 0, .125)',
    },
    text: {
        color: theme.palette.text.primary,
    },
}));

interface SubnetProps {
    netuid: string | number, 
    children?: ReactNode     
}

export default function Subnet({ netuid, children }: SubnetProps) {
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const classes = useStyles();

    return (
        <Accordion
            square
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            className={classes.accordion}
        >
            <AccordionSummary
                aria-controls={`panel${netuid}d-content`}
                id={`panel${netuid}d-header`}
            >
                <Typography className={classes.text} >Subnet {netuid}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );          
}