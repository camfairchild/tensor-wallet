import React from "react";
import { ApiPromise } from "@polkadot/api/promise/Api";
import { Account, LocalStorageAccountCtx } from "./types";
import { Keyring, decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex, formatBalance, BN } from "@polkadot/util";
import type { Balance } from "@polkadot/types/interfaces";
import { NETWORKS, SS58_FORMAT } from "./constants";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

const keyring = new Keyring({ type: "sr25519" });

export const getName = (account: Account): string => `${account.name}`;

export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const downloadFile = (
  fileName: string,
  data: string,
  type: string
): void => {
  const anchor = window.document.createElement("a");
  anchor.href = window.URL.createObjectURL(
    new Blob([data], { type: `application/${type}` })
  );
  anchor.download = `${type === "txt" ? "seedphrase-" : ""}${fileName}.${type}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
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
  // copy to clipboard with fallback if not supported
  navigator.clipboard.writeText(text).catch(() => {
      // try normal way
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy );
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
  });
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

/*
 * format once with @polkadot/util formatBalance,
 * then strip the trailing Unit and make it to 2 decimal points
 */
export const prettyBalance = (rawBalance: Balance | BN | number, api: ApiPromise): string => {
  if ((typeof rawBalance === "number" && rawBalance === 0) || !rawBalance) {
    return "0";
  } else if (rawBalance.toString() === "0") {
    return rawBalance.toString();
  }

  if (rawBalance instanceof BN) {
    rawBalance = rawBalance.toNumber();
  } 
  
  const firstPass = humanReadable(rawBalance, api);

  return firstPass.slice(0, firstPass.length);
};

export const humanReadable = (amnt: number, api: ApiPromise): string => {
  const decimals = api.registry.chainDecimals[0];
  const asString = amnt.toString();)
  const addDecimal = asString.length - decimals;
  const firstPass = asString.slice(0, addDecimal) + "." + asString.slice(addDecimal);
  return firstPass;
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
