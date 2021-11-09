import './styles.sass';
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/graphql';
import Layout from '../components/layout/layout';
import TooltipContext from '../context/tooltip-context';
import { GlobalHotKeys } from 'react-hotkeys';
import { commands, handlers, keyMap } from '../utils/power-actions';
import { OfflineBoltOutlined } from '@material-ui/icons';
import CommandLineModal from 'react-super-cmd';

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
  const [cmdLineModal, setCmdLineModal] = useState(false);
  function toggleIsOpen() {
    setCmdLineModal((previousState) => !previousState);
  }
  /* eslint-disable react-hooks/rules-of-hooks */
  if (typeof window !== 'undefined') {
    [tooltips, setTooltips] = useStateWithLocalStorage('tooltips');
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers(toggleIsOpen)}>
      <ApolloProvider client={client}>
        <Layout {...pageProps}>
          <TooltipContext.Provider
            value={{ tooltips: tooltips, setTooltips: setTooltips }}
          >
            <Component {...pageProps} />
            <CommandLineModal
              commands={commands}
              isOpen={cmdLineModal}
              toggleIsModalOpen={toggleIsOpen}
              title={'Navigate with the keyboard'}
              logo={<OfflineBoltOutlined />}
              noOptionsText="No commands found. Try a different search term."
            />
          </TooltipContext.Provider>
        </Layout>
      </ApolloProvider>
    </GlobalHotKeys>
  );
}

export default MyApp;
