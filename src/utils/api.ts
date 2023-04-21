import { ApiPromise } from "@polkadot/api/promise/Api";
import { NeuronInfoLite, RawMetagraph, DelegateInfo, DelegateInfoRaw, SubnetInfo, Metagraph, DelegateExtras } from "./types";
import { AccountId } from "@polkadot/types/interfaces";

export async function getNeurons(api: ApiPromise, netuids: Array<number>): Promise<RawMetagraph> {
    return new Promise<RawMetagraph>(async (resolve, reject) => {
      let results_map: RawMetagraph = {};
      for (let netuid of netuids) {
        try {
          let result_bytes = await (api.rpc as any).neuronInfo
            .getNeuronsLite(netuid)
        
          const result = api.createType("Vec<NeuronInfoLite>", result_bytes);
          const neurons_info = result.toJSON() as any[] as NeuronInfoLite[];
          results_map[netuid] = neurons_info;
        } catch(err: any) {
            reject(err);
        }
      }

      resolve(results_map);
    });
  };

export async function getDelegateInfo(api: ApiPromise): Promise<DelegateInfo[]> {
    const result_bytes = await (api.rpc as any).delegateInfo.getDelegates();
    const result = api.createType("Vec<DelegateInfo>", result_bytes);
    const delegate_info_raw: DelegateInfoRaw[] = result.toJSON() as any[] as DelegateInfoRaw[];
    
    const delegate_info = delegate_info_raw.map((delegate: DelegateInfoRaw) => {
      let nominators: [string, number][] = [];
      let total_stake = 0;
      for (let i = 0; i < delegate.nominators.length; i++) {
        const nominator = delegate.nominators[i];
        const staked = nominator[1];
        total_stake += staked;
        nominators.push([nominator[0].toString(), staked]);
      }
      return {
        take: delegate.take / (2**16 - 1), // Normalize take, which is a u16
        delegate_ss58: delegate.delegate_ss58.toString(),
        owner_ss58: delegate.owner_ss58.toString(),
        nominators,
        total_stake,
      };
    });

    return delegate_info;
  };

export async function getDelegatesJson(): Promise<DelegateExtras> {
    const url = "https://raw.githubusercontent.com/opentensor/bittensor-delegates/master/public/delegates.json";
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export async function getMetagraph(api: ApiPromise): Promise<Metagraph> {
    const subnets_info_bytes = await ( api.rpc as any).subnetInfo.getSubnetsInfo();
    const subnets_info = api.createType("Vec<Option<SubnetInfo>>", subnets_info_bytes);

    const netuids: Array<number> = (subnets_info as any)
      .toJSON()
      .map((subnetInfo: SubnetInfo) => {
        return subnetInfo.netuid;
      });

    let _meta: Metagraph = {};

    const result: RawMetagraph = await getNeurons(api, netuids);

    Object.entries(result).forEach(
      ([netuid, neurons]: [string, NeuronInfoLite[]]) => {
        let neurons_ = neurons.map((neuron: NeuronInfoLite) => {
          return {
            hotkey: neuron.hotkey.toString(),
            coldkey: neuron.coldkey.toString(),
            stake: Object.fromEntries(neuron.stake.map((stake: [AccountId, number]) => {
              return [stake[0].toString(), stake[1]];
            })),
            uid: neuron.uid,
          };
        });
        _meta[netuid] = neurons_;
      }
    );
    
    return _meta;
  };