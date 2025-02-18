import {
  AccountId,
  Balance,
  FixedI128,
  Hash,
  Index,
  RefCount,
} from "@polkadot/types/interfaces";
import { u32 } from "@polkadot/types";
import { Codec } from "@polkadot/types/types";
import { ApiPromise } from "@polkadot/api/promise/Api";
import { KeyringPair } from "@polkadot/keyring/types";
import { HexString } from "@polkadot/util/types";

export interface Option {
  network: string;
  client: string | undefined;
  provider: string;
}

export interface SimpleProvider {
  name: string;
  id: string;
  client: string;
  endpoints: string[];
}

export interface Account {
  address: string;
  name: string;
}

export interface AccountCtx {
  accountAddress: string;
  accountName: string;
}

export interface LocalStorageAccountCtx extends AccountCtx {
  userHistory: EvtTxCtx;
}

export interface CreateAccountCtx {
  account: LocalStorageAccountCtx;
  setCurrentAccount: (account: LocalStorageAccountCtx) => void;
}

export interface AdminCtx {
  adminAddress: string;
  adminPair: KeyringPair;
  deriveAdmin: (userName: string) => string;
  treasuryAddress: string;
  userName: string;
}

export interface ApiCtx {
  api: ApiPromise;
  network: string;
  setNetwork: (network: string) => void;
}

export interface BalanceVisibilityCtx {
  balanceVisibility: boolean;
  setBalanceVisibility: (bal: boolean) => void;
}

export interface MgrEvent {
  when: Date;
  method: string;
  amount: Balance;
  address: string;
  key: string;
  wasSent: boolean | null;
  from: string | null;
  to: string;
}

export type EvtMgrCtx = MgrEvent[];

export interface TxEvent {
  withWhom: string;
  extrinsic: string;
  value: string | number;
  status: string | number;
  blockHash: Hash | null;
}

export type EvtTxCtx = TxEvent[];

export interface AccountData extends Codec {
  free: Balance;
  reserved: Balance;
  miscFrozen: Balance;
  feeFrozen: Balance;
  txCount: u32;
  sessionIndex: u32;
}

export interface AccountInfo extends Codec {
  nonce: Index;
  refcount: RefCount;
  data: AccountData;
}

export interface UserInfo {
  active: boolean;
  address: string;
  created: Date;
  balance: Balance;
  reserved: Balance;
  feeFrozen: Balance;
  miscFrozen: Balance;
}

export interface ExtrinsicInfo {
  status: string | number;
  blockHash: Hash | null;
}

export interface Data extends ExtrinsicInfo {
  withWhom: string;
  value: string | number;
  extrinsic: string;
}

export interface SizeScale {
  size?: "large" | "medium" | "small";
}

export interface Column {
  id: "withWhom" | "extrinsic" | "value" | "status" | "blockHash";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: "right";
}

export interface StakeInfo {
  hotkey: string;
  coldkey: string;
  netuid: number;
  stake: number | string;
}
export interface StakeData {
  [key: string]: StakeInfo[];
}

export interface StakeColumn {
  id: "hotkey" | "stake";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: "right";
}

export interface DelegateColumn {
  id:
    | "delegateSs58"
    | "ownerSs58"
    | "nominators"
    | "totalStake"
    | "take"
    | "stake";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: "right";
}

export interface DelegateInfoRow {
  delegateSs58: string;
  ownerSs58: string;
  nominators: number;
  totalStake: number;
  take: number;
  stake: number;
}

export interface Neuron {
  hotkey: string;
  coldkey: string;
  stake: {
    [key: string]: number;
  };
  uid: number;
}

export interface Metagraph {
  // [netuid: number]: Neuron[]
  [key: string]: Neuron[];
}

export interface SubnetState {
  netuid: number;
  hotkeys: string[];
  coldkeys: string[];
  active: boolean[];
  validatorPermit: boolean[];
  pruningScore: number[];
  lastUpdate: number[];
  emission: number[];
  dividends: number[];
  incentives: number[];
  consensus: number[];
  trust: number[];
  rank: number[];
  blockAtRegistration: number[];
  alphaStake: number[];
  taoStake: number[];
  totalStake: number[];
  emissionHistory: number[][];
}

export interface SubnetIdentityV2Raw {
  subnetName: number[];
  githubRepo: number[];
  subnetContact: number[];
  subnetUrl: number[];
  discord: number[];
  description: number[];
  additional: number[];
}

export interface SubnetIdentityV2 {
  subnetName: string;
  githubRepo: string;
  subnetContact: string;
  subnetUrl: string;
  discord: string;
  description: string;
  additional: string;
}

export interface FixedInt {
  bits: number;
}

export interface DynamicInfoRaw {
  netuid: number;
  ownerHotkey: AccountId;
  ownerColdkey: AccountId;
  subnetName: number[];
  tokenSymbol: number[];
  tempo: number;
  lastStep: number;
  blocksSinceLastStep: number;
  emission: number;
  alphaIn: number;
  alphaOut: number;
  taoIn: number;
  alphaOutEmission: number;
  alphaInEmission: number;
  taoInEmission: number;
  pendingAlphaEmission: number;
  pendingRootEmission: number;
  subnetVolume: number;
  networkRegisteredAt: number;
  subnetIdentity: SubnetIdentityV2Raw | null;
  movingPrice: FixedInt; // float
}

