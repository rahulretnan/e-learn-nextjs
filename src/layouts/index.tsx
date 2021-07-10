import { useRouter } from 'next/router';
import React from 'react';
import { TChildrenProps } from '~/shared/types';
import AdminLayout from './Admin';
import StudentLayout from './Student';
import TeacherLayout from './Teacher';

const Layouts: any = {
  admin: AdminLayout,
  teacher: TeacherLayout,
  student: StudentLayout,
};

const AppLayout = ({ children }: TChildrenProps) => {
  const { pathname } = useRouter();
  const getLayout = () => {
    if (pathname.includes('auth')) {
      return 'auth';
    }
    if (role === 'ADMIN' && pathname.includes('admin') && isAuthenticated) {
      return 'admin';
    }
    return 'main';
  };
  const Container = Layouts[getLayout()];
  return <Container>{children}</Container>;
};

export default AppLayout;
