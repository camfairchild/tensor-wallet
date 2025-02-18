import React from "react";
import { ApiPromise } from "@polkadot/api/promise/Api";
import { Account, DelegateInfo, LocalStorageAccountCtx } from "./types";
import { Keyring, decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex, formatBalance, BN } from "@polkadot/util";
import type { Balance } from "@polkadot/types/interfaces";
import { NETWORKS, SS58_FORMAT } from "./constants";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

const keyring = new Keyring({ type: "sr25519" });

export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const createAccountFromInjected = (
  accounts: InjectedAccountWithMeta[]
): LocalStorageAccountCtx => {
  if (accounts.length === 0) {
    throw new Error("No accounts found");
  }
  const web3account = accounts[0];
  const name = web3account.meta.name;
  return {
    accountAddress: web3account.address,
    accountName: name || "",
    userHistory: [],
  };
};

export const isEmpty = (obj: unknown): boolean =>
  typeof obj === "object" &&
  obj !== null &&
  Object.keys(obj).length === 0 &&
  obj.constructor === Object;

export const copyToClipboard = (text: string): void => {
  if (window.isSecureContext) {
    // copy to clipboard with fallback if not supported
    navigator.clipboard.writeText(text).catch(() => {
      console.error("Failed to copy to clipboard");
    });
  }
};

export const getKeyring = (): Keyring => keyring;

export const transformCurrency = (
  currencyLevel: string,
  currency: string
): string =>
  currencyLevel !== "-" ? currencyLevel.concat(currency) : currency;

export const isValidAddressPolkadotAddress = (address = ""): boolean => {
  try {
    encodeAddress(
      isHex(address) ? hexToU8a(address.toString()) : decodeAddress(address)
    );

    return true;
  } catch (error) {
    return false;
  }
};


export const prettyBalance = (rawBalance: Balance | BN | number, api: ApiPromise, round: boolean = true): string => {
  if ((typeof rawBalance === "number" && rawBalance === 0) || !rawBalance) {
    return "0";
  } else if (rawBalance.toString() === "0") {
    return rawBalance.toString();
  }

  if (rawBalance instanceof BN) {
    rawBalance = rawBalance.toNumber();
  } 

  const firstPass = humanReadable(rawBalance, api, round);

  return firstPass;
};


export const humanReadable = (amnt: number, api: ApiPromise, round: boolean = true): string => {
  const decimals = api.registry.chainDecimals[0];
  
  let options: any = { notation: 'compact', compactDisplay: 'short', minimumFractionDigits: 3, maximumFractionDigits: 3 };
  if (!round) {
    options = { maximumFractionDigits: 9 };
  }
  const formatter = Intl.NumberFormat('en', options);

  
  const normalized = amnt / Math.pow(10, decimals);
  const compacted = formatter.format(normalized);

  return compacted;
}

export const validateLocalstorage = (): void => {
  // expected acceptable values of localStorage.
  // Add type info to avoid having to cast
  const expectedValues: Record<string, string[]> = {
    theme: ["true", "false"],
    balanceVisibility: ["true", "false"],
    network: Array.from({ length: NETWORKS.length - 1 }, (x, i) =>
      i.toString()
    ),
    endpoint: NETWORKS.map((network) => network.id),
  };

  Object.keys(expectedValues).forEach((key) => {
    if (!Object.keys(localStorage).includes(key)) {
      return;
    }

    if (!expectedValues[key].includes(localStorage[key] as string)) {
      localStorage.removeItem(key);
    }
  });
};

export function sortDelegatesRows(delegateInfo: DelegateInfo[]) {
  const latent_delegate_hotkey =
    "5CoZxgtfhcJKX2HmkwnsN18KbaT9aih9eF3b6qVPTgAUbifj";
  delegateInfo.sort((a, b) => {
    return (
      b.stake - a.stake ||
      (a.delegateSs58 === latent_delegate_hotkey ? -1 : 0) ||
      (b.delegateSs58 === latent_delegate_hotkey ? 1 : 0) ||
      b.totalStake - a.totalStake
    );
  });
}
