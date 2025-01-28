import { ApiPromise } from "@polkadot/api/promise/Api";
import { NeuronInfoLite, RawMetagraph, DelegateInfo, DelegateInfoRaw, SubnetInfo, Metagraph, DelegateExtras, StakeInfo, StakeData, Identity, PalletRegistryRegistration, PalletSubtensorChainIdentity } from "./types";
import { AccountId } from "@polkadot/types/interfaces";
import { compactStripLength, hexToU8a, compactAddLength, u8aToHex } from "@polkadot/util";
import { Option } from "@polkadot/types";

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

function extractInnerFields(identity_info: any): any {
  for (let key in identity_info) {
    if (identity_info[key] === null) {
      continue;
    }

    if (identity_info[key] === "None") {
      identity_info[key] = null;
      continue;
    }
    
    if (typeof identity_info[key] === "object" && Object.entries(identity_info[key]).length == 1) {
      if (Object.keys(identity_info[key])[0].startsWith("Raw")) {
        identity_info[key] = identity_info[key][Object.keys(identity_info[key])[0]];
      }
    }
  }
}

export async function getOnChainIdentity(api: ApiPromise, ss58: string): Promise<Identity> {
  // Try Subtensor pallet identity
  let identity_result = await api.query.subtensorModule.identities(ss58) as Option<any>;
  
  if (identity_result.isSome) {
    let identity = identity_result.unwrap().toHuman() as PalletSubtensorChainIdentity;
    
    console.log("identity_result sub", identity);

    return {
      name: identity.name === "None" ? null : identity.name || null,
      image: identity.image === "None" ? null : identity.image || null,
    }
  }

  // Try Registry pallet identity
  identity_result = await api.query.registry.identityOf(ss58) as Option<any>;
  if (identity_result.isSome) {
    let identity = identity_result.unwrap().toHuman() as PalletRegistryRegistration;

    console.log("identity_result", identity);
    extractInnerFields(identity.info)

    return {
      name: identity.info.display === "None" ? null : identity.info.display || null,
      image: null,
    }
  }

  return { name: null, image: null };
}

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
    const data = await response.json() as Object;

    Object.entries(data).forEach(([key, delegate]) => {
      delegate.identity = null;
    });
    return data as DelegateExtras;
};

export async function getStakeInfoForColdkey(api: ApiPromise, coldkey_ss58: string): Promise<StakeInfo[]> {
  const coldkey_as_u8a = api.createType("AccountId", coldkey_ss58).toU8a();
  const with_length_prefix = compactAddLength(coldkey_as_u8a);
  
  const stake_info_result = await api.rpc.state.call(
      "StakeInfoRuntimeApi_get_stake_info_for_coldkey",
      u8aToHex(with_length_prefix)
  );
  
  console.log("stake_info_result", stake_info_result.toHex());
  const formatted_result_hex = stake_info_result.toHex();

  const [length, trimmed] = compactStripLength(hexToU8a(formatted_result_hex));
  console.log("length", length, "trimmed", trimmed);

  const stake_info = api.createType("Vec<StakeInfo>", trimmed);
  const stake_info_json = stake_info.toJSON() as any[] as StakeInfo[];

  console.log("stake_info_json", stake_info_json);
  
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