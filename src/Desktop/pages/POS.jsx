import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Typography, Space, message } from 'antd';
import { DeleteOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import '../styles/POS.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import { getAllServicesPaginated } from '../../API/ServiceApi';
import { getAllOutgoingPaymentCategories } from '../../API/OutgoingPaymentCategoryApi';

const { Title } = Typography;

const POS = () => {
  const [cart, setCart] = useState([]);
  const headingRef = useRef(null);
  const [services, setServices] = useState([]);
  const [outgoingPaymentCategories, setOutgoingPaymentCategories] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useHeadingObserver(headingRef);

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const response = await getAllServicesPaginated(1, 100, true); // Fetch all active services
      if (response && response.payload) {
        setServices(response.payload);
      } else {
        message.error(response.errorDescription || 'Failed to fetch services.');
      }
    } catch (error) {
      message.error('Error fetching services');
    }
    setLoadingServices(false);
  };

  const fetchOutgoingPaymentCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await getAllOutgoingPaymentCategories();
      if (response && response.responseDto) {
        setOutgoingPaymentCategories(response.responseDto);
      } else {
        message.error(response.errorDescription || 'Failed to fetch outgoing payment categories.');
      }
    } catch (error) {
      message.error('Error fetching outgoing payment categories');
    }
    setLoadingCategories(false);
  };

  useEffect(() => {
    fetchServices();
    fetchOutgoingPaymentCategories();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const cartColumns = [
    {
      title: 'Icon',
      key: 'icon',
      width: '20%',
      render: (_, record) => <span style={{ fontSize: 22 }}>{record.icon}</span>,
    },
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
      ellipsis: true,
    },
    {
      title: 'Qty',
      key: 'quantity',
      width: '20%',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => updateQuantity(record.id, record.quantity - 1)}
            className="quantity-btn"
          >
            -
          </Button>
          <span className="quantity-text">{record.quantity}</span>
          <Button
            size="small"
            onClick={() => updateQuantity(record.id, record.quantity + 1)}
            className="quantity-btn"
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
          className="delete-btn"
        />
      ),
    },
  ];

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalAmount(total);
    };
    calculateTotalAmount();
  }, [cart]);

  const handleRefresh = () => {
    setCart([]);
    message.success('Table refreshed!');
  };

  return (
    <div className="pos-container">
      <h1 ref={headingRef} className="visually-hidden">POS</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card className="products-section">
            <Title level={4} style={{ marginBottom: 16 }}>Services</Title>
            <Row gutter={[8, 8]} loading={loadingServices}>
              {services.map(service => (
                <Col xs={12} sm={8} md={6} key={service.id}>
                  <Card
                    hoverable
                    onClick={() => addToCart(service)}
                    className="product-card"
                  >
                    <div className="product-icon">{service.icon}</div>
                    <Title level={5} className="product-title">{service.name}</Title>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card className="products-section" style={{ marginTop: 24 }}>
            <Title level={4} style={{ marginBottom: 16 }}>Outgoing Payment Categories</Title>
            <Row gutter={[8, 8]} loading={loadingCategories}>
              {outgoingPaymentCategories.map((category) => (
                <Col xs={12} sm={8} md={6} key={category.id}>
                  <Card
                    hoverable
                    className="product-card"
                    onClick={() => {/* handle click for each item if needed */}}
                  >
                    <Title level={5} className="product-title" style={{ textAlign: 'center' }}>{category.name}</Title>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="cart-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Current Order</Title>
              <Space>
                <Button type="default" icon={<ReloadOutlined />} onClick={handleRefresh}>
                  Refresh
                </Button>
                <Button type="default" className="pending-task-btn">
                  Pending Task
                </Button>
              </Space>
            </div>
            <div className="cart-table-container">
              <Table
                dataSource={cart}
                columns={cartColumns}
                pagination={false}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                size="small"
              />
            </div>
            <div className="order-summary" style={{ textAlign: 'right', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Total: LKR{totalAmount.toFixed(2)}</Title>
            </div>
            <Button
              type="primary"
              block
              icon={<PrinterOutlined />}
              className="advance-payment-button"
              size="large"
            >
              Advance Payment
            </Button>
            <Button
              type="primary"
              block
              icon={<PrinterOutlined />}
              className="final-payment-button"
              size="large"
              style={{ marginTop: 8, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Final Payment
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default POS; 