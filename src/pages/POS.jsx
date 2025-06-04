import React, { useState } from 'react';
import { Row, Col, Card, Button, Input, Table, Typography, Space, Divider } from 'antd';
import { SearchOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';

const { Title } = Typography;

const formatCurrency = (amount) => {
  return `LKR ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const POS = () => {
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  // Sample products data with LKR prices
  const products = [
    { id: 1, name: 'Bike Chain', price: 2500, category: 'Parts' },
    { id: 2, name: 'Brake Pads', price: 1800, category: 'Parts' },
    { id: 3, name: 'Inner Tube', price: 1200, category: 'Parts' },
    { id: 4, name: 'Tire', price: 4500, category: 'Parts' },
    { id: 5, name: 'Handlebar Grip', price: 1500, category: 'Parts' },
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
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '20%',
      render: (price) => formatCurrency(price),
    },
    {
      title: 'Qty',
      key: 'quantity',
      width: '20%',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => updateQuantity(record.id, record.quantity - 1)}
          >
            -
          </Button>
          <span>{record.quantity}</span>
          <Button
            size="small"
            onClick={() => updateQuantity(record.id, record.quantity + 1)}
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: '15%',
      render: (_, record) => formatCurrency(record.price * record.quantity),
    },
    {
      title: 'Action',
      key: 'action',
      width: '5%',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
        />
      ),
    },
  ];

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + tax;

  return (
    <div style={{ padding: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card>
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            <Row gutter={[8, 8]}>
              {filteredProducts.map(product => (
                <Col xs={12} sm={8} md={6} key={product.id}>
                  <Card
                    hoverable
                    onClick={() => addToCart(product)}
                    style={{ 
                      textAlign: 'center',
                      cursor: 'pointer',
                      height: '100%',
                    }}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <Title level={5} style={{ marginBottom: '8px' }}>{product.name}</Title>
                    <p style={{ margin: 0 }}>{formatCurrency(product.price)}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card>
            <Title level={4}>Current Order</Title>
            <div style={{ /* overflowX: 'auto' */ }}>
              <Table
                dataSource={cart}
                columns={cartColumns}
                pagination={false}
                rowKey="id"
                /* scroll={{ x: 'max-content' }} */
              />
            </div>
            <Divider />
            <div style={{ textAlign: 'right' }}>
              <p>Subtotal: {formatCurrency(subtotal)}</p>
              <p>Tax (15%): {formatCurrency(tax)}</p>
              <Title level={4}>Total: {formatCurrency(total)}</Title>
            </div>
            <Button
              type="primary"
              block
              icon={<PrinterOutlined />}
              style={{ marginTop: '16px' }}
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