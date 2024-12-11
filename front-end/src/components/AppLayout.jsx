import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { logOut } from '../features/auth/authSlice';
import { DashboardOutlined, UserOutlined, LogoutOutlined, BuildOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { role, employeeId } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/');
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
      disabled: role === 'Employee',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: <Link to={`/profile`}>Profile</Link>,
    },
    {
      key: '3',
      icon: <BuildOutlined />,
      label: <Link to="/companies">Companies</Link>,
      disabled: role === 'Employee',
    },
    {
      key: '4',
      icon: <BookOutlined />,
      label: <Link to="/departments">Departments</Link>,
      disabled: role === 'Employee',
    },
    {
      key: '5',
      icon: <TeamOutlined />,
      label: <Link to="/employees">Employees</Link>,
      disabled: role === 'Employee',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        collapsedWidth={80}
        width={200}
      >
        <div className="logo" style={{ color: 'white', textAlign: 'center', padding: '10px 0' }}>
          {!collapsed && <span>Employment Management System</span>} {/* Show logo text when expanded */}
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff',
            padding: '0 20px',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px' }}>Employment Management System</h1>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: '360px' }}>
            <Outlet /> {/* This renders child routes */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;