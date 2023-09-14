import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../util/firebase";
import {Navigate} from 'react-router-dom'

const LoggedInRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (!user && !loading) {
    return <Navigate to={'/login'} replace={true}/>;
  } else if (error) {
    return <div>Error: {error}</div>;
  } else if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}

export default LoggedInRoute;