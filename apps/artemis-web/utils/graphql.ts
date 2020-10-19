import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  gql,
} from '@apollo/client';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

import { useMemo } from 'react';

let accessToken = null;
const requestToken = async () => {
  if (!accessToken) {
    const res = await fetch('/api/jwt');
    accessToken = await res.json();
    accessToken = accessToken.accessToken;
  }
};

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = (GRAPHQL_URI, GRAPHQL_WS_URI) => {
  const httpLink = createHttpLink({
    uri: GRAPHQL_URI,
    useGETForQueries: false,
    headers: async () => {
      await requestToken();
      return {
        authorization: `Bearer ${accessToken}`,
        // 'x-hasura-admin-secret': process.env.HASURA_SECRET
      };
    },
  });

  const wsLink = process.browser
    ? new WebSocketLink({
      uri: GRAPHQL_WS_URI,
      options: {
        reconnect: true,
        lazy: true,
        connectionParams: async () => {
          await requestToken();
          return {
            headers: {
              authorization: `Bearer ${accessToken}`,
              //'x-hasura-admin-secret': constants.HASURA_SECRET,
            },
          };
        },
      },
    })
    : null;

  const splitLink = process.browser
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    )
    : null;

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (
  initialState = null,
  GRAPHQL_URI,
  GRAPHQL_WS_URI
) => {
  const _apolloClient =
    apolloClient ?? createApolloClient(GRAPHQL_URI, GRAPHQL_WS_URI);
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') return _apolloClient;
  apolloClient = apolloClient ?? _apolloClient;

  return apolloClient;
};

export const STATS_SUB = gql`
  subscription getStats {
    view_processes {
      name
      running
      loading
      timestamp
    }
  }
`;

export const STATS_QUERY = gql`
  query getStats {
    view_processes {
      name
      running
      loading
      timestamp
    }
  }
`;

// An example graphql query to test the API
export const HIJACK_SUB = gql`
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

export const useApollo = (initialState, GRAPHQL_URI, GRAPHQL_WS_URI) => {
  const store = useMemo(
    () => initializeApollo(initialState, GRAPHQL_URI, GRAPHQL_WS_URI),
    [initialState, GRAPHQL_URI, GRAPHQL_WS_URI]
  );
  return store;
};
