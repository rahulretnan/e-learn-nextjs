import axios from 'axios';
import nookies from 'nookies';
import { useContext } from 'react';
import { AuthProviderContext } from '~/contexts/AuthProvider';
import {
  currentAccount,
  firebaseAuth,
  forgotPassword,
  login,
  logout,
} from '~/services/firebase';

export const useAuth = () => {
  const { user, dispatch } = useContext(AuthProviderContext);

  const setLoading = (state: boolean) => {
    dispatch({
      type: 'SET_USER',
      payload: { loading: state },
    });
  };

  const getLogin = async (email: string, password: string) => {
    setLoading(true);
    const res = await login(email, password);

    if (res) {
      const response: any = await currentAccount();

      if (response) {
        dispatch({
          type: 'SET_USER',
          payload: { ...response, isAuthenticated: true },
        });
        nookies.set(undefined, 'token', response?.token, {});
        setLoading(false);
        return response;
      }
    }
    setLoading(false);
    return false;
  };

  const getLogout = async () => {
    setLoading(true);
    await logout();
    dispatch({
      type: 'SET_USER',
      payload: { isAuthenticated: false },
    });
    nookies.set(undefined, 'token', '', {});
    setLoading(false);
  };

  const register = async (data: any) => {
    setLoading(true);

    const res = axios.post('/api/user/create', { ...data });

    setLoading(false);
    return res;
  };

  async function sendForgotPasswordMail(email: string) {
    setLoading(true);

    const flag = await forgotPassword(email);

    setLoading(false);
    return flag;
  }

  return {
    ...user,
    firebaseAuth,
    register,
    login: getLogin,
    sendForgotPasswordMail,
    logout: getLogout,
    currentAccount,
    setLoading,
  };
};
