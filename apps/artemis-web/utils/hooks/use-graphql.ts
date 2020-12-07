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
} from '../../libs/graphql';

export function useGraphQl(module, isLive = true, key = '') {
  let res: any;
  const isProduction = process.env.NODE_ENV === 'production';
  const shallSubscribe = isProduction && isLive;

  /* eslint-disable react-hooks/rules-of-hooks */
  switch (module) {
    case 'stats':
      res = shallSubscribe ? useSubscription(STATS_SUB) : useQuery(STATS_QUERY);
      break;
    case 'ongoing_hijack':
      res = shallSubscribe
        ? useSubscription(ONGOING_HIJACK_SUB)
        : useQuery(ONGOING_HIJACK_QUERY);
      break;
    case 'hijack':
      res = shallSubscribe
        ? useSubscription(HIJACK_SUB)
        : useQuery(HIJACK_QUERY);
      break;
    case 'bgpupdates':
      res = shallSubscribe ? useSubscription(BGP_SUB) : useQuery(BGP_QUERY);
      break;
    case 'hijackByKey':
      res = shallSubscribe
        ? useSubscription(getHijackByKeySub, {
            variables: { key },
          })
        : useQuery(getHijackByKeyQuery, {
            variables: { key },
          });
      break;
    case 'bgpByKey':
      res = shallSubscribe
        ? useSubscription(getBGPByKeySub, {
            variables: { key },
          })
        : useQuery(getBGPByKeyQuery, {
            variables: { key },
          });
      break;
    case 'index_stats':
      res = shallSubscribe
        ? useSubscription(INDEXSTATS_SUB)
        : useQuery(INDEXSTATS_QUERY);
      break;
  }

  const { loading, error, data } = res;
  if (error) {
    console.error(error);
  }

  return res;
  /* eslint-enable react-hooks/rules-of-hooks */
}
