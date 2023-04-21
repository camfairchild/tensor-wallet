import { AccountId, Balance, Hash, Index, RefCount } from "@polkadot/types/interfaces"
import { u32 } from "@polkadot/types"
import { Codec } from "@polkadot/types/types"
import { ApiPromise } from "@polkadot/api/promise/Api"
import { KeyringPair } from "@polkadot/keyring/types"
import { HexString } from "@polkadot/util/types"

export interface Option {
  network: string
  client: string | undefined
  provider: string
}

export interface SimpleProvider {
  name: string
  id: string
  client: string
  endpoints: string[]
}

export interface Account {
  address: string
  name: string
}

export interface AccountCtx {
  accountAddress: string
  accountName: string
}

export interface LocalStorageAccountCtx extends AccountCtx {
  userHistory: EvtTxCtx
}

export interface CreateAccountCtx {
  account: LocalStorageAccountCtx
  setCurrentAccount: (account: LocalStorageAccountCtx) => void
}

export interface AdminCtx {
  adminAddress: string
  adminPair: KeyringPair
  deriveAdmin: (userName: string) => string
  treasuryAddress: string
  userName: string
}

export interface ApiCtx {
  api: ApiPromise,
  network: string,
  setNetwork: (network: string) => void,
}

export interface BalanceVisibilityCtx {
  balanceVisibility: boolean
  setBalanceVisibility: (bal: boolean) => void
}

export interface MgrEvent {
  when: Date
  method: string
  amount: Balance
  address: string
  key: string
  wasSent: boolean | null
  from: string | null
  to: string
}

export type EvtMgrCtx = MgrEvent[]

export interface TxEvent {
  withWhom: string
  extrinsic: string
  value: string | number
  status: string | number
  blockHash: Hash | null
}

export type EvtTxCtx = TxEvent[]

export interface AccountData extends Codec {
  free: Balance
  reserved: Balance
  miscFrozen: Balance
  feeFrozen: Balance
  txCount: u32
  sessionIndex: u32
}

export interface AccountInfo extends Codec {
  nonce: Index
  refcount: RefCount
  data: AccountData
}

export interface UserInfo {
  active: boolean
  address: string
  created: Date
  balance: Balance
  reserved: Balance
  feeFrozen: Balance
  miscFrozen: Balance
}

export interface ExtrinsicInfo {
  status: string | number
  blockHash: Hash | null
}

export interface Data extends ExtrinsicInfo {
  withWhom: string
  value: string | number
  extrinsic: string
}

export interface SizeScale {
  size?: "large" | "medium" | "small"
}

export interface Column {
  id: "withWhom" | "extrinsic" | "value" | "status" | "blockHash"
  label: string
  minWidth?: number
  maxWidth?: number
  width?: number
  align?: "right"
}

export interface StakeInfo {
  address: string
  stake: number | string
}
export interface StakeData {
  [key: string]: StakeInfo[]
}

export interface StakeColumn {
  id: "address" | "stake"
  label: string
  minWidth?: number
  maxWidth?: number
  width?: number
  align?: "right"
}

export interface DelegateColumn {
  id: "delegate_ss58" | "owner_ss58" | "nominators" | "total_stake" | "take" | "stake"
  label: string
  minWidth?: number
  maxWidth?: number
  width?: number
  align?: "right"
}

export interface DelegateInfoRow {
  delegate_ss58: string
  owner_ss58: string
  nominators: number
  total_stake: number
  take: number
  stake: number
}

export interface Neuron {
  hotkey: string
  coldkey: string
  stake: {
    [key: string]: number
  }
  uid: number
}

export interface Metagraph {
  // [netuid: number]: Neuron[]
  [key: string]: Neuron[]
}

export interface AxonInfo {
  block: number, // --- Axon serving block.
  version: number, // --- Axon version
  ip: string, // --- Axon u128 encoded ip address of type v6 or v4. serialized to string.
  port: number, // --- Axon u16 encoded port.
  ip_type: number, // --- Axon ip type, 4 for ipv4 and 6 for ipv6.
  protocol: number, // --- Axon protocol. TCP, UDP, other.
  placeholder1: number, // --- Axon proto placeholder 1.
  placeholder2: number // --- Axon proto placeholder 1.
}

export interface PrometheusInfo {
  block: number, // --- Prometheus serving block.
  version: number, // --- Prometheus version.
  ip: string, // --- Prometheus u128 encoded ip address of type v6 or v4. serialized to string.
  port: number, // --- Prometheus u16 encoded port.
  ip_type: number, // --- Prometheus ip type, 4 for ipv4 and 6 for ipv6.
}

export interface SubnetInfo {
  netuid: number,
  rho: number,
  kappa: number,
  difficulty: number,
  immunity_period: number,
  validator_batch_size: number,
  validator_sequence_length: number,
  validator_epochs_per_reset: number,
  validator_epoch_length: number,
  max_allowed_validators: number,
  min_allowed_weights: number,
  max_weights_limit: number,
  scaling_law_power: number,
  synergy_scaling_law_power: number,
  subnetwork_n: number,
  max_allowed_uids: number,
  blocks_since_last_step: number,
  tempo: number,
  network_modality: number,
  network_connect: Array<number>,
  emission_values: number
}

export interface DelegateInfoRaw {
  delegate_ss58: AccountId,
  take: number,
  nominators: Array<[AccountId, number]>,
  owner_ss58: AccountId
}

export interface DelegateInfo {
  delegate_ss58: string,
  take: number,
  nominators: Array<[string, number]>,
  owner_ss58: string,
  total_stake: number,
}

export interface NeuronInfo {
  hotkey: AccountId
  coldkey: AccountId
  uid: number
  netuid: number
  active: Boolean
  axon_info: AxonInfo
  prometheus_info: PrometheusInfo
  stake: Array<[AccountId, number]> // map of coldkey to stake on this neuron/hotkey (includes delegations)
  rank: number
  emission: number
  incentive: number
  consensus: number
  weight_consensus: number
  trust: number
  validator_trust: number
  dividends: number
  last_update: number
  validator_permit: Boolean
  weights: Array<[number, number]> // map of uid to weight
  bonds: Array<[number, number]> // map of uid to bond
  pruning_score: number
}


export interface NeuronInfoLite {
  hotkey: AccountId
  coldkey: AccountId
  uid: number
  netuid: number
  active: Boolean
  axon_info: AxonInfo
  prometheus_info: PrometheusInfo
  stake: Array<[AccountId, number]> // map of coldkey to stake on this neuron/hotkey (includes delegations)
  rank: number
  emission: number
  incentive: number
  consensus: number
  weight_consensus: number
  trust: number
  validator_trust: number
  dividends: number
  last_update: number
  validator_permit: Boolean
  pruning_score: number
}

export interface RawMetagraph {
  [netuid: string]: NeuronInfoLite[]
}

export interface DelegateExtra {
  name: string
  url: string
  description: string
  signature: string
}

export interface DelegateExtras {
  [key: string ]: DelegateExtra
}