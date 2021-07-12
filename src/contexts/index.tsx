import React from 'react';
import { TProps } from '~/shared/types';
import AuthProvider from './AuthProvider';

const AppContextProvider = ({ children }: TProps<any>) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppContextProvider;
