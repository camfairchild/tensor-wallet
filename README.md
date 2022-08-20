# Tensor Wallet
A light-client-based, non-custodial, in-browser wallet for Bittensor.  
Based on [burnr by PartiyTech](https://github.com/paritytech/substrate-connect/blob/830994056ba905f8bc7096ead1821b88efad94f7/projects/burnr/)  

# Usage
## Substrate Connect
Ideally, you should install the [substrate-connect](https://substrate.io/developers/substrate-connect/) browser extension.  
This will speed up the wallet and potentially reduce overhead if you use other light-client webapps for bittensor.  

## Signing Transactions
You can use either:
- [Talisman](https://talisman.xyz/), or
- [Polkadotjs extension](https://polkadot.js.org/extension/)  

This will keep your keys in your browser, on your device.  

### Update Metadata
You must update your metadata with the Bittensor Nakamoto Mainnet metadata, when prompted.   
This ensures your browser extension (Talisman/polkadotjs) has the correct chain info.  

## Adding Hotkeys
You can add hotkeys using the UI.  
They will be encrypted with the coldkey you add them under, and stored in a cookie, in your browser.   
However, if your cookies are cleared, or you use a different browser, you will lose all the hotkeys you have added, so please keep your mnemonics offline.  

### Database option
In settings, you can enable the option to store your encrypted data in the tensor-wallet database.  
Then, when you login, it will be retrieved and decrypted.  
