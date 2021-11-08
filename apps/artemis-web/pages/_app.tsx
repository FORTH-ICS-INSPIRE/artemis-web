import { ApolloProvider } from '@apollo/client';
import OfflineBoltOutlined from "@material-ui/icons/OfflineBoltOutlined";
import React, { useState } from 'react';
import { configure, GlobalHotKeys } from "react-hotkeys";
import CommandLineModal from "react-super-cmd";
import Layout from '../components/layout/layout';
import TooltipContext from '../context/tooltip-context';
import { useApollo } from '../libs/graphql';
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
  /* eslint-disable react-hooks/rules-of-hooks */
  if (typeof window !== 'undefined') {
    [tooltips, setTooltips] = useStateWithLocalStorage('tooltips');
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  const [cmdLineModal, setCmdLineModal] = useState(false);
  const commands = {
    Dashboard: {
      name: 'Dashboard', shortcut: 'alt+d', callback: () => window.location.pathname = "/dashboard"
    },
    BGPUpdates: {
      name: 'BGP Updates', shortcut: 'alt+b', callback: () => window.location.pathname = "/bgpupdates"
    },
    Hijacks: {
      name: 'Hijacks', shortcut: 'alt+h', callback: () => window.location.pathname = "/hijacks"
    },
    System: {
      name: 'System', shortcut: 'alt+s', callback: () => window.location.pathname = "/admin/system"
    },
    UserManagement: {
      name: 'User Management', shortcut: 'alt+m', callback: () => window.location.pathname = "/admin/user_management"
    },
    Password: {
      name: 'Password Change', shortcut: 'alt+p', callback: () => window.location.pathname = "/password_change"
    },
    Config: {
      name: 'Config Comparison', shortcut: 'alt+c', callback: () => window.location.pathname = "/config_comparison"
    },
  };
  function toggleIsOpen() {
    setCmdLineModal(previousState => !previousState);
  };

  const keyMap = {
    TOGGLE_MODAL: "cmd+k", DASHBOARD_JUMP: "alt+d", BGPUPDATES_JUMP: "alt+b",
    HIJACKS_JUMP: "alt+h", SYSTEM_JUMP: "alt+s", USERMANAGEMENT_JUMP: "alt+m",
    PASSWORD_JUMP: "alt+p", CONFIG_JUMP: "alt+c"
  };
  const handlers = {
    TOGGLE_MODAL: () => {
      toggleIsOpen();
    },
    DASHBOARD_JUMP: () => {
      window.location.pathname = "/dashboard";
    },
    BGPUPDATES_JUMP: () => {
      window.location.pathname = "/bgpupdates";
    },
    HIJACKS_JUMP: () => {
      window.location.pathname = "/hijacks";
    },
    SYSTEM_JUMP: () => {
      window.location.pathname = "/admin/system";
    },
    USERMANAGEMENT_JUMP: () => {
      window.location.pathname = "/admin/user_management";
    },
    PASSWORD_JUMP: () => {
      window.location.pathname = "/password_change";
    },
    CONFIG_JUMP: () => {
      window.location.pathname = "/config_comparison";
    },
  };

  configure({
    ignoreTags: ['input', 'select', 'textarea'],
    // ignoreEventsCondition: function () {
    // }
  });

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      <ApolloProvider client={client}>
        <Layout>
          <TooltipContext.Provider
            value={{ tooltips: tooltips, setTooltips: setTooltips }}
          >
            <Component {...pageProps} />
            <CommandLineModal commands={commands}
              isOpen={cmdLineModal}
              toggleIsModalOpen={toggleIsOpen}
              title={"Navigate with the keyboard"}
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
