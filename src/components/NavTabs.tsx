import {
  FunctionComponent,
  useContext,
  useState,
  ChangeEvent,
  ReactNode,
  useEffect,
} from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SwapHorizSharpIcon from "@material-ui/icons/SwapHorizSharp";
import CallMadeSharpIcon from "@material-ui/icons/CallMadeSharp";
import CallReceivedSharpIcon from "@material-ui/icons/CallReceivedSharp";
import TollIcon from "@mui/icons-material/Toll";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  Neuron,
  Metagraph,
  StakeInfo,
  RawMetagraph,
  NeuronInfo,
  NeuronInfoLite,
  SubnetInfo,
  DelegateInfo,
  DelegateInfoRaw,
  DelegateExtras,
  DelegateExtra,
} from "../utils/types";

import {
  SendFundsForm,
  ReceiveFundsForm,
  BurnrDivider,
  HistoryTable,
  StakeTab,
  ErrorBoundary,
} from ".";

import { useApi } from "../hooks";
import { AccountContext } from "../utils/contexts";
import { CreateAccountCtx, StakeData } from "../utils/types";
import { useIsMountedRef } from "../hooks/api/useIsMountedRef";
import { Option } from "@polkadot/types";
import { Codec } from "@polkadot/types/types";
import { AccountId } from "@polkadot/types/interfaces";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: "calc(100vh - 265px)",
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,

    [theme.breakpoints.down("sm")]: {
      minHeight: "calc(100vh - 320px)",
    },
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
  },
  rootHeading: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  rootTabs: {
    "& 	.MuiTabs-root": {
      minHeight: theme.spacing(8),
      ...theme.typography.overline,
      lineHeight: 1,
    }
  },
  icon: {
    color: theme.palette.text.secondary,
  },
  selectedTab: {
    color: theme.palette.text.secondary,
  },
}));

const TabPanel: FunctionComponent<TabPanelProps> = ({
  children,
  value,
  index,
  ...props
}: TabPanelProps) => {
  const classes = useStyles();
  return (
    <div hidden={value !== index} id={`tabpanel-${index}`} {...props}>
      {value === index && (
        <Box p={3} className={classes.paper} >
          <Stack direction="column" spacing={2}>
            {children}
          </Stack>
        </Box>
      )}
    </div>
  );
};

