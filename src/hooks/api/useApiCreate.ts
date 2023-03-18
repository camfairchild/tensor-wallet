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
        await backupProvider.connect();
        const backupapi = await ApiPromise.create({
          types: {
            DeAccountId: {
              id: 'Vec<u8>',
            },
            PrometheusInfo: {
              block: 'u64', // --- Prometheus serving block.
              version: 'u32', // --- Prometheus version.
              ip: 'String', // --- Prometheus u128 encoded ip address of type v6 or v4. serialized to string.
              port: 'u16', // --- Prometheus u16 encoded port.
              ip_type: 'u8', // --- Prometheus ip type, 4 for ipv4 and 6 for ipv6.
            },
            AxonInfo: {
              block: 'u64', // --- Axon serving block.
              version: 'u32', // --- Axon version
              ip: 'String', // --- Axon u128 encoded ip address of type v6 or v4. serialized to string.
              port: 'u16', // --- Axon u16 encoded port.
              ip_type: 'u8', // --- Axon ip type, 4 for ipv4 and 6 for ipv6.
              protocol: 'u8', // --- Axon protocol. TCP, UDP, other.
              placeholder1: 'u8', // --- Axon proto placeholder 1.
              placeholder2: 'u8', // --- Axon proto placeholder 1.
            },
            NeuronInfo: {
              hotkey: 'DeAccountId',
              coldkey: 'DeAccountId',
              uid: 'u16',
              netuid: 'u16',
              active: 'bool',
              axon_info: 'AxonInfo',
              prometheus_info: 'PrometheusInfo',
              stake: 'Vec<(DeAccountId, u64)>', // map of coldkey to stake on this neuron/hotkey (includes delegations)
              rank: 'u16',
              emission: 'u64',
              incentive: 'u16',
              consensus: 'u16',
              weight_consensus: 'u16',
              trust: 'u16',
              validator_trust: 'u16',
              dividends: 'u16',
              last_update: 'u64',
              validator_permit: 'bool',
              weights: 'Vec<(u16, u16)>', // map of uid to weight
              bonds: 'Vec<(u16, u16)>', // map of uid to bond
              pruning_score: 'u16'
            },
            DelegateInfo: {
              delegate_ss58: 'DeAccountId',
              take: 'u16',
              nominators: 'Vec<(DeAccountId, u64)>',
              owner_ss58: 'DeAccountId'
            },
            SubnetInfo: {
              netuid: 'u16',
              rho: 'u16',
              kappa: 'u16',
              difficulty: 'u64',
              immunity_period: 'u16',
              validator_batch_size: 'u16',
              validator_sequence_length: 'u16',
              validator_epochs_per_reset: 'u16',
              validator_epoch_length: 'u16',
              max_allowed_validators: 'u16',
              min_allowed_weights: 'u16',
              max_weights_limit: 'u16',
              scaling_law_power: 'u16',
              synergy_scaling_law_power: 'u16',
              subnetwork_n: 'u16',
              max_allowed_uids: 'u16',
              blocks_since_last_step: 'u64',
              tempo: 'u16',
              network_modality: 'u16',
              network_connect: 'Vec<u16>',
              emission_values: 'u64'
            }
          },
          rpc: {
            neuronInfo: {
              getNeurons: {
                description: 'Get neurons',
                params: [
                  {
                    name: 'netuid',
                    type: 'u16',
                  }
                ],
                type: 'Vec<NeuronInfo>',
              },
              getNeuron: {
                description: 'Get neuron',
                params: [
                  {
                    name: 'netuid',
                    type: 'u16',
                  },
                  {
                    name: 'uid',
                    type: 'u16',
                  }
                ],
                type: 'NeuronInfo',
              },
            },
            delegateInfo: {
              getDelegates: {
                description: 'Get delegates info',
                params: [],
                type: 'Vec<DelegateInfo>',
              },
            },
            subnetInfo: {
              getSubnetsInfo: {
                description: 'Get subnets info',
                params: [],
                type: 'Vec<SubnetInfo>',
              },
              getSubnetInfo: {
                description: 'Get subnet info',
                params: [
                  {
                    name: 'netuid',
                    type: 'u16',
                  }
                ],
                type: 'SubnetInfo',
              },
            },
          },
          provider: backupProvider,
        });
        l.log(`TensorWallet is now connected to the backup provider`);
        mountedRef.current && setApi(backupapi);

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
