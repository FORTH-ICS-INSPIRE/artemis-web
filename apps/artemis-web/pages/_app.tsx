import './styles.sass';
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/graphql';
import Layout from '../components/layout/layout';
import TooltipContext from '../context/tooltip-context';

const useStateWithLocalStorage = (localStorageKey) => {
  const [value, setValue] = useState(
    localStorage.getItem(localStorageKey)
      ? JSON.parse(localStorage.getItem(localStorageKey))
      : {}
  );

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);

  return [value, setValue];
};

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  let tooltips, setTooltips;

  /* eslint-disable react-hooks/rules-of-hooks */
  if (typeof window !== 'undefined') {
    [tooltips, setTooltips] = useStateWithLocalStorage('tooltips');
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <ApolloProvider client={client}>
      <Layout {...pageProps}>
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
