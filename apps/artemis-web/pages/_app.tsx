import './styles.sass';
import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/graphql';
import Layout from '../components/layout/layout';
import TooltipContext from '../context/tooltip-context';
import ErrorContext from '../context/error-context';

const useStateWithLocalStorage = (localStorageKey) => {
  const [value, setValue] = useState(
    localStorage.getItem(localStorageKey)
      ? JSON.parse(localStorage.getItem(localStorageKey))
      : ""
  );

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);

  return [value, setValue];
};

function MyApp({ Component, pageProps }) {
  let tooltips, setTooltips, error, setError;

  /* eslint-disable react-hooks/rules-of-hooks */
  if (typeof window !== 'undefined') {
    [tooltips, setTooltips] = useStateWithLocalStorage('tooltips');
    [error, setError] = useStateWithLocalStorage('error');
  }

  const client = useApollo(pageProps.initialApolloState, setError);
  console.log('aaaa')
  /* eslint-enable react-hooks/rules-of-hooks */
  return (
    <ApolloProvider client={client}>
      <Layout {...pageProps}>
        <TooltipContext.Provider
          value={{ tooltips: tooltips, setTooltips: setTooltips }}
        >
          <ErrorContext.Provider
            value={{ error: error, setError: setError }}
          >
            <Component {...pageProps} />
          </ErrorContext.Provider>
        </TooltipContext.Provider>
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
