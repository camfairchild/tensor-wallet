import { ApiPromise } from "@polkadot/api/promise/Api";
import {
  NeuronInfoLite,
  RawMetagraph,
  DelegateInfo,
  DelegateInfoRaw,
  SubnetInfo,
  Metagraph,
  DelegateExtras,
  StakeInfo,
  StakeData,
  Identity,
  PalletRegistryRegistration,
  PalletSubtensorChainIdentity,
  SubnetState,
  DynamicInfo,
  DynamicInfoRaw,
  FixedInt,
} from "./types";
import { AccountId } from "@polkadot/types/interfaces";
import { Option } from "@polkadot/types";
import { HexString } from "@polkadot/util/types";
import { hexToU8a, u8aToHex } from "@polkadot/util";

export async function getNeurons(
  api: ApiPromise,
  netuids: Array<number>
): Promise<RawMetagraph> {
  return new Promise<RawMetagraph>(async (resolve, reject) => {
    let results_map: RawMetagraph = {};
    for (let netuid of netuids) {
      try {
        const result = await queryRuntimeApi(
          api,
          "NeuronInfoRuntimeApi_get_neurons_lite",
          [netuid]
        );
        const neurons_info = result.toJSON() as any[] as NeuronInfoLite[];
        results_map[netuid] = neurons_info;
      } catch (err: any) {
        reject(err);
      }
    }

    resolve(results_map);
  });
}

function extractInnerFields(identity_info: any): any {
  for (let key in identity_info) {
    if (identity_info[key] === null) {
      continue;
    }

    if (identity_info[key] === "None") {
      identity_info[key] = null;
      continue;
    }

    if (
      typeof identity_info[key] === "object" &&
      Object.entries(identity_info[key]).length == 1
    ) {
      if (Object.keys(identity_info[key])[0].startsWith("Raw")) {
        identity_info[key] =
          identity_info[key][Object.keys(identity_info[key])[0]];
      }
    }
  }
}

export async function getOnChainIdentity(
  api: ApiPromise,
  ss58: string
): Promise<Identity> {
  // Try Subtensor pallet identity
  let identity_result = (await api.query.subtensorModule.identities(
    ss58
  )) as Option<any>;

  if (identity_result.isSome) {
    let identity = identity_result
      .unwrap()
      .toHuman() as PalletSubtensorChainIdentity;

    return {
      name: identity.name === "None" ? null : identity.name || null,
      image: identity.image === "None" ? null : identity.image || null,
    };
  }

  // Try Registry pallet identity
  identity_result = (await api.query.registry.identityOf(ss58)) as Option<any>;
  if (identity_result.isSome) {
    let identity = identity_result
      .unwrap()
      .toHuman() as PalletRegistryRegistration;

    extractInnerFields(identity.info);

    return {
      name:
        identity.info.display === "None" ? null : identity.info.display || null,
      image: null,
    };
  }

  return { name: null, image: null };
}

export async function queryRuntimeApi(
  api: ApiPromise,
  method: string,
  params: Array<any>
): Promise<any> {
  const split_idx = method.indexOf("_");
  const api_name = method.slice(0, split_idx);
  const method_name = method.slice(split_idx + 1);

  console.debug(api, api_name, method_name);
  const api_def = api.runtimeMetadata.asV15.apis.find(
    (api: any) => api.name.toHuman() === api_name
  );
  console.debug(api_def);
  const call_def = api_def?.methods.find(
    (method: any) => method.name.toHuman() === method_name
  );
  const output_type = call_def?.output;
  if (!output_type) {
    throw new Error(
      `Output type not found for method ${method_name} in api ${api_name}`
    );
  }

  const param_types = call_def?.inputs.map((input: any) => input.type);
  console.debug(param_types);

  const params_bytes_hex: HexString = u8aToHex(params
    .map((param, idx) => {
      const typeDef = api.registry.createLookupType(param_types[idx]);
      return api.createType(typeDef, param).toU8a();
    })
    .reduce((acc: Uint8Array, curr: Uint8Array) => {
      return new Uint8Array([...acc, ...curr]);
    }, new Uint8Array()));
    

  // console.debug("params_bytes_hex", params_bytes_hex);

  const result_bytes = await api.rpc.state.call(method, params_bytes_hex);
  // console.debug("result_bytes", result_bytes);

  const typeDef = api.registry.createLookupType(output_type);
  const result = api.createType(typeDef, result_bytes);

  return result;
}

