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
import { findQuery, findSubscription, shallSubscribe } from '../token';

export function useGraphQl(module, isLive = true, key = '') {
  /* eslint-disable react-hooks/rules-of-hooks */
  const res = shallSubscribe(isLive)
    ? useSubscription(findSubscription(module), {
        variables: { key },
      })
    : useQuery(findQuery(module), {
        variables: { key },
      });

  const { error } = res;
  if (error) {
    console.error(error);
  }

  return res;
  /* eslint-enable react-hooks/rules-of-hooks */
}
