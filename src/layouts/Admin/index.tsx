import { LogoutOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '~/hooks/useAuth';
import { TProps } from '~/shared/types';

const AdminLayout = ({ children }: TProps<any>) => {
  const router = useRouter();
  const { name, logout } = useAuth();
  const { Content, Footer, Sider } = Layout;
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="flex justify-center py-4">
          <Avatar
            size={64}
            style={{ lineHeight: '58px' }}
            icon={<UserOutlined style={{ verticalAlign: 'middle' }} />}
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
              router.push('/admin');
            }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="u1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/teachers');
            }}
          >
            Teachers
          </Menu.Item>
          <Menu.Item
            key="h1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/students');
            }}
          >
            Students
          </Menu.Item>
          <Menu.Item
            key="c1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/parents');
            }}
          >
            Parents
          </Menu.Item>
          <Menu.Item
            key="dd1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/departments');
            }}
          >
            Departments
          </Menu.Item>
          <Menu.Item
            key="cc1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/courses');
            }}
          >
            Courses
          </Menu.Item>
          <Menu.Item
            key="ss1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/semesters');
            }}
          >
            Semester
          </Menu.Item>

          <Menu.Item
            key="csss1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/subjects');
            }}
          >
            Subjects
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

export default AdminLayout;
