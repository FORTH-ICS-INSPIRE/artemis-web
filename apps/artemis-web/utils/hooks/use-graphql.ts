import { useQuery, useSubscription } from '@apollo/client';
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
