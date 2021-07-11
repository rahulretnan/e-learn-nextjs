import React from 'react';
import { TProps } from '~/shared/types';
import AuthProvider from './AuthProvider';

const AppContextProvider = ({ children, userData }: TProps<any>) => {
  return <AuthProvider userData={userData}>{children}</AuthProvider>;
};

export default AppContextProvider;
