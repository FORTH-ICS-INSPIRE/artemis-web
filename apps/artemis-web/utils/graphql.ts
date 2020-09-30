import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const graphqlConnect = () => {
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URI,
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

export default { graphqlConnect, getHijacks };
