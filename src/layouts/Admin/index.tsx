import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { TChildrenProps } from '~/shared/types';

const AdminLayout = ({ children }: TChildrenProps) => {
  const router = useRouter();
  const { Content, Footer, Sider } = Layout;
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="logo">
          <Avatar
            size={64}
            style={{ lineHeight: '58px' }}
            icon={<UserOutlined style={{ verticalAlign: 'middle' }} />}
          />
        </div>
        <div className="text-white text-center mb-2">
          {/* <strong>{auth.user.name}</strong> */}
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
              router.push('/admin/teacher');
            }}
          >
            Teachers
          </Menu.Item>
          <Menu.Item
            key="h1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/student');
            }}
          >
            Students
          </Menu.Item>
          <Menu.Item
            key="c1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/parent');
            }}
          >
            Parents
          </Menu.Item>
          <Menu.Item
            key="dd1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/department');
            }}
          >
            Departments
          </Menu.Item>
          <Menu.Item
            key="cc1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/course');
            }}
          >
            Courses
          </Menu.Item>
          <Menu.Item
            key="ss1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/semester');
            }}
          >
            Semester
          </Menu.Item>

          <Menu.Item
            key="csss1"
            icon={<TeamOutlined />}
            onClick={() => {
              router.push('/admin/subject');
            }}
          >
            Subjects
          </Menu.Item>

          <Menu.Item
            key="signout"
            // icon={<LogoutOutlined />}
            // onClick={() => {
            //     Inertia.post("/logout");
            // }}
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
