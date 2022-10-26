import { Balance, Hash, Index, RefCount } from "@polkadot/types/interfaces"
import { u32 } from "@polkadot/types"
import { Codec } from "@polkadot/types/types"
import { ApiPromise } from "@polkadot/api/promise/Api"
import { KeyringPair } from "@polkadot/keyring/types"

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

export interface StakeData {
  address: string
  stake: number | string
}

export interface StakeColumn {
  id: "address" | "stake"
  label: string
  minWidth?: number
  maxWidth?: number
  width?: number
  align?: "right"
}

export interface Neuron {
  hotkey: string
  coldkey: string
  stake: number
  uid: number
}