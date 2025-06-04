import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Typography, Space } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ToolOutlined,
  HistoryOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(dayjs()); // State for current date and time
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Update date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(dayjs());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        // Keep sidebar open on larger screens if not explicitly collapsed
        // setCollapsed(false); // Or manage based on user preference/initial state
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    // Implement your logout logic here, e.g., clearing tokens, etc.
    console.log('Logging out...');
    localStorage.removeItem('isAuthenticated'); // Clear authentication state
    navigate('/signin'); // Redirect to sign-in page
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/pos',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/pos">POS</Link>,
    },
    {
      key: '/products',
      icon: <ToolOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: '/transactions',
      icon: <HistoryOutlined />,
      label: <Link to="/transactions">Transactions</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          overflow: 'hidden', // Hide default scrollbar as we'll manage scrolling on the menu
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '32px',
            margin: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {!collapsed && 'Bike Shop POS'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.slice(0, -2)}
          style={{ flex: 1, overflowY: 'auto', marginBottom: '50px' }} // Add bottom margin to prevent overlap with logout button
        />
        {/* Absolutely positioned container for the logout menu */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            paddingBottom: '10px', // Add some padding at the very bottom
          }}
        >
           <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[]}
            items={menuItems.slice(-2)}
            style={{ width: '100%' }} // Ensure menu takes full width of its container
          />
        </div>
      </Sider>
      <Layout style={{ 
        marginLeft: collapsed ? 0 : (isMobile ? 0 : 200),
        transition: 'all 0.2s',
        width: '100%',
      }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 999,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#000', 
              marginLeft: collapsed ? 80 : 0, 
              transition: 'margin-left 0.2s', 
            }}
          />
          <div style={{ marginLeft: 'auto', marginRight: '16px', display: 'flex', alignItems: 'center' }}>
            <Text style={{ color: '#000', marginRight: '16px' }}>{currentDateTime.format('DD MMMM YYYY')}</Text>
            <Text strong style={{ color: '#000' }}>{currentDateTime.format('h:mm:ss A')}</Text>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 