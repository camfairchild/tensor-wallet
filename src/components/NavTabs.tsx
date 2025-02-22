import {
  FunctionComponent,
  useContext,
  useState,
  ChangeEvent,
  ReactNode,
  useEffect,
} from "react";
import { Theme } from "@mui/material/styles";

import makeStyles from '@mui/styles/makeStyles';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SwapHorizSharpIcon from "@mui/icons-material/SwapHorizSharp";
import CallMadeSharpIcon from "@mui/icons-material/CallMadeSharp";
import CallReceivedSharpIcon from "@mui/icons-material/CallReceivedSharp";
import TollIcon from "@mui/icons-material/Toll";
import HubIcon from "@mui/icons-material/Hub";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  Neuron,
  Metagraph,
  StakeInfo,
  DelegateInfo,
  DelegateExtras,
  LocalStorageAccountCtx,
} from "../utils/types";

import {
  SendFundsForm,
  ReceiveFundsForm,
  BurnrDivider,
  HistoryTable,
  StakeTab,
  NeuronsTab,
  ErrorBoundary,
} from ".";

import { useApi } from "../hooks";
import { AccountContext } from "../utils/contexts";
import { CreateAccountCtx } from "../utils/types";
import { useIsMountedRef } from "../hooks/api/useIsMountedRef";
import { getAllSubnets, getDelegateInfo, getDelegatesJson, getStakeInfoForColdkey } from "../utils/api";
import { SubnetProvider } from "./SubnetSelector";
import { sortDelegatesRows } from "../utils/utils";

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

    [theme.breakpoints.down('md')]: {
      minHeight: "calc(100vh - 320px)",
    },
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
  },
  rootHeading: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.primary,
  },
  rootTabs: {
    "& 	.MuiTabs-root": {
      minHeight: theme.spacing(8),
      ...theme.typography.overline,
      lineHeight: 1,
    }
  },
  icon: {
    color: theme.palette.text.primary,
  },
  selectedTab: {
    color: theme.palette.text.primary,
  },
  tabPanel: {
    minHeight: "500px",
  }
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
        <Box p={3} className={`${classes.paper} ${classes.tabPanel}`} >
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

  const apiCtx = useApi();

  const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
    if (newValue === 3) {
      // refresh the page when the tab is clicked
      // but only do this once
      refreshMeta();
    }
    setValue(newValue);
  };

  const [stakeData, setStakeData] = useState<StakeInfo[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [rowLoader, setRowLoader] = useState<boolean>(true);
  const [delegateLoader, setDelegateLoader] = useState<boolean>(true);
  const [delegateInfo, setDelegateInfo] = useState<DelegateInfo[]>([]);
  const [delegateRows, setDelegateRows] = useState<DelegateInfo[]>([]);
  const [delegatesExtras, setDelegatesExtras] = useState<DelegateExtras>({});
  const [subnets, setSubnets] = useState<number[]>([]);

  const getRows = async (account: LocalStorageAccountCtx) => {
    const stakeInfo = await getStakeInfoForColdkey (apiCtx.api, account.accountAddress);
    setStakeData(stakeInfo);
  };

  const getSubnets = async (): Promise<number[]> => {
    const subnets = await getAllSubnets(apiCtx.api);
    return subnets;
  };

  const refreshMeta = async () => {
    setDelegateLoader(true);
    setRowLoader(true);
  
    const _getDelegateInfo = async (): Promise<[DelegateInfo[], DelegateExtras]> => {
      const delegates_json = await getDelegatesJson();
      const delegateInfo = await getDelegateInfo(apiCtx.api);
      return [delegateInfo, delegates_json];
    };

    account && getRows(
      account
    ).then(() => {
      setRowLoader(false);
      setLoader(false);
    });
    account && _getDelegateInfo().then(([delegateInfo, delegates_json]) => {
      setDelegateInfo(delegateInfo);
      setDelegatesExtras(delegates_json);

      setLoader(false);
      setDelegateLoader(false);
    });
    
    getSubnets().then((subnets) => {
      setSubnets(subnets);
    });
  };

  useEffect(() => {
    const refereshOnAccountChange = () => {
      setRowLoader(true);
      getRows(
        account
      ).then(() => {
        setRowLoader(false);
      });
    };

    account && refereshOnAccountChange();
  }, [account, apiCtx.api]);

  useEffect(() => {
    const prepareDelegateRows = (delegateInfo: DelegateInfo[], delegatesExtras: DelegateExtras, account_addr: string) => {
      sortDelegatesRows(delegateInfo);
      
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
          <Tab
            label="Neurons"
            icon={<HubIcon fontSize="small" className={classes.icon} />} 
            disabled={true}
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
            <SubnetProvider defaultNetuid={null}>
              <StakeTab
                delegateInfo={delegateRows}
                stakeData={stakeData}
                loader={loader}
                delegateLoader={delegateLoader}
                refreshMeta={refreshMeta}
                delegatesExtras={delegatesExtras}
                subnets={subnets}
              />
            </SubnetProvider>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <ErrorBoundary>
            <Stack spacing={2} direction="row">
              <Typography variant="h6" className={classes.rootHeading}>
                Neurons
              </Typography>
              <Button
                onClick={() => refreshMeta()}
                startIcon={<RefreshIcon />}
              />
            </Stack>
            <NeuronsTab
              stakeData={stakeData}
              loader={loader}
              rowLoader={rowLoader}
              refreshMeta={refreshMeta}
              delegateInfo={delegateRows}
              subnets={subnets}
            />
          </ErrorBoundary>
        </TabPanel>
      </Paper>
    </>
  );
};

export default NavTabs;
