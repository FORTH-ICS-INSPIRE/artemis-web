import { useQuery, useSubscription } from '@apollo/client';
import { findQuery, findSubscription, shallSubscribe } from '../token';

export function useGraphQl(module, isLive = true, key = '', limits = null) {
  let vars = {};
  if (key.length) {
    vars = {
      variables: { key },
    };
  } else if (limits) {
    const { limit, offset } = limits;
    vars = {
      variables: { offset, limit },
    };
  }

  /* eslint-disable react-hooks/rules-of-hooks */
  const res = shallSubscribe(isLive)
    ? useSubscription(findSubscription(module), vars)
    : useQuery(findQuery(module), vars);

  const { error } = res;
  if (error) {
    console.error(error);
  }

  return res;
  /* eslint-enable react-hooks/rules-of-hooks */
}
