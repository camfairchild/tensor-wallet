# Tensor Wallet
A non-custodial, in-browser wallet for TAO (bittensor).  
Based on [burnr by PartiyTech](https://github.com/paritytech/substrate-connect/blob/830994056ba905f8bc7096ead1821b88efad94f7/projects/burnr/)  

# Legal Disclaimer
This software is not affiliated with the Opentensor Foundation.  
By using this software you agree to the terms of the LICENSE.  
You also agree that we, the authors of this software, are <strong>NOT</strong> liable for any loss of funds.    
This software is <strong>NOT</strong> audited and you are fully responsible for any risks you may incur.  
# Usage
You will need one of either:
- [Talisman](https://talisman.xyz/), or
- [Polkadotjs extension](https://polkadot.js.org/extension/)  

These allow you to manage your accounts on your browser and sign transactions locally.
This will keep your keys in your browser, on your device.     

## Signing Transactions
You will be asked to sign transactions for a transfer or a stake/unstake, when you try to complete one.  
This is normal.   
Be sure to verify the transaction sign request is coming from Tensor Wallet and not a different website.  

## Substrate Connect
Ideally, you should install the [substrate-connect](https://substrate.io/developers/substrate-connect/) browser extension.  
This will speed up the wallet and potentially reduce overhead if you use other light-client webapps for bittensor.  



<!-- ### Update Metadata
You must update your metadata with the Bittensor Nakamoto Mainnet metadata, when prompted.   
This ensures your browser extension (Talisman/polkadotjs) has the correct chain info.  -->

## Coldkeys
Coldkeys are automatically filled from the compatible extensions. You can add more coldkeys through either of their interfaces.  
You can switch between coldkeys using the dropdown arrow.  

You can also copy your address by clicking the icon next to it.  

## Hotkeys
Hotkeys are automatically pulled from the metagraph,  
and therefore you should see all the hotkeys that are registered to the current coldkey.

## Staking/Unstaking
You can use the Stake tab to stake and unstake from the hotkeys registered under your current coldkey.  
Make sure to refresh with the button to see newly registered hotkeys.  
