import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  gql,
} from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

import { useMemo } from 'react';
import { setContext } from '@apollo/client/link/context';
import constants from './constants';

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: constants.GRAPHQL_URI,
    useGETForQueries: false,
  });

  const wsLink = process.browser
    ? new WebSocketLink({
        uri: `ws://localhost:9999/v1/graphql`,
        options: {
          reconnect: true,
          lazy: true,
          connectionParams: async () => {
            return {
              headers: {
                'x-hasura-admin-secret': constants.HASURA_SECRET,
              },
            };
          },
        },
      })
    : null;

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'x-hasura-admin-secret': constants.HASURA_SECRET,
      },
    };
  });

  const splitLink = process.browser
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        authLink.concat(wsLink),
        authLink.concat(httpLink)
      )
    : null;

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') return _apolloClient;
  apolloClient = apolloClient ?? _apolloClient;

  return apolloClient;
};
export const STATS_QUERY = gql`
  subscription getStats {
    view_processes {
      name
      running
      loading
      timestamp
    }
  }
`;

// An example graphql query to test the API
export const HIJACK_QUERY = gql`
  subscription hijacks {
    view_hijacks(limit: 10, order_by: { time_last: desc }) {
      active
      comment
      configured_prefix
      hijack_as
      ignored
      dormant
      key
      mitigation_started
      num_asns_inf
      num_peers_seen
      outdated
      peers_seen
      peers_withdrawn
      prefix
      resolved
      seen
      time_detected
      time_ended
      time_last
      time_started
      timestamp_of_config
      type
      under_mitigation
      withdrawn
    }
  }
`;

export const useApollo = (initialState) => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
};
