import './styles.css';
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/graphql';
import Layout from '../components/layout/layout';
import TooltipContext from '../context/tooltip-context';

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  const [tooltips, setTooltips] = useState({});

  return (
    <ApolloProvider client={client}>
      <Layout>
        <TooltipContext.Provider
          value={{ tooltips: tooltips, setTooltips: setTooltips }}
        >
          <Component {...pageProps} />
        </TooltipContext.Provider>
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
