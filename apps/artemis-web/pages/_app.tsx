import './styles.sass';
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/graphql';
import Layout from '../components/layout/layout';
import TooltipContext from '../context/tooltip-context';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  /* eslint-disable */
  const axe = require('react-axe');
  /* eslint-enable */
  const config = {
    rules: [
      {
        id: 'radiogroup',
        enabled: true
      }
    ]
  };
  axe(React, ReactDOM, 1000, config);
}

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
