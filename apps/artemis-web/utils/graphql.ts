import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { onError } from '@apollo/client/link/error';

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const graphqlConnect = () => {
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URI,
    useGETForQueries: false,
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'x-hasura-admin-secret': process.env.HASURA_SECRET,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return client;
};

const getStats = (client) => {
  return client.query({
    query: gql`
      query getStats {
        view_processes {
          name
          running
          loading
          timestamp
        }
      }
    `,
  });
};

// An example graphql query to test the API
const getHijacks = (client) => {
  const HIJACKS = gql`
    query hijacks {
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

  return client.query({ query: HIJACKS });
};

export default { graphqlConnect, getStats };