export interface DynamicInfo {
  netuid: number;
  ownerHotkey: AccountId;
  ownerColdkey: AccountId;
  subnetName: string; // from bytes, UTF-8
  tokenSymbol: string; // from bytes, UTF-8
  tempo: number;
  lastStep: number;
  blocksSinceLastStep: number;
  emission: number;
  alphaIn: number;
  alphaOut: number;
  taoIn: number;
  alphaOutEmission: number;
  alphaInEmission: number;
  taoInEmission: number;
  pendingAlphaEmission: number;
  pendingRootEmission: number;
  subnetVolume: number;
  networkRegisteredAt: number;
  subnetIdentity: SubnetIdentityV2 | null;
  movingPrice: number; // float
}

export interface AxonInfo {
  block: number; // --- Axon serving block.
  version: number; // --- Axon version
  ip: string; // --- Axon u128 encoded ip address of type v6 or v4. serialized to string.
  port: number; // --- Axon u16 encoded port.
  ipType: number; // --- Axon ip type, 4 for ipv4 and 6 for ipv6.
  protocol: number; // --- Axon protocol. TCP, UDP, other.
  placeholder1: number; // --- Axon proto placeholder 1.
  placeholder2: number; // --- Axon proto placeholder 1.
}

export interface PrometheusInfo {
  block: number; // --- Prometheus serving block.
  version: number; // --- Prometheus version.
  ip: string; // --- Prometheus u128 encoded ip address of type v6 or v4. serialized to string.
  port: number; // --- Prometheus u16 encoded port.
  ipType: number; // --- Prometheus ip type, 4 for ipv4 and 6 for ipv6.
}

export interface SubnetInfo {
  netuid: number;
  rho: number;
  kappa: number;
  difficulty: number;
  immunityPeriod: number;
  validatorBatchSize: number;
  validatorSequenceLength: number;
  validatorEpochsPerReset: number;
  validatorEpochLength: number;
  maxAllowedValidators: number;
  minAllowedWeights: number;
  maxWeightsLimit: number;
  scalingLawPower: number;
  synergyScalingLawPower: number;
  subnetworkN: number;
  maxAllowedUids: number;
  blocksSinceLastStep: number;
  tempo: number;
  networkModality: number;
  networkConnect: Array<number>;
  emissionValues: number;
}

export interface DelegateInfoRaw {
  delegateSs58: AccountId;
  take: number;
  nominators: Array<[AccountId, number]>;
  ownerSs58: AccountId;
}

export interface DelegateInfo {
  delegateSs58: string;
  take: number;
  nominators: Array<[string, number]>;
  ownerSs58: string;
  totalStake: number;
  stake: number; // user stake on this delegate
}

export interface NeuronInfo {
  hotkey: AccountId;
  coldkey: AccountId;
  uid: number;
  netuid: number;
  active: Boolean;
  axonInfo: AxonInfo;
  prometheusInfo: PrometheusInfo;
  stake: Array<[AccountId, number]>; // map of coldkey to stake on this neuron/hotkey (includes delegations)
  rank: number;
  emission: number;
  incentive: number;
  consensus: number;
  weightConsensus: number;
  trust: number;
  validatorTrust: number;
  dividends: number;
  lastUpdate: number;
  validatorPermit: Boolean;
  weights: Array<[number, number]>; // map of uid to weight
  bonds: Array<[number, number]>; // map of uid to bond
  pruningScore: number;
}

export interface NeuronInfoLite {
  hotkey: AccountId;
  coldkey: AccountId;
  uid: number;
  netuid: number;
  active: Boolean;
  axonInfo: AxonInfo;
  prometheusInfo: PrometheusInfo;
  stake: Array<[AccountId, number]>; // map of coldkey to stake on this neuron/hotkey (includes delegations)
  rank: number;
  emission: number;
  incentive: number;
  consensus: number;
  weightConsensus: number;
  trust: number;
  validatorTrust: number;
  dividends: number;
  lastUpdate: number;
  validatorPermit: Boolean;
  pruningScore: number;
}

export interface RawMetagraph {
  [netuid: string]: NeuronInfoLite[];
}

export interface DelegateExtra {
  name: string;
  url: string;
  description: string;
  signature: string;
  identity: Identity | null;
}

export interface DelegateExtras {
  [key: string]: DelegateExtra;
}

export interface Identity {
  name: string | null;
  image: string | null;
}

export interface PalletRegistryRegistration {
  deposit: string; // of a u128
  info: {
    display: string;
    legal: string;
    web: string;
    email: string;
    twitter: string;
    image: string;
    pgpFingerprint: string | null;
    riot: string;
    additional: any[];
  };
}

export interface PalletSubtensorChainIdentity {
  name: string;
  url: string;
  image: string;
  discord: string;
  description: string;
  additional: any;
}
