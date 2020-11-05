import './styles.css';
import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../utils/graphql';
import Layout from '../components/layout/layout';
import { useJWT } from '../hooks/useJWT';

function MyApp({ Component, pageProps }) {
  const client = useApollo(
    pageProps.initialApolloState,
    process.env.GRAPHQL_URI,
    process.env.GRAPHQL_WS_URI
  );
  const [jwt, { loading }] = useJWT();

  return (
    <ApolloProvider client={client}>
      <Layout jwt={jwt} loading={loading}>
        <Component jwt={jwt} loading={loading}  {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
