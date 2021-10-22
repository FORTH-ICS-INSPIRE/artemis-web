import { ApolloProvider } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import Layout from '../components/layout/layout';
import ErrorContext from '../context/error-context';
import TooltipContext from '../context/tooltip-context';
import { useApollo } from '../libs/graphql';
import './styles.sass';

const options = {
  position: positions.BOTTOM_LEFT,
  timeout: 5000,
  offset: '30px',
  containerStyle: {
    width: 300,
  },
  // you can also just use 'scale'
  transition: transitions.SCALE
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
  let tooltips, setTooltips;
  const [error, setError] = useState('');

  const value = useMemo(
    () => ({ error, setError }),
    [error]
  );

  /* eslint-disable react-hooks/rules-of-hooks */
  if (typeof window !== 'undefined') {
    [tooltips, setTooltips] = useStateWithLocalStorage('tooltips');
  }

  const client = useApollo(pageProps.initialApolloState, setError);

  /* eslint-enable react-hooks/rules-of-hooks */
  return (
    <ApolloProvider client={client}>
      <Layout {...pageProps}>
        <TooltipContext.Provider
          value={{ tooltips: tooltips, setTooltips: setTooltips }}
        >
          <ErrorContext.Provider value={value}>
            <AlertProvider template={AlertTemplate} {...options}>
              <Component {...pageProps} />
            </AlertProvider>
          </ErrorContext.Provider>
        </TooltipContext.Provider>
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
