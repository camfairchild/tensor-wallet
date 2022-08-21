import {
  FunctionComponent,
  useContext,
  useState,
  ChangeEvent,
  ReactNode,
  useEffect
} from "react"
import {
  makeStyles,
  Theme,
} from "@material-ui/core/styles"

import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SwapHorizSharpIcon from "@material-ui/icons/SwapHorizSharp"
import CallMadeSharpIcon from "@material-ui/icons/CallMadeSharp"
import CallReceivedSharpIcon from "@material-ui/icons/CallReceivedSharp"
import TollIcon from '@mui/icons-material/Toll';
import RefreshIcon from '@mui/icons-material/Refresh';

import { Neuron } from '../utils/types';

import {
  SendFundsForm,
  ReceiveFundsForm,
  BurnrDivider,
  HistoryTable,
  StakeTab,
} from "."

import { useApi } from "../hooks"
import { AccountContext } from "../utils/contexts"
import { CreateAccountCtx, StakeData } from "../utils/types"
import { useIsMountedRef } from "../hooks/api/useIsMountedRef"

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: "calc(100vh - 265px)",
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,

    [theme.breakpoints.down("sm")]: {
      minHeight: "calc(100vh - 320px)",
    },
  },
  rootHeading: {
    marginBottom: theme.spacing(3),
  },
  rootTabs: {
    "& 	.MuiTabs-root": {
      minHeight: theme.spacing(8),
      ...theme.typography.overline,
      lineHeight: 1,
    },
  },
}))

const TabPanel: FunctionComponent<TabPanelProps> = ({
  children,
  value,
  index,
  ...props
}: TabPanelProps) => {
  return (
    <div hidden={value !== index} id={`tabpanel-${index}`} {...props}>
      {value === index && 
      <Box p={3}>
        <Stack direction="column" spacing={2}>
          {children}
        </Stack>
      </Box>}
    </div>
  )
}

const NavTabs: FunctionComponent = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const { account } = useContext<CreateAccountCtx>(AccountContext)
  const mountedRef = useIsMountedRef();
  
  const apiCtx = useApi();

  const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue)
  }

  const [neurons, setNeurons] = useState<Neuron[]>([])
  const [rows, setRows] = useState<StakeData[]>([])
  const [loader, setLoader] = useState<boolean>(true)
  

  const refreshMeta = async () => {
      const getMeta = async () => {
        setLoader(true)
        const numNeurons = ((await apiCtx.api.query.subtensorModule.n()) as any).words[0];
              let _neurons: Neuron[] = [];
              const pageSize = Math.ceil(numNeurons / 4);
              for (let i = 0; i < 4; i++) {
                  const indexStart = i * pageSize;
                  const results = ((await apiCtx.api.query.subtensorModule.neurons.multi(
                      [...Array(pageSize).keys()].map(i => i + indexStart)
                  )) as any)
                  let neurons_ = results.map((result: any, j: number) => {
                      const neuron = result.value;
                      return {
                          hotkey: (neuron.hotkey as any).toString(),
                          coldkey: (neuron.coldkey as any).toString(),
                          stake: (neuron.stake as any).toNumber(),
                          uid: j + indexStart
                      };
                  });
                  _neurons.push(...neurons_);
              }

              return _neurons;
      }

      account && getMeta().then((_neurons) => {
        setNeurons(_neurons);
        setLoader(false)
      })
  }

  const refreshStake = async ( hotkeyAddr?: string ) => {
      const getStake = async (neurons_: Neuron[]) => {
        // get the uids of the neurons that are linked to the account
        const neuron_uids = neurons_.filter(neuron => {
                if (hotkeyAddr) {
                    return neuron.hotkey === hotkeyAddr && neuron.coldkey === account.accountAddress
                }
                return neuron.coldkey === account.accountAddress
            }).flatMap(neuron => {
                return neuron.uid
            })
            
        // get the stake of each neuron that is linked to the account
        const results = ((await apiCtx.api.query.subtensorModule.neurons.multi(
          neuron_uids
        )) as any)
        // map the results to a neuron array
        const _neurons = results.map((result: any, j: number) => {
            const neuron = result.value;
            return {
                hotkey: (neuron.hotkey as any).toString(),
                coldkey: (neuron.coldkey as any).toString(),
                stake: (neuron.stake as any).toNumber(),
                uid: neuron_uids[j]
            };
        });

        // fill the new stake data with the old data and the new data
        neurons_ = neurons_.map(neuron => {
          const ind = _neurons.findIndex((n: Neuron) => {return n.uid === neuron.uid}, -1)
          if (ind !== -1) {
            neuron.stake = _neurons[ind].stake
          }
          return neuron;
        })

        return neurons_;
    }

    account && getStake(neurons).then((_neurons) => {
      setNeurons(_neurons);
    });
  }

  useEffect(() => {
      
    const getRows = async (neurons_: Neuron[]) => {
      const rows_: StakeData[] = 
      neurons_.filter(neuron => {
              return neuron.coldkey === account.accountAddress
          }).map(neuron => {
              return {
                  address: neuron.hotkey,
                  stake: neuron.stake
              }
          });
      setRows(rows_);
    } 

    mountedRef.current && neurons?.length && getRows(neurons);

  } , [account, mountedRef, neurons])

  useEffect(() => {
    mountedRef.current && refreshMeta();
  } , [mountedRef, apiCtx])

  return (
    <>
      <Paper square>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          className={classes.rootTabs}
        >
          <Tab
            label="Receipts"
            icon={<SwapHorizSharpIcon fontSize="small" />}
          />
          <Tab label="Send" icon={<CallMadeSharpIcon fontSize="small" />} />
          <Tab
            label="Receive"
            icon={<CallReceivedSharpIcon fontSize="small" />}
          />
          <Tab
            label="Stake"
            icon={<TollIcon fontSize="small" />}
          />
        </Tabs>
      </Paper>

      <BurnrDivider />

      <Paper className={classes.root} square >
        <TabPanel value={value} index={0}>
          <Typography variant="h6" className={classes.rootHeading}>
            Transaction History
          </Typography>
          <HistoryTable />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h6" className={classes.rootHeading}>
            Send Tao
          </Typography>
          <SendFundsForm />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="h6" className={classes.rootHeading}>
            Receive Tao
          </Typography>
          <ReceiveFundsForm />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Stack spacing={2} direction="row" >
            <Typography variant="h6" className={classes.rootHeading}>
              Stake Tao
            </Typography>
            <Button onClick={() => refreshMeta()} startIcon={<RefreshIcon />} />
          </Stack>
          <StakeTab rows={rows} loader={loader} refreshStake={refreshStake} />
        </TabPanel>
      </Paper>
    </>
  )
}

export default NavTabs
