import React, { useState, useRef } from 'react';
import { Row, Col, Card, Button, Input, Table, Typography, Space } from 'antd';
import { SearchOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import '../styles/POS.css';
import useHeadingObserver from '../layouts/useHeadingObserver';

const { Title } = Typography;

const POS = () => {
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState('');
  const headingRef = useRef(null);
  useHeadingObserver(headingRef);
  
  // Sample products data with LKR prices
  const products = [
    { id: 1, name: 'Bike Chain', icon: '🚲' },
    { id: 2, name: 'Brake Pads', icon: '🛑' },
    { id: 3, name: 'Inner Tube', icon: '⭕' },
    { id: 4, name: 'Tire', icon: '🛞' },
    { id: 5, name: 'Handlebar Grip', icon: '🤚' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

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

  return (
    <div className="pos-container">
      <h1 ref={headingRef} className="visually-hidden">POS</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card className="products-section">
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
              size="large"
            />
            <Row gutter={[8, 8]}>
              {filteredProducts.map(product => (
                <Col xs={12} sm={8} md={6} key={product.id}>
                  <Card
                    hoverable
                    onClick={() => addToCart(product)}
                    className="product-card"
                  >
                    <div className="product-icon">{product.icon}</div>
                    <Title level={5} className="product-title">{product.name}</Title>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card className="products-section" style={{ marginTop: 24 }}>
            <Title level={4} style={{ marginBottom: 16 }}>Outgoing Payment</Title>
            <Row gutter={[8, 8]}>
              {["Parts", "Painting", "Stickers", "Salary"].map((item) => (
                <Col xs={12} sm={8} md={6} key={item}>
                  <Card
                    hoverable
                    className="product-card"
                    onClick={() => {/* handle click for each item if needed */}}
                  >
                    <Title level={5} className="product-title" style={{ textAlign: 'center' }}>{item}</Title>
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
              <Button type="default" className="pending-task-btn">
                Pending Task
              </Button>
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
            <Button
              type="primary"
              block
              icon={<PrinterOutlined />}
              className="proceed-button"
              size="large"
            >
              Proceed
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default POS; 