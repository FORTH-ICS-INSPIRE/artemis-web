import './styles.sass';
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/graphql';
import Layout from '../components/layout/layout';
import TooltipContext from '../context/tooltip-context';
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from "kbar";

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

  const actions = [
    {
      id: "dashboard",
      name: "Dashboard",
      shortcut: ["d"],
      keywords: "Dashboard",
      perform: () => (window.location.pathname = "/"),
    },
    {
      id: "bgpupdates",
      name: "BGP Updates",
      shortcut: ["b"],
      keywords: "bgpupdates",
      perform: () => (window.location.pathname = "/bgpupdates"),
    },
  ];

  return (
    <ApolloProvider client={client}>
      <KBarProvider actions={actions}>
        <KBarPortal> // Renders the content outside the root node
          <KBarPositioner> // Centers the content
            <KBarAnimator> // Handles the show/hide and height animations
              <KBarSearch /> // Search input
              {/* <KBarResults /> // Results renderer */}
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
        <Layout>
          <TooltipContext.Provider
            value={{ tooltips: tooltips, setTooltips: setTooltips }}
          >
            <Component {...pageProps} />
          </TooltipContext.Provider>
        </Layout>
      </KBarProvider>

    </ApolloProvider>
  );
}

export default MyApp;
