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
import { setContext } from '@apollo/client/link/context';
import { useMemo } from 'react';
import { useFetch } from '../utils/hooks/use-jwt';

let accessToken = null;
const requestToken = async () => {
  if (!accessToken) {
    const { status, data } = useFetch('/api/auth/jwt');
    if (data) {
      accessToken = JSON.parse(data).accessToken;
    }
  }
};

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = (GRAPHQL_URI, GRAPHQL_WS_URI) => {
  const httpLink =
    typeof window !== 'undefined'
      ? createHttpLink({
          uri: GRAPHQL_URI,
          useGETForQueries: false,
        })
      : null;

  const authLink =
    typeof window !== 'undefined'
      ? setContext(async (_, { headers }) => {
          await requestToken();
          return {
            headers: {
              ...headers,
              authorization: accessToken ? `Bearer ${accessToken}` : '',
            },
          };
        })
      : null;

  const wsLink =
    typeof window !== 'undefined'
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
                },
              };
            },
          },
        })
      : null;

  const splitLink =
    typeof window !== 'undefined'
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          wsLink,
          authLink.concat(httpLink)
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

  if (typeof window !== 'undefined') return _apolloClient;
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
export const ONGOING_HIJACK_SUB = gql`
  subscription hijacks {
    view_hijacks(
      limit: 10
      offset: 0
      order_by: { time_last: desc_nulls_first }
    ) {
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

export const ONGOING_HIJACK_QUERY = gql`
  query hijacks {
    view_hijacks(
      limit: 10
      offset: 0
      order_by: { time_last: desc_nulls_first }
    ) {
      time_detected
      prefix
      type
      hijack_as
      rpki_status
      num_peers_seen
      num_asns_inf
      key
      seen
      withdrawn
      resolved
      ignored
      active
      dormant
      under_mitigation
      outdated
      time_last
      configured_prefix
    }
  }
`;

// An example graphql query to test the API
export const HIJACK_SUB = gql`
  subscription hijacks {
    view_hijacks(
      limit: 10
      offset: 0
      order_by: { time_last: desc_nulls_first }
    ) {
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

export const HIJACK_QUERY = gql`
  query hijacks {
    view_hijacks(
      limit: 10
      offset: 0
      order_by: { time_last: desc_nulls_first }
    ) {
      time_detected
      prefix
      type
      hijack_as
      rpki_status
      num_peers_seen
      num_asns_inf
      key
      seen
      withdrawn
      resolved
      ignored
      active
      dormant
      under_mitigation
      outdated
      time_last
      configured_prefix
    }
  }
`;

export const BGP_SUB = gql`
  subscription bgpupdates {
    view_bgpupdates(
      limit: 10
      order_by: { time_last: desc }
      where: { _and: [{ active: { _eq: true } }, { dormant: { _eq: false } }] }
    ) {
      prefix
      origin_as
      peer_asn
      as_path
      service
      type
      communities
      timestamp
      hijack_key
      handled
      matched_prefix
      orig_path
    }
  }
`;

export const BGP_QUERY = gql`
  query bgpupdates {
    view_bgpupdates(
      limit: 10
      order_by: { time_last: desc }
      where: { _and: [{ active: { _eq: true } }, { dormant: { _eq: false } }] }
    ) {
      prefix
      origin_as
      peer_asn
      as_path
      service
      type
      communities
      timestamp
      hijack_key
      handled
      matched_prefix
      orig_path
    }
  }
`;

export const INDEXSTATS_SUB = gql`
  subscription getIndexAllStats {
    view_index_all_stats {
      monitored_prefixes
      configured_prefixes
      monitor_peers
      total_bgp_updates
      total_unhandled_updates
      total_hijacks
      ignored_hijacks
      resolved_hijacks
      withdrawn_hijacks
      mitigation_hijacks
      ongoing_hijacks
      dormant_hijacks
      acknowledged_hijacks
      outdated_hijacks
    }
  }
`;

export const INDEXSTATS_QUERY = gql`
  query getIndexAllStats {
    view_index_all_stats {
      monitored_prefixes
      configured_prefixes
      monitor_peers
      total_bgp_updates
      total_unhandled_updates
      total_hijacks
      ignored_hijacks
      resolved_hijacks
      withdrawn_hijacks
      mitigation_hijacks
      ongoing_hijacks
      dormant_hijacks
      acknowledged_hijacks
      outdated_hijacks
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
