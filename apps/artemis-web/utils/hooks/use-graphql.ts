import { useQuery, useSubscription } from '@apollo/client';
import { QueryGenerator, queryType } from 'apps/artemis-web/libs/graphql';
import { findQuery, shallSubscribe } from '../token';

type limitsType = {
  offset: Number;
  limit: Number;
};

type dateRangeType = {
  dateFrom: string;
  dateTo: String;
};

type optionsType = {
  isLive: boolean;
  key?: string;
  limits?: limitsType;
  dateFilter?: boolean;
  dateRange?: dateRangeType;
  callback?: (data: any) => void;
};

export function useGraphQl(module: queryType, options: optionsType) {
  const { isLive, key, limits, callback } = options;
  let vars;
  let isSubscription = shallSubscribe(isLive) || true;

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
    const { limit, offset } = limits;
    vars = isSubscription
      ? {
          onSubscriptionData: (data) => callback(data),
          variables: { offset, limit },
        }
      : {
          onCompleted: (data) => callback(data),
          variables: { offset, limit },
        };
  }

  const executor = new QueryGenerator(module, false, options);
  const res = executor.executeQuery(vars);

  const { error } = res;
  if (error) {
    console.error(error);
  }

  return res;
  /* eslint-enable react-hooks/rules-of-hooks */
}
