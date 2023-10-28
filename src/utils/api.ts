import { ApiPromise } from "@polkadot/api/promise/Api";
import { NeuronInfoLite, RawMetagraph, DelegateInfo, DelegateInfoRaw, SubnetInfo, Metagraph, DelegateExtras, StakeInfo, StakeData } from "./types";
import { AccountId } from "@polkadot/types/interfaces";
import { hexToU8a, u8aToNumber } from "@polkadot/util";

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

export async function getStakeInfoForColdkey(api: ApiPromise, coldkey_ss58: string): Promise<StakeInfo[]> {
  const coldkey_as_u8a = api.createType("AccountId", coldkey_ss58).toHex();
  console.log(api)
  const formatted_hex = "0x80" + coldkey_as_u8a.slice(2);
  const stake_info_result = await api.rpc.state.call(
      "StakeInfoRuntimeApi_get_stake_info_for_coldkey",
      formatted_hex
  );
    
  const formatted_result_hex = '0x' + stake_info_result.toHex().slice(2 + 4);

  const result_bytes = api.createType("Vec<u8>", formatted_result_hex).toHex();
  const stake_info = api.createType("Vec<StakeInfo>", result_bytes);
  const stake_info_json = stake_info.toJSON() as any[] as StakeInfo[];

  const clean_result = stake_info_json.filter((stake_info: StakeInfo) => {
    return Number(stake_info.stake) > 0;
  });
  return clean_result;
}

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