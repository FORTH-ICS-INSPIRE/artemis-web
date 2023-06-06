import { QueryGenerator } from '../../libs/graphql';
import { shallSubscribe } from '../token';
import optionsType from './use-graphql.d';
import queryType from '../../libs/graphql.d';
import { useMutation, useQuery, useSubscription } from '@apollo/client';

export function useGraphQl(module: queryType, options: optionsType) {
  const { isLive, key, limits, callback, isMutation, running, name, isTesting } = options;
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

  /* eslint-disable react-hooks/rules-of-hooks */
  if (isTesting)
    return null;
  else if (isMutation) {
    const generator = new QueryGenerator(module, isSubscription, options);

    vars = {
      variables: { running, name },
    };

    const res = useMutation(generator.getQuery(), {
      ...vars,
      ignoreResults: true,
      skip: isTesting,
    });

    return res[0]();
  } else {
    const generator1 = new QueryGenerator(module, true, options);
    const generator2 = new QueryGenerator(module, false, options);

    const res1 = useSubscription(generator1.getQuery(), {
      ...vars,
      skip: !isSubscription,
    });

    const res2 = useQuery(generator2.getQuery(), {
      ...vars,
      skip: isSubscription,
    });

    const res = res1.data ? res1 : res2;

    const { error } = res;
    if (error) {
      console.error(error);
    }

    return res;
  }

  /* eslint-enable react-hooks/rules-of-hooks */
}
