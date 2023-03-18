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
import { encodeAddress } from "@polkadot/keyring";
import { SS58_FORMAT } from "../utils/constants";

import {
  Neuron,
  Metagraph,
  StakeInfo,
  RawMetagraph,
  NeuronInfo,
  SubnetInfo,
  DelegateInfo,
  DelegateInfoRaw,
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
import { parseDeAccountId } from "../utils/utils";

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

  const getNeurons = (netuids: Array<number>): Promise<RawMetagraph> => {
    return new Promise<RawMetagraph>(async (resolve, reject) => {
      let results_map: RawMetagraph = {};
      for (let netuid of netuids) {
        (apiCtx.api.rpc as any).neuronInfo
          .getNeurons(netuid)
          .then((result: any) => {
            const neurons_info = result.toJSON();
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
    const result = await (apiCtx.api.rpc as any).delegateInfo.getDelegates();
    const delegate_info_raw: DelegateInfoRaw[] = result.toJSON() as DelegateInfoRaw[];
    console.log("delegate info raw", delegate_info_raw)
    const delegate_info = delegate_info_raw.map((delegate: DelegateInfoRaw) => {
      return {
        take: delegate.take / (2**16 - 1), // Normalize take, which is a u16
        delegate_ss58: parseDeAccountId(delegate.delegate_ss58),
        owner_ss58: parseDeAccountId(delegate.owner_ss58),
        nominators: delegate.nominators.map(([nominator, staked]) => {
          return [
            parseDeAccountId(nominator),
            staked,
          ] as [string, number];
        }),
      };
    });

    console.log("delegate info", delegate_info);

    return delegate_info;
  };

  const refreshMeta = async () => {
    const getMeta = async (): Promise<Metagraph> => {
      setLoader(true);

      const subnets_info = await (
        apiCtx.api.rpc as any
      ).subnetInfo.getSubnetsInfo();
      const netuids: Array<number> = (subnets_info as any)
        .toJSON()
        .map((subnetInfo: SubnetInfo) => {
          return subnetInfo.netuid;
        });

      let _meta: Metagraph = {};

      const result: RawMetagraph = await getNeurons(netuids);
      Object.entries(result).forEach(
        ([netuid, neurons]: [string, NeuronInfo[]]) => {
          let neurons_ = neurons.map((neuron: NeuronInfo) => {
            return {
              hotkey: parseDeAccountId(neuron.hotkey),
              coldkey: parseDeAccountId(neuron.coldkey),
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
      const delegateInfo = await getDelegateInfo();
      setDelegateInfo(delegateInfo);
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
            />
          </ErrorBoundary>
        </TabPanel>
      </Paper>
    </>
  );
};

export default NavTabs;
