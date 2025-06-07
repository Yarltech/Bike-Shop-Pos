import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  ToolOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UserOutlined,
  DollarOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import '../styles/SideBar.css';

const { Sider, Header } = Layout;
const { Text } = Typography;

const gradientAnimation = {
  background: 'linear-gradient(270deg, #a259f7, #f857a6, #a259f7)',
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 900,
  fontSize: 28,
  letterSpacing: 2,
  animation: 'gradientMove 3s linear infinite',
  textAlign: 'center',
  marginBottom: 24,
  marginTop: 8,
  display: 'block',
};

const keyframes = `
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const SideBar = ({ isMobile, collapsed, pageTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = React.useState(dayjs());

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(dayjs());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/signin');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/pos',
      icon: <ShoppingCartOutlined />,
      label: 'POS',
      onClick: () => navigate('/pos'),
    },
    {
      key: '/services',
      icon: <ToolOutlined />,
      label: 'Services',
      onClick: () => navigate('/services'),
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Customers',
      onClick: () => navigate('/customers'),
    },
    {
      key: '/transactions',
      icon: <HistoryOutlined />,
      label: 'Transactions',
      onClick: () => navigate('/transactions'),
    },
    {
      key: '/outgoing-payments',
      icon: <DollarOutlined />,
      label: 'Payments',
      onClick: () => navigate('/outgoing-payments'),
    },
    {
      key: '/outgoing-payment-categories',
      icon: <TagsOutlined />,
      label: 'Payment Category',
      onClick: () => navigate('/outgoing-payment-categories'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
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

  if (isMobile) {
    return (
      <nav className="bottom-nav-bar">
        {menuItems.slice(0, 5).map((item) => (
          <div
            key={item.key}
            className={`bottom-nav-item${location.pathname === item.key ? ' active' : ''}`}
            onClick={item.onClick}
          >
            {item.icon}
            <span className="bottom-nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      <Header className="sidebar-header">
        <span className="sidebar-header-title">{pageTitle}</span>
        <div className="sidebar-date-time">
          <Text strong className="sidebar-date">{currentDateTime.format('MMMM D, YYYY')}</Text>
          <Text className="sidebar-time">{currentDateTime.format('h:mm:ss A')}</Text>
        </div>
      </Header>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        width={220}
        collapsedWidth={80}
        className="sidebar-container"
      >
        <div className="sidebar-logo">
          <span style={gradientAnimation} className="zedx-gradient">Zed_X</span>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.filter(item => !item.type).map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.onClick,
            danger: item.danger,
          }))}
          className="sidebar-menu"
        />
      </Sider>
    </>
  );
};

export default SideBar;
