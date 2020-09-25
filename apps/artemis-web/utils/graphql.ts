import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const graphqlConnect = () => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:9999/v1/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'x-hasura-admin-secret': '@rt3m1s.',
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

export default { graphqlConnect, getStats };
