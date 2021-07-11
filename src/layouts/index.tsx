import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import { Spinner } from '~/components';
import { useAuth } from '~/hooks/useAuth';
import AdminLayout from './Admin';
import PublicLayout from './Public';
import StudentLayout from './Student';
import TeacherLayout from './Teacher';
const Layouts: any = {
  admin: AdminLayout,
  teacher: TeacherLayout,
  student: StudentLayout,
  public: PublicLayout,
};

const AppLayout = ({ children }: PropsWithChildren<any>) => {
  const { role, isAuthenticated, loading } = useAuth();
  if (loading) <Spinner />;
  const { pathname } = useRouter();
  const getLayout = () => {
    if (role === 'ADMIN' && pathname.includes('admin') && isAuthenticated) {
      return 'admin';
    }
    if (role === 'TEACHER' && pathname.includes('teacher') && isAuthenticated) {
      return 'teacher';
    }
    if (role === 'STUDENT' && pathname.includes('student') && isAuthenticated) {
      return 'student';
    }
    return 'public';
  };
  const Container = Layouts[getLayout()];
  return <Container>{children}</Container>;
};

export default AppLayout;
