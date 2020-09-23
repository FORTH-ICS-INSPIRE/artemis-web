import './styles.css';
// import App from 'next/app';
import * as React from 'react';

import { Provider } from 'next-auth/client';

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}
