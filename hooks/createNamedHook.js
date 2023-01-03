// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0
export function createNamedHook(name, fn) {
    return (...args) => {
        try {
            // eslint-disable-next-line
            return fn(...args);
        }
        catch (error) {
            throw new Error(`${name}:: ${error.message}:: ${error.stack || '<unknown>'}`);
        }
    };
}
