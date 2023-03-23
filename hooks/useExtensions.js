// Copyright 2017-2022 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { web3Enable, } from '@polkadot/extension-dapp';
import { useEffect, useMemo, useState } from 'react';
import store from 'store';
import { useApi } from '../hooks/api/useApi';
import { createNamedHook } from '../hooks/createNamedHook';
let triggerCount = 0;
const triggers = new Map();
function triggerAll() {
    [...triggers.values()].forEach((trigger) => trigger(Date.now()));
}
// save the properties for a specific extension
function saveProperties(api, { name, version }) {
    const storeKey = `properties:${api.genesisHash.toHex()}`;
    const allProperties = store.get(storeKey, {});
    allProperties[name] = {
        extensionVersion: version,
        ss58Format: api.registry.chainSS58,
        tokenDecimals: api.registry.chainDecimals[0],
        tokenSymbol: api.registry.chainTokens[0]
    };
    store.set(storeKey, allProperties);
}
// determines if the extension has current properties
function hasCurrentProperties(api, { extension }) {
    const allProperties = store.get(`properties:${api.genesisHash.toHex()}`, {});
    // when we don't have properties yet, assume nothing has changed and store
    if (!allProperties[extension.name]) {
        saveProperties(api, extension);
        return true;
    }
    const { ss58Format, tokenDecimals, tokenSymbol } = allProperties[extension.name];
    return ss58Format === api.registry.chainSS58 &&
        tokenDecimals === api.registry.chainDecimals[0] &&
        tokenSymbol === api.registry.chainTokens[0];
}
// filter extensions based on the properties we have available
function filterAll(api, all) {
    const extensions = all
        .map((info) => {
        const current = info.known.find(({ genesisHash }) => api.genesisHash.eq(genesisHash)) || null;
        // if we cannot find it as known, or either the specVersion or properties mismatches, mark it as upgradable
        return !current || api.runtimeVersion.specVersion.gtn(current.specVersion) || !hasCurrentProperties(api, info)
            ? { ...info, current }
            : null;
    })
        .filter((info) => !!info);
    return {
        count: extensions.length,
        extensions
    };
}
async function getExtensionInfo(api, extension) {
    if (!extension.metadata) {
        return null;
    }
    try {
        const metadata = extension.metadata;
        const known = await metadata.get();
        return {
            extension,
            known,
            update: async (def) => {
                let isOk = false;
                try {
                    isOk = await metadata.provide(def);
                    if (isOk) {
                        saveProperties(api, extension);
                        triggerAll();
                    }
                }
                catch (error) {
                    // ignore
                }
                return isOk;
            }
        };
    }
    catch (error) {
        return null;
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getKnown(api, extensions, _) {
    const all = await Promise.all(extensions.map((extension) => getExtensionInfo(api, extension)));
    return all.filter((info) => !!info);
}
const EMPTY_STATE = { count: 0, extensions: [] };
function useExtensionsImpl() {
    const extensions = web3Enable('Tensor Wallet');
    const { api } = useApi();
    const [isApiReady, setApiReady] = useState(false);
    const [all, setAll] = useState();
    const [trigger, setTrigger] = useState(0);
    useEffect(() => {
        const myId = `${++triggerCount}-${Date.now()}`;
        triggers.set(myId, setTrigger);
        return () => {
            triggers.delete(myId);
        };
    }, []);
    useEffect(() => {
        extensions.then((ext) => {
            getKnown(api, ext, trigger).then(setAll);
        });
        api.isReady.then((isApiReady_) => {
            setApiReady(!!isApiReady_);
        });
    }, [api, extensions, trigger]);
    return useMemo(() => !isApiReady || !all
        ? EMPTY_STATE
        : filterAll(api, all), [all, api, isApiReady]);
}
export default createNamedHook('useExtensions', useExtensionsImpl);
