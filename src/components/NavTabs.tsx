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
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
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
}));

const TabPanel: FunctionComponent<TabPanelProps> = ({
  children,
  value,
  index,
  ...props
}: TabPanelProps) => {
  return (
    <div hidden={value !== index} id={`tabpanel-${index}`} {...props}>
      {value === index && (
        <Box p={3}>
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
        (apiCtx.api.rpc as any).neuronInfo
          .getNeuronsLite(netuid)
          .then((result_bytes: number[]) => {
            const result = apiCtx.api.createType("Vec<NeuronInfoLite>", result_bytes);
            const neurons_info = result.toJSON() as any[] as NeuronInfoLite[];
            results_map[netuid] = neurons_info;
          })
          .catch((err: any) => {
            console.log(err);
            reject(err);
          });
      }
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
      const subnets_info = apiCtx.api.createType("Vec<SubnetInfo>", subnets_info_bytes);
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
              stake: (neuron.stake as any).tonumber(),
              uid: neuron.uid,
            };
          });
          _meta[netuid] = neurons_;
        }
      );
      return _meta;
    };

    account &&
      getMeta().then((_meta: Metagraph) => {
        setMeta(_meta);
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
                  stake: neuron.stake,
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
    const _getDelegateInfo = async () => {
      let delegateInfo = await getDelegateInfo();
      let delegateInfo_sorted = delegateInfo.sort((a, b) => {
        return b.total_stake - a.total_stake;
      });
      setDelegateInfo(delegateInfo_sorted);

      getDelegatesJson().then((delegates_json) => {
        setDelegatesExtras(delegates_json);
      })
    };

    mountedRef.current && _getDelegateInfo();
  }, [account, mountedRef]);

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
          <Tab label="Stake" icon={<TollIcon fontSize="small" />} />
        </Tabs>
      </Paper>

      <BurnrDivider />

      <Paper className={classes.root} square>
        <TabPanel value={value} index={0}>
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
              delegateInfo={delegateInfo}
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
