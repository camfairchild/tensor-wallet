import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api/promise/Api";
//import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import { logger } from "@polkadot/util/logger";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { NETWORKS, BURNR_WALLET } from "../../utils/constants";
import { useIsMountedRef } from "./useIsMountedRef";
import { ApiCtx } from "../../utils/types";

//import jsonCustomSpec from './nakamotoChainSpecRaw.json';
// Create the provider for the custom chain
//const customSpec = JSON.stringify(jsonCustomSpec);

const l = logger(BURNR_WALLET);

export const useApiCreate = (defaultnetwork: string): ApiCtx => {
  const [api, setApi] = useState<ApiPromise>({} as ApiPromise);
  const [network, setNetwork] = useState<string>(defaultnetwork);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    const choseSmoldot = async (endpoints: string[]): Promise<void> => {
      try {
        //const provider = new ScProvider(customSpec);
        const backupProvider = new WsProvider(endpoints);
        const backupapi = await ApiPromise.create({
          // types: {
          //   Balance: 'u64',
          //   PrometheusInfo: {
          //     block: 'u64', // --- Prometheus serving block.
          //     version: 'u32', // --- Prometheus version.
          //     ip: 'u128', // --- Prometheus u128 encoded ip address of type v6 or v4. serialized to string.
          //     port: 'u16', // --- Prometheus u16 encoded port.
          //     ip_type: 'u8', // --- Prometheus ip type, 4 for ipv4 and 6 for ipv6.
          //   },
          //   AxonInfo: {
          //     block: 'u64', // --- Axon serving block.
          //     version: 'u32', // --- Axon version
          //     ip: 'u128', // --- Axon u128 encoded ip address of type v6 or v4. serialized to string.
          //     port: 'u16', // --- Axon u16 encoded port.
          //     ip_type: 'u8', // --- Axon ip type, 4 for ipv4 and 6 for ipv6.
          //     protocol: 'u8', // --- Axon protocol. TCP, UDP, other.
          //     placeholder1: 'u8', // --- Axon proto placeholder 1.
          //     placeholder2: 'u8', // --- Axon proto placeholder 1.
          //   },
          //   NeuronInfo: {
          //     hotkey: 'AccountId',
          //     coldkey: 'AccountId',
          //     uid: 'Compact<u16>',
          //     netuid: 'Compact<u16>',
          //     active: 'bool',
          //     axon_info: 'AxonInfo',
          //     prometheus_info: 'PrometheusInfo',
          //     stake: 'Vec<(AccountId, Compact<u64>)>', // map of coldkey to stake on this neuron/hotkey (includes delegations)
          //     rank: 'Compact<u16>',
          //     emission: 'Compact<u64>',
          //     incentive: 'Compact<u16>',
          //     consensus: 'Compact<u16>',
          //     trust: 'Compact<u16>',
          //     validator_trust: 'Compact<u16>',
          //     dividends: 'Compact<u16>',
          //     last_update: 'Compact<u64>',
          //     validator_permit: 'bool',
          //     weights: 'Vec<(Compact<u16>, Compact<u16>)>', // Vec of (uid, weight)
          //     bonds: 'Vec<(Compact<u16>, Compact<u16>)>', // Vec of (uid, bond)
          //     pruning_score: 'Compact<u16>'
          //   },
          //   NeuronInfoLite: {
          //     hotkey: 'AccountId',
          //     coldkey: 'AccountId',
          //     uid: 'Compact<u16>',
          //     netuid: 'Compact<u16>',
          //     active: 'bool',
          //     axon_info: 'AxonInfo',
          //     prometheus_info: 'PrometheusInfo',
          //     stake: 'Vec<(AccountId, Compact<u64>)>', // map of coldkey to stake on this neuron/hotkey (includes delegations)
          //     rank: 'Compact<u16>',
          //     emission: 'Compact<u64>',
          //     incentive: 'Compact<u16>',
          //     consensus: 'Compact<u16>',
          //     trust: 'Compact<u16>',
          //     validator_trust: 'Compact<u16>',
          //     dividends: 'Compact<u16>',
          //     last_update: 'Compact<u64>',
          //     validator_permit: 'bool',
          //     pruning_score: 'Compact<u16>'
          //   },
          //   DelegateInfo: {
          //     delegate_ss58: 'AccountId',
          //     take: 'Compact<u16>',
          //     nominators: 'Vec<(AccountId, Compact<u64>)>', // map of nominator_ss58 to stake amount
          //     owner_ss58: 'AccountId',
          //     registrations: 'Vec<Compact<u16>>', // Vec of netuid this delegate is registered on
          //     validator_permits: 'Vec<Compact<u16>>', // Vec of netuid this delegate has validator permit on
          //     return_per_1000: 'Compact<u64>', // Delegators current daily return per 1000 TAO staked minus take fee
          //     total_daily_return: 'Compact<u64>', // Delegators current daily return
          //   },
          //   SubnetInfo: {
          //     netuid: 'Compact<u16>',
          //     rho: 'Compact<u16>',
          //     kappa: 'Compact<u16>',
          //     difficulty: 'Compact<u64>',
          //     immunity_period: 'Compact<u16>',
          //     validator_batch_size: 'Compact<u16>',
          //     validator_sequence_length: 'Compact<u16>',
          //     validator_epochs_per_reset: 'Compact<u16>',
          //     validator_epoch_length: 'Compact<u16>',
          //     max_allowed_validators: 'Compact<u16>',
          //     min_allowed_weights: 'Compact<u16>',
          //     max_weights_limit: 'Compact<u16>',
          //     scaling_law_power: 'Compact<u16>',
          //     synergy_scaling_law_power: 'Compact<u16>',
          //     subnetwork_n: 'Compact<u16>',
          //     max_allowed_uids: 'Compact<u16>',
          //     blocks_since_last_step: 'Compact<u64>',
          //     tempo: 'Compact<u16>',
          //     network_modality: 'Compact<u16>',
          //     network_connect: 'Vec<[u16; 2]>',
          //     emission_values: 'Compact<u64>',
          //     burn: 'Compact<u64>',
          //   },
          //   StakeInfo: {
          //     hotkey: "AccountId",
          //     coldkey: "AccountId",
          //     netuid: "Compact<u16>",
          //     stake: "Compact<u64>",
          //     locked: 'Compact<u64>',
          //     emission: 'Compact<u64>',
          //     drain: 'Compact<u64>',
          //     is_registered: 'bool',
          //   }
          // },
          // rpc: {
          //   neuronInfo: {
          //     getNeuronsLite: {
          //       description: 'Get neurons lite',
          //       params: [
          //         {
          //           name: 'netuid',
          //           type: 'u16',
          //         }
          //       ],
          //       type: 'Vec<u8>',
          //     },
          //     getNeuronLite: {
          //       description: 'Get neuron lite',
          //       params: [
          //         {
          //           name: 'netuid',
          //           type: 'u16',
          //         },
          //         {
          //           name: 'uid',
          //           type: 'u16',
          //         }
          //       ],
          //       type: 'Vec<u8>',
          //     },
          //     getNeurons: {
          //       description: 'Get neurons',
          //       params: [
          //         {
          //           name: 'netuid',
          //           type: 'u16',
          //         }
          //       ],
          //       type: 'Vec<u8>',
          //     },
          //     getNeuron: {
          //       description: 'Get neuron',
          //       params: [
          //         {
          //           name: 'netuid',
          //           type: 'u16',
          //         },
          //         {
          //           name: 'uid',
          //           type: 'u16',
          //         }
          //       ],
          //       type: 'Vec<u8>',
          //     },
          //   },
          //   delegateInfo: {
          //     getDelegates: {
          //       description: 'Get delegates info',
          //       params: [],
          //       type: 'Vec<u8>',
          //     },
          //   },
          //   subnetInfo: {
          //     getSubnetsInfo: {
          //       description: 'Get subnets info',
          //       params: [],
          //       type: 'Vec<u8>',
          //     },
          //     getSubnetInfo: {
          //       description: 'Get subnet info',
          //       params: [
          //         {
          //           name: 'netuid',
          //           type: 'u16',
          //         }
          //       ],
          //       type: 'Vec<u8>',
          //     },
          //   },
          // },
          provider: backupProvider,
        });
        l.log(`TensorWallet is now connected to the backup provider`);
        mountedRef.current && setApi(backupapi);

        console.log(backupapi.runtimeMetadata);

        // not connected to the provider
        /* TODO: Substrate connect isn't working with the nakamoto nodes yet


        backupProvider.on('connected', async () => {
          const backupapi = await ApiPromise.create({
            provider: backupProvider,
          });
          l.log(`TensorWallet is now connected to the backup provider`);
          //if (!provider.isConnected) {
            setApi(backupapi);
          //} else {
          //  await backupapi.disconnect();
          //}
        })

        // try to connect to the sc provider
        await provider.connect();
        // wait for connected
        provider.on('connected', (): void => {
            // probably good?
            // replace the old api with the new one
            ApiPromise.create({
              provider: provider,
            }).then(async (api_: ApiPromise): Promise<void> => {
              setApi(api_);
              // disconnect the old api
              await backupProvider.disconnect();
            });
        });*/
      } catch (err) {
        l.error("Error:", err);
      }
    };

    void choseSmoldot(NETWORKS[parseInt(network)].endpoints);
  }, [mountedRef, network]);

  return {
    api,
    network,
    setNetwork,
  };
};
