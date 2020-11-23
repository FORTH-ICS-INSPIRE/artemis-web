import './styles.css';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../utils/graphql';
import Layout from '../components/layout/layout';
import { Provider as AuthProvider } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  const client = useApollo(
    pageProps.initialApolloState,
    process.env.GRAPHQL_URI,
    process.env.GRAPHQL_WS_URI
  );

  return (
    <ApolloProvider client={client}>
      <AuthProvider session={pageProps.session}>
        {/* <Layout> */}
        <Component {...pageProps} />
        {/* </Layout> */}
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
