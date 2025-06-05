import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Typography, Drawer } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  ToolOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import '../styles/MainLayout.css';

dayjs.extend(customParseFormat);

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
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
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
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
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
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
    <Layout className="main-layout">
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={80}
          className="sider"
        >
          <div className="logo-container">
            {!collapsed && 'Zed_X'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.slice(0, -2)}
            className="main-menu"
          />
          <div className="logout-container">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[]}
              items={menuItems.slice(-2)}
              className="logout-menu"
            />
          </div>
        </Sider>
      )}
      {/* Mobile Bottom Navigation Bar */}
      {isMobile && (
        <nav className="bottom-nav-bar">
          {menuItems.slice(0, 5).map((item) => (
            <div
              key={item.key}
              className={`bottom-nav-item${location.pathname === item.key ? ' active' : ''}`}
              onClick={() => navigate(item.key)}
            >
              {item.icon}
              <span className="bottom-nav-label">{item.label.props.children}</span>
            </div>
          ))}
        </nav>
      )}
      <Layout className={`content-layout ${!collapsed && !isMobile ? 'expanded' : ''}`}>
        <Header className="header" style={{ background: colorBgContainer }}>
          {/* Hide menu toggle button on mobile */}
          {!isMobile && (
            <span
              className="menu-toggle-btn"
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              style={{ cursor: 'pointer', fontSize: 20, marginLeft: 16, marginRight: 24 }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
          )}
          <div className="datetime-container">
            <Text className="date-text">{currentDateTime.format('DD MMMM YYYY')}</Text>
            <Text strong className="time-text">{currentDateTime.format('h:mm:ss A')}</Text>
          </div>
        </Header>
        <Content
          className="content"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 