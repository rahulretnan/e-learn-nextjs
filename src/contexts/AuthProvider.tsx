import jwtDecode from 'jwt-decode';
import nookies from 'nookies';
import React, { createContext, useEffect, useReducer } from 'react';
import { AuthReducer } from '~/reducers';
import { firebaseAuth } from '~/services/firebase';
import {
  TAuthContext,
  TAuthInitialValues,
  TProps,
  TUser,
} from '~/shared/types';

export const AuthProviderContext = createContext({} as TAuthContext);

export const AuthProvider = ({ children }: TProps<TUser>) => {
  const initialValues: TAuthInitialValues = {
    name: undefined,
    email: undefined,
    token: undefined,
    role: undefined,
    isAuthenticated: false,
    loading: false,
    user_id: undefined,
  };

  const [user, dispatch] = useReducer(AuthReducer, initialValues);

  useEffect(() => {
    return firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        dispatch({ type: 'SET_USER', payload: initialValues });
        nookies.set(undefined, 'token', '', {});
        return;
      }

      const token = await user.getIdToken(true);
      const { name, user_id, email, role } = jwtDecode<any>(token);

      dispatch({
        type: 'SET_USER',
        payload: {
          name,
          user_id,
          email,
          role,
          token,
          isAuthenticated: true,
        },
      });
      nookies.set(undefined, 'token', token, {});
    });
  }, []);

  return (
    <AuthProviderContext.Provider value={{ user, dispatch }}>
      {children}
    </AuthProviderContext.Provider>
  );
};

export default AuthProvider;
