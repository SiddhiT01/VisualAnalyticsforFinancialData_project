
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useBlocker = (when, message) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!when) return;

    const unblock = navigate.block((location, action) => {
      if (window.confirm(message)) {
        unblock();
        navigate(location.pathname);
      } else {
        unblock();
      }
    });

    return () => {
      unblock();
    };
  }, [when, message, navigate]);
};

export default useBlocker;
