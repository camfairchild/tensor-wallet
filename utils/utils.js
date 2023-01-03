import { Keyring, decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex, formatBalance } from "@polkadot/util";
import { NETWORKS } from "./constants";
const keyring = new Keyring({ type: "sr25519" });
export const getName = (account) => `${account.name}`;
export const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow)
        newWindow.opener = null;
};
export const downloadFile = (fileName, data, type) => {
    const anchor = window.document.createElement("a");
    anchor.href = window.URL.createObjectURL(new Blob([data], { type: `application/${type}` }));
    anchor.download = `${type === "txt" ? "seedphrase-" : ""}${fileName}.${type}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(anchor.href);
};
export const createAccountFromInjected = (accounts) => {
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
export const isEmpty = (obj) => typeof obj === "object" &&
    obj !== null &&
    Object.keys(obj).length === 0 &&
    obj.constructor === Object;
export const copyToClipboard = (text) => {
    // copy to clipboard with fallback if not supported
    navigator.clipboard.writeText(text).catch(() => {
        // try normal way
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    });
};
export const getKeyring = () => keyring;
export const transformCurrency = (currencyLevel, currency) => currencyLevel !== "-" ? currencyLevel.concat(currency) : currency;
export const isValidAddressPolkadotAddress = (address = "") => {
    try {
        encodeAddress(isHex(address) ? hexToU8a(address.toString()) : decodeAddress(address));
        return true;
    }
    catch (error) {
        return false;
    }
};
/*
 * format once with @polkadot/util formatBalance,
 * then strip the trailing Unit and make it to 2 decimal points
 */
export const prettyBalance = (rawBalance) => {
    if ((typeof rawBalance === "number" && rawBalance === 0) || !rawBalance) {
        return "0";
    }
    else if (rawBalance.toString() === "0") {
        return rawBalance.toString();
    }
    // Use `api.registry.chainDecimals` instead of decimals
    const firstPass = formatBalance(rawBalance, {
        decimals: 9,
        forceUnit: "-",
        withSi: false,
    });
    return firstPass.slice(0, firstPass.length);
};
export const humanReadable = (amnt, api) => (amnt / Math.pow(10, 9)).toFixed(6);
export const validateLocalstorage = () => {
    // expected acceptable values of localStorage.
    // Add type info to avoid having to cast
    const expectedValues = {
        theme: ["true", "false"],
        balanceVisibility: ["true", "false"],
        network: Array.from({ length: NETWORKS.length - 1 }, (x, i) => i.toString()),
        endpoint: NETWORKS.map((network) => network.id),
    };
    Object.keys(expectedValues).forEach((key) => {
        if (!Object.keys(localStorage).includes(key)) {
            return;
        }
        if (!expectedValues[key].includes(localStorage[key])) {
            localStorage.removeItem(key);
        }
    });
};
