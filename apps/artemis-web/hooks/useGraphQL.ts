import { useQuery, useSubscription } from '@apollo/client';
import {
  BGP_QUERY,
  BGP_SUB,
  getBGPByKeyQuery,
  getBGPByKeySub,
  getHijackByKeyQuery,
  getHijackByKeySub,
  HIJACK_QUERY,
  HIJACK_SUB,
  INDEXSTATS_QUERY,
  INDEXSTATS_SUB,
  ONGOING_HIJACK_QUERY,
  ONGOING_HIJACK_SUB,
  STATS_QUERY,
  STATS_SUB,
} from '../utils/graphql';

export function useGraphQl(module, isProduction, isLive = true, key = '') {
  let data: any;
  const shallSubscribe = isProduction && isLive;

  /* eslint-disable react-hooks/rules-of-hooks */
  switch (module) {
    case 'stats':
      data = shallSubscribe
        ? useSubscription(STATS_SUB).data
        : useQuery(STATS_QUERY).data;
      break;
    case 'ongoing_hijack':
      data = shallSubscribe
        ? useSubscription(ONGOING_HIJACK_SUB).data
        : useQuery(ONGOING_HIJACK_QUERY).data;
      break;
    case 'hijack':
      data = shallSubscribe
        ? useSubscription(HIJACK_SUB).data
        : useQuery(HIJACK_QUERY).data;
      break;
    case 'bgpupdates':
      data = shallSubscribe
        ? useSubscription(BGP_SUB).data
        : useQuery(BGP_QUERY).data;
      break;
    case 'hijackByKey':
      data = shallSubscribe
        ? useSubscription(getHijackByKeySub, {
            variables: { key },
          }).data
        : useQuery(getHijackByKeyQuery, {
            variables: { key },
          }).data;
      break;
    case 'bgpByKey':
      data = shallSubscribe
        ? useSubscription(getBGPByKeySub, {
            variables: { key },
          }).data
        : useQuery(getBGPByKeyQuery, {
            variables: { key },
          }).data;
      break;
    case 'index_stats':
      data = shallSubscribe
        ? useSubscription(INDEXSTATS_SUB).data
        : useQuery(INDEXSTATS_QUERY).data;
      break;
  }
  /* eslint-enable react-hooks/rules-of-hooks */
  return data;
}