const NavTabs: FunctionComponent = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { account } = useContext<CreateAccountCtx>(AccountContext);
  const mountedRef = useIsMountedRef();
  // for first load of page
  const [loaded, setLoaded] = useState(false);

  const apiCtx = useApi();

  const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
    if (newValue === 3 && !loaded) {
      // refresh the page when the tab is clicked
      // but only do this once
      refreshMeta();
      getDelegateInfo().then((delegateInfo: DelegateInfo[]) => {
        setDelegateInfo(delegateInfo);
      });
      setLoaded(true);
    }
    setValue(newValue);
  };

  const [meta, setMeta] = useState<Metagraph>({});
  const [stakeData, setStakeData] = useState<StakeData>({});
  const [loader, setLoader] = useState<boolean>(true);
  const [delegateInfo, setDelegateInfo] = useState<DelegateInfo[]>([]);
  const [delegateRows, setDelegateRows] = useState<DelegateInfo[]>([]);
  const [delegatesExtras, setDelegatesExtras] = useState<DelegateExtras>({
    "5ECvRLMj9jkbdM4sLuH5WvjUe87TcAdjRfUj5onN4iKqYYGm": {
      "name": "Vune",
      "url": "https://fairchild.dev",
      "description": "Vune is a dev at the Opentensor Foundation, and a CS student at the University of Toronto. He also maintains tensorwallet and tensorping.",
    }
  });
  

  const getNeurons = (netuids: Array<number>): Promise<RawMetagraph> => {
    return new Promise<RawMetagraph>(async (resolve, reject) => {
      let results_map: RawMetagraph = {};
      for (let netuid of netuids) {
        try {
          let result_bytes = await (apiCtx.api.rpc as any).neuronInfo
            .getNeuronsLite(netuid)
        
          const result = apiCtx.api.createType("Vec<NeuronInfoLite>", result_bytes);
          const neurons_info = result.toJSON() as any[] as NeuronInfoLite[];
          results_map[netuid] = neurons_info;
        } catch(err: any) {
            console.log(err);
            reject(err);
        }
      }
      console.log("results_map", results_map);
      resolve(results_map);
    });
  };

  const getDelegateInfo = async (): Promise<DelegateInfo[]> => {
    const result_bytes = await (apiCtx.api.rpc as any).delegateInfo.getDelegates();
    const result = apiCtx.api.createType("Vec<DelegateInfo>", result_bytes);
    const delegate_info_raw: DelegateInfoRaw[] = result.toJSON() as any[] as DelegateInfoRaw[];
    
    const delegate_info = delegate_info_raw.map((delegate: DelegateInfoRaw) => {
      let nominators: [string, number][] = [];
      let total_stake = 0;
      for (let i = 0; i < delegate.nominators.length; i++) {
        const nominator = delegate.nominators[i];
        const staked = nominator[1];
        total_stake += staked;
        nominators.push([nominator[0].toString(), staked]);
      }
      return {
        take: delegate.take / (2**16 - 1), // Normalize take, which is a u16
        delegate_ss58: delegate.delegate_ss58.toString(),
        owner_ss58: delegate.owner_ss58.toString(),
        nominators,
        total_stake,
      };
    });

    return delegate_info;
  };

  const getDelegatesJson = async (): Promise<DelegateExtras> => {
    const url = "https://raw.githubusercontent.com/opentensor/bittensor/master/delegates.json";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
    

  const refreshMeta = async () => {
    const getMeta = async (): Promise<Metagraph> => {
      setLoader(true);

      const subnets_info_bytes = await (
        apiCtx.api.rpc as any
      ).subnetInfo.getSubnetsInfo();
      const subnets_info = apiCtx.api.createType("Vec<Option<SubnetInfo>>", subnets_info_bytes);

      const netuids: Array<number> = (subnets_info as any)
        .toJSON()
        .map((subnetInfo: SubnetInfo) => {
          return subnetInfo.netuid;
        });

      let _meta: Metagraph = {};

      const result: RawMetagraph = await getNeurons(netuids);

      Object.entries(result).forEach(
        ([netuid, neurons]: [string, NeuronInfoLite[]]) => {
          let neurons_ = neurons.map((neuron: NeuronInfoLite) => {
            return {
              hotkey: neuron.hotkey.toString(),
              coldkey: neuron.coldkey.toString(),
              stake: Object.fromEntries(neuron.stake.map((stake: [AccountId, number]) => {
                return [stake[0].toString(), stake[1]];
              })),
              uid: neuron.uid,
            };
          });
          _meta[netuid] = neurons_;
        }
      );
      
      return _meta;
    };

    const _getDelegateInfo = async (): Promise<[DelegateInfo[], DelegateExtras]> => {
      const delegates_json = await getDelegatesJson();
      const delegateInfo = await getDelegateInfo();
      return [delegateInfo, delegates_json];
    };

    account &&
      getMeta().then((_meta: Metagraph) => {
        setMeta(_meta);
        setLoader(false);
      })
    account && _getDelegateInfo().then(([delegateInfo, delegates_json]) => {
      setDelegateInfo(delegateInfo);
      setDelegatesExtras(delegates_json);

      setLoader(false);
    });
  };

  useEffect(() => {
    const getRows = async (meta_: Metagraph) => {
      let stakeData: StakeData = {};
      stakeData = Object.fromEntries(
        Object.entries(meta_).map(([netuid, neurons]: [string, Neuron[]]) => {
          return [
            netuid,
            neurons
              .filter((neuron) => {
                return neuron.coldkey === account.accountAddress;
              })
              .map((neuron) => {
                return {
                  address: neuron.hotkey,
                  stake: neuron.stake[account.accountAddress] || 0
                } as StakeInfo;
              }),
          ];
        })
      );
  
      setStakeData(stakeData);
    };

    mountedRef.current && !!meta && getRows(meta);
  }, [account, mountedRef, meta]);

  useEffect(() => {
    const prepareDelegateRows = (delegateInfo: DelegateInfo[], delegatesExtras: DelegateExtras, account_addr: string) => {
      delegateInfo.sort((a, b) => {
        let nom_idx_a = a.nominators.findIndex((nom) => nom[0] === account_addr); 
        let nom_idx_b = b.nominators.findIndex((nom) => nom[0] === account_addr);
        let amt_a: number = a.nominators[nom_idx_a]?.[1] || 0;
        let amt_b: number = b.nominators[nom_idx_b]?.[1] || 0;

        return amt_b - amt_a || b.total_stake - a.total_stake;
      });
      delegateInfo.find((delegate, index) => {
        if (delegatesExtras[delegate.delegate_ss58]?.name === "Vune") {
          // Put at top
          delegateInfo.splice(index, 1);
          delegateInfo.unshift(delegate);
          return true;
        }
        return false;
      });
      
      setDelegateRows(delegateInfo);
    };
    
    mountedRef.current && prepareDelegateRows(delegateInfo, delegatesExtras, account.accountAddress);

  }, [account, mountedRef, delegateInfo, delegatesExtras]);

  return (
    <>
      <Paper square className={classes.paper} >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          className={[classes.rootTabs, classes.paper].join(" ")}
          textColor="primary"
        >
          <Tab
            label="Receipts"
            icon={<SwapHorizSharpIcon fontSize="small" className={classes.icon} />}
            className={classes.paper}
            classes={{
              textColorPrimary: classes.selectedTab
            }}
          />
          <Tab
            label="Send"
            icon={<CallMadeSharpIcon fontSize="small" className={classes.icon} />}
            className={classes.paper} 
            classes={{
              textColorPrimary: classes.selectedTab
            }}
          />
          <Tab
            label="Receive"
            icon={<CallReceivedSharpIcon fontSize="small" className={classes.icon} />}
            className={classes.paper}
            classes={{
              textColorPrimary: classes.selectedTab
            }}
          />
          <Tab
            label="Stake"
            icon={<TollIcon fontSize="small" className={classes.icon} />} 
            className={classes.paper}
            classes={{
              textColorPrimary: classes.selectedTab
            }}
          />
        </Tabs>
      </Paper>

      <BurnrDivider />

      <Paper className={`${classes.root} ${classes.paper}`} square >
        <TabPanel value={value} index={0} >
          <ErrorBoundary>
            <Typography variant="h6" className={classes.rootHeading}>
              Transaction History
            </Typography>
            <HistoryTable />
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ErrorBoundary>
            <Typography variant="h6" className={classes.rootHeading}>
              Send TAO
            </Typography>
            <SendFundsForm />
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ErrorBoundary>
            <Typography variant="h6" className={classes.rootHeading}>
              Receive TAO
            </Typography>
            <ReceiveFundsForm />
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ErrorBoundary>
            <Stack spacing={2} direction="row">
              <Typography variant="h6" className={classes.rootHeading}>
                Stake TAO
              </Typography>
              <Button
                onClick={() => refreshMeta()}
                startIcon={<RefreshIcon />}
              />
            </Stack>
            <StakeTab
              delegateInfo={delegateRows}
              stakeData={stakeData}
              loader={loader}
              refreshMeta={refreshMeta}
              delegatesExtras={delegatesExtras}
            />
          </ErrorBoundary>
        </TabPanel>
      </Paper>
    </>
  );
};

export default NavTabs;
