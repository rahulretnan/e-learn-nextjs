import { LogoutOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetUserProfile } from '~/gql/user/queries';
import { useAuth } from '~/hooks/useAuth';
import { TProps } from '~/shared/types';

const StudentLayout = ({ children }: TProps<any>) => {
  const router = useRouter();
  const { name, logout, user_id, dispatch } = useAuth();
  const { Content, Footer, Sider } = Layout;
  const [profile, setProfile] = useState();

  console.log(user_id);

  const [{ data }] = useQuery({
    query: GetUserProfile,
    requestPolicy: 'network-only',
    variables: { user_id: user_id },
    pause: !user_id,
  });

  useEffect(() => {
    if (data) {
      setProfile(get(data, 'users.0.user_details.0.profile_picture'));
      dispatch({
        type: 'SET_USER',
        payload: { current_student_id: get(data, 'users.0.students.0.id') },
      });
    }
  }, [data]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="flex justify-center py-4">
          <Avatar
            size={64}
            style={{ lineHeight: '58px' }}
            icon={
              !profile && <UserOutlined style={{ verticalAlign: 'middle' }} />
            }
            src={profile}
          />
        </div>
        <div className="text-white text-center mb-2">
          <strong>{name}</strong>
        </div>
        <Menu defaultActiveFirst theme="dark" mode="inline">
          <Menu.Item
            key="d1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/student');
            }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="h44"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/student/assignments');
            }}
          >
            Assignments
          </Menu.Item>
          <Menu.Item
            key="h1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/student/attendance');
            }}
          >
            Attendance
          </Menu.Item>
          <Menu.Item
            key="c1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/student/marks');
            }}
          >
            Marks
          </Menu.Item>

          <Menu.Item
            key="signout"
            icon={<LogoutOutlined />}
            onClick={async () => {
              await logout();
              router.push('/signin');
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: '100vh' }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>E-Learn © 2021</Footer>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;
