import React, { useEffect } from 'react'
import authStore from '../stores/authStore';

const Logout = () => {
    const store = authStore();
    useEffect(() => {
        store.logout();
    }, []);

  return (
    <div>
      You are now logged out!!
    </div>
  )
}

export default Logout;
