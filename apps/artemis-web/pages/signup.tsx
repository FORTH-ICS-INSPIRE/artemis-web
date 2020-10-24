import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useUser } from '../lib/hooks';

const SignupPage: React.FunctionComponent<{}> = () => {
  const SignUpComponent = dynamic(() =>
    import('../components/sign-up/sign-up')
  );
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user && !loading) router.push('/');
  }, [user, loading, router]);

  return (
    <div id="page-container">
      {!user && !loading && (
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          <div className="container d-flex align-items-center flex-column">
            <SignUpComponent />
          </div>
        </div>
      )}
    </div>
  );
};

export function getStaticProps(context) {
  return {
    props: {
      pageTitle: 'Sign Up',
    },
  };
}

export default SignupPage;