export async function getDelegateInfo(
  api: ApiPromise
): Promise<DelegateInfo[]> {
  const result = await queryRuntimeApi(
    api,
    "DelegateInfoRuntimeApi_get_delegates",
    []
  );
  console.debug(result);

  const delegate_info_raw: DelegateInfoRaw[] =
    result.toJSON() as any[] as DelegateInfoRaw[];

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
      take: delegate.take / (2 ** 16 - 1), // Normalize take, which is a u16
      delegateSs58: delegate.delegateSs58.toString(),
      ownerSs58: delegate.ownerSs58.toString(),
      nominators,
      totalStake: total_stake,
      stake: 0,
    } as DelegateInfo;
  });

  return delegate_info;
}

export async function getDelegatesJson(): Promise<DelegateExtras> {
  const url =
    "https://raw.githubusercontent.com/opentensor/bittensor-delegates/master/public/delegates.json";
  const response = await fetch(url);
  const data = (await response.json()) as Object;

  Object.entries(data).forEach(([key, delegate]) => {
    delegate.identity = null;
  });
  return data as DelegateExtras;
}

export async function getStakeInfoForColdkey(
  api: ApiPromise,
  coldkey_ss58: string
): Promise<StakeInfo[]> {
  const stake_info_result = await queryRuntimeApi(
    api,
    "StakeInfoRuntimeApi_get_stake_info_for_coldkey",
    [coldkey_ss58]
  );

  const stake_info_json = stake_info_result.toJSON() as any[] as StakeInfo[];

  console.debug("stake_info_json", stake_info_json, "for coldkey", coldkey_ss58);

  const clean_result = stake_info_json.filter((stake_info: StakeInfo) => {
    return Number(stake_info.stake) > 0;
  });
  return clean_result;
}

export async function getAllSubnets(api: ApiPromise): Promise<number[]> {
  const subnets_info = await queryRuntimeApi(
    api,
    "SubnetInfoRuntimeApi_get_subnets_info",
    []
  );
  const subnets_json = subnets_info.toJSON() as any[] as SubnetInfo[];
  return subnets_json.map((subnet: SubnetInfo) => subnet.netuid);
}

export async function getMetagraph(api: ApiPromise): Promise<Metagraph> {
  const subnets_info = await queryRuntimeApi(
    api,
    "SubnetInfoRuntimeApi_get_subnets_info",
    []
  );
  console.debug("subnets_info", subnets_info);

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
          stake: Object.fromEntries(
            neuron.stake.map((stake: [AccountId, number]) => {
              return [stake[0].toString(), stake[1]];
            })
          ),
          uid: neuron.uid,
        };
      });
      _meta[netuid] = neurons_;
    }
  );

  return _meta;
}

export async function getSubnetState(
  api: ApiPromise,
  netuid: number
): Promise<SubnetState | null> {
  const subnet_info_result_option = await queryRuntimeApi(
    api,
    "SubnetInfoRuntimeApi_get_subnet_state",
    [netuid]
  );
  console.debug("subnet_info_result_option", subnet_info_result_option);
  if (subnet_info_result_option.isNone) {
    return null;
  }
  const subnet_info_json =
    subnet_info_result_option.toJSON() as any as SubnetState;

  return subnet_info_json;
}

export async function getDynamicInfo(
  api: ApiPromise,
  netuid: number
): Promise<DynamicInfo | null> {
  const dynamic_info_result_option = await queryRuntimeApi(
    api,
    "SubnetInfoRuntimeApi_get_dynamic_info",
    [netuid]
  );
  console.debug("dynamic_info_result_option", netuid, dynamic_info_result_option);
  if (dynamic_info_result_option.isNone) {
    return null;
  }
  let utf8decoder = new TextDecoder();

  const dynamic_info_json =
    dynamic_info_result_option.toJSON() as any as DynamicInfoRaw;

  console.debug("dynamic_info_json", dynamic_info_json);
  const dynamic_info = {
    ...dynamic_info_json,
    subnetName: utf8decoder.decode(
      new Uint8Array(dynamic_info_json.subnetName)
    ),
    tokenSymbol: utf8decoder.decode(
      new Uint8Array(dynamic_info_json.tokenSymbol)
    ),
    subnetIdentity: dynamic_info_json.subnetIdentity
      ? Object.fromEntries(
          Object.entries(dynamic_info_json.subnetIdentity).map(
            ([key, value]) => {
              if (value === null) {
                return [key, null];
              }
              return [key, utf8decoder.decode(new Uint8Array(
                hexToU8a(value)
              ))];
            }
          )
        )
      : null,
    movingPrice: fixedToFloat(dynamic_info_json.movingPrice, 96, true)
  } as DynamicInfo;

  return dynamic_info;
}

export function fixedToFloat(fixed: FixedInt, bits: number, signed: boolean): number {
  const value = fixed.bits;
  const first_bits = value >>> bits;
  const frac_bit_count = 128 - bits;
  const last_bits = value & (1 << frac_bit_count - 1);

  return (first_bits) + (last_bits / (2 ** frac_bit_count));
}
