import './styles.css';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../utils/graphql';

function MyApp({ Component, pageProps }) {
  const client = useApollo(
    pageProps.initialApolloState,
    process.env.GRAPHQL_URI,
    process.env.GRAPHQL_WS_URI
  );

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
