import {useAuthState, useSignOut} from 'react-firebase-hooks/auth';
import {auth} from "../util/firebase";
import {EmailAuthProvider} from 'firebase/auth'
import StyledFirebaseAuth from "../components/auth/StyledFirebaseAuth";

const Login = () => {
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  const firebaseAuthConfig = {
    signInFlow: 'popup',
    signInOptions: [
      {
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
    ],
    signInSuccessUrl: '/',
    credentialHelper: 'none',
    callbacks: {
      signInSuccessWithAuthResult: () =>
        false,
    },
  }

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  } else if (user) {
    return (
      <div>
        <div>Signed in as {user.email}</div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  } else {
    return (
      <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={auth}/>
    );
  }
}

export default Login;