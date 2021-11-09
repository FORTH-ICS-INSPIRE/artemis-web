import { useJWT } from '../../utils/hooks/use-jwt';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import { commands, handlers, keyMap } from '../../utils/power-actions';
import { OfflineBoltOutlined } from '@material-ui/icons';
import CommandLineModal from 'react-super-cmd';


const AuthHOC = (WrappedComponent, ACL = []) => {
  const Wrapped = (props) => {
    const [cmdLineModal, setCmdLineModal] = useState(false);
    function toggleIsOpen() {
      setCmdLineModal((previousState) => !previousState);
    }
    const [user, loading] = useJWT();
    const router = useRouter();
    if (!user && !loading) {
      router.push('/login');
    }

    if (user && !loading && !ACL.includes(user.role)) {
      return (
        <>
          <Head>
            <meta name="robots" content="noindex" />
          </Head>
          <DefaultErrorPage
            statusCode={401}
            title={'You do not have the permission to access.'}
          />
        </>
      );
    } else if (!loading) {
      return (
        <GlobalHotKeys keyMap={keyMap} handlers={handlers(toggleIsOpen)}>
          <WrappedComponent {...props} user={user}></WrappedComponent>
          <CommandLineModal
            commands={commands(user.role)}
            isOpen={cmdLineModal}
            toggleIsModalOpen={toggleIsOpen}
            title={'Navigate with the keyboard'}
            logo={<OfflineBoltOutlined />}
            noOptionsText="No commands found. Try a different search term."
          />
        </GlobalHotKeys>
      )
        ;
    } else {
      return <> </>;
    }
  };

  return Wrapped;
};

export default AuthHOC;
