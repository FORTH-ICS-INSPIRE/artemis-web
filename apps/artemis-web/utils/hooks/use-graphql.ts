import { useQuery, useSubscription } from '@apollo/client';
import { findQuery, shallSubscribe } from '../token';

export function useGraphQl(
  module,
  options,
  callback = (data) => {
    return;
  },
  extraVars: any = {}
) {
  const { isLive, key, limits } = options;
  console.log(module);
  let vars;
  const isSubscription = shallSubscribe(isLive) || true;
  const queryOptions = {};

  if (key && key.length) {
    vars = isSubscription
      ? {
          onSubscriptionData: (data) => callback(data),
          variables: { key },
        }
      : {
          onCompleted: (data) => callback(data),
          variables: { key },
        };
  } else if (limits) {
    const { limit, offset, filter } = limits;
    vars = isSubscription
      ? {
          onSubscriptionData: (data) => callback(data),
          variables: { offset, limit },
        }
      : {
          onCompleted: (data) => callback(data),
          variables: { offset, limit, filter },
        };
    queryOptions['limits'] = true;
  } else if (module === 'bgpcount') {
    const dateTo = new Date().toISOString();
    const dateFiltered = new Date();
    dateFiltered.setHours(dateFiltered.getHours() - 1);
    const dateFrom = dateFiltered.toISOString();
    extraVars = {
      dateTo: '2020-12-19T13:18:34.779Z',
      dateFrom: '2020-12-19T13:18:34.779Z',
    };

    queryOptions['dateFilter'] = true;
  }
  console.log(vars);
  /* eslint-disable react-hooks/rules-of-hooks */
  const res = isSubscription
    ? useSubscription(findQuery(module, true, queryOptions, extraVars), vars)
    : useQuery(findQuery(module, false, queryOptions, extraVars), vars);

  const { error } = res;
  if (error) {
    console.error(error);
  }

  return res;
  /* eslint-enable react-hooks/rules-of-hooks */
}
