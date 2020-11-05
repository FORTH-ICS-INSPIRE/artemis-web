import './styles.css';
import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../utils/graphql';
import Layout from '../components/layout/layout';
import { useJWT, useFetch } from '../hooks/useJWT';
import { parseJwt } from '../lib/helpers';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const client = useApollo(
    pageProps.initialApolloState,
    process.env.GRAPHQL_URI,
    process.env.GRAPHQL_WS_URI
  );
  const { status, data } = useFetch('/api/jwt');
  const jwt = null; // data ? parseJwt(data) : null;

  return (
    <ApolloProvider client={client}>
      <Layout jwt={jwt} loading={status !== 'fetched'}>
        <Component jwt={jwt} loading={status !== 'fetched'} {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
