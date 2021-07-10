import React, { createContext } from 'react';
import { TChildrenProps } from '~/shared/types';

const AuthProviderContext = createContext(null);

const AuthProvider = ({ children }: TChildrenProps) => {
  return (
    <AuthProviderContext.Provider value={{}}>
      {children}
    </AuthProviderContext.Provider>
  );
};

export default AuthProvider;
