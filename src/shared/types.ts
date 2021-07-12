import { Dispatch, PropsWithChildren } from 'react';

export type TProps<P> = P & PropsWithChildren<any>;

export type TRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export type TUser = {
  uid: string | undefined;
  name: string | undefined;
  email: string | undefined;
  token: string | undefined;
  role?: TRole;
};

export type TUsers = {
  name: string | undefined;
  email: string | undefined;
};

export type TUserDetails = TUsers & {
  user_id?: string | undefined;
  phone?: string | undefined;
  dob?: moment.Moment;
  age?: string | undefined;
  address?: string | undefined;
  category?: string | undefined;
  state?: string | undefined;
  religion?: string | undefined;
  gender?: string | undefined;
  father_name?: string | undefined;
  mother_name?: string | undefined;
  guardian?: string | undefined;
  nationality?: string | undefined;
  qualification?: string | undefined;
  designation?: string | undefined;
  relation?: string | undefined;
  profile_picture?: string | ArrayBuffer | undefined;
};

export type TAuthActions = {
  type: 'SET_USER';
  payload?: any;
};

export type TAuthInitialValues = TUser & {
  isAuthenticated?: boolean;
  loading?: boolean;
};

export type TAuthContext = {
  user: TAuthInitialValues;
  dispatch: Dispatch<TAuthActions>;
};

export type TTeacher = TUserDetails & {
  id?: string | undefined;
  department_id?: string | undefined;
  role: 'TEACHER';
};

export type TStudent = TUserDetails & {
  id?: string | undefined;
  department_id?: string | undefined;
  course_id?: string | undefined;
  semester_id?: string | undefined;
  role: 'STUDENT';
};

export type TParent = TUserDetails & {
  id?: string | undefined;
  student_id?: string | undefined;
  role: 'PARENT';
};
