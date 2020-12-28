import { QueryGenerator } from '../../libs/graphql';
import { shallSubscribe } from '../token';
import optionsType from './use-graphql.d';
import queryType from '../../libs/graphql.d';
import { useMutation, useQuery, useSubscription } from '@apollo/client';

export function useGraphQl(module: queryType, options: optionsType) {
  const { isLive, key, limits, callback, isMutation, running, name } = options;
  let vars;
  const varTmp = {};
  const isSubscription = shallSubscribe(isLive);

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
  }
  if (limits) {
    const { limit, offset } = limits;
    vars = isSubscription
      ? {
          onSubscriptionData: (data) => callback(data),
          variables: { offset, limit, ...varTmp },
        }
      : {
          onCompleted: (data) => callback(data),
          variables: { offset, limit, ...varTmp },
        };
  }

  const generator = new QueryGenerator(module, isSubscription, options);
  /* eslint-disable react-hooks/rules-of-hooks */
  if (isMutation) {
    vars = {
      variables: { running, name },
    };

    const res = useMutation(generator.getQuery(), vars);

    return res[0]();
  } else {
    const res = isSubscription
      ? useSubscription(generator.getQuery(), vars)
      : useQuery(generator.getQuery(), vars);

    const { error } = res;
    if (error) {
      console.error(error);
    }

    return res;
  }

  /* eslint-enable react-hooks/rules-of-hooks */
}
