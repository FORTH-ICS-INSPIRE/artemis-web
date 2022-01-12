import { ApolloProvider } from '@apollo/client';
import { getMessaging, onMessage } from "firebase/messaging";
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/layout';
import TooltipContext from '../context/tooltip-context';
import { useApollo } from '../libs/graphql';
import { firebaseCloudMessaging } from '../libs/webPush';
import './styles.sass';

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


  useEffect(() => {
    setToken(); async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }
    function getMessage() {
      console.log('aaaa')
      const messaging = getMessaging();
      onMessage(messaging, (message) => console.log('foreground', message));
    }
  }, []);


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
