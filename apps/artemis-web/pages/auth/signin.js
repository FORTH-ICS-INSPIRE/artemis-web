import React from 'react';
import { providers, signIn, signOut, useSession, csrfToken } from 'next-auth/client';

export default function SignIn({ providers }) {
  const [ session, loading ] = useSession()

  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
      {
        session && <>
          Signed in as {session.user.email} <br/>
          <button onClick={signOut}>Sign out</button>
        </>
      }
    </>
  );
}

SignIn.getInitialProps = async (context) => {
  return {
    providers: await providers(context),
    csrfToken: await csrfToken(context)
  };
};
