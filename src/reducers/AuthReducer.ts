import { TAuthActions, TAuthInitialValues } from '~/shared/types';

export const AuthReducer = (
  state: TAuthInitialValues,
  action: TAuthActions
) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, ...action?.payload };
    default:
      return state;
  }
};
