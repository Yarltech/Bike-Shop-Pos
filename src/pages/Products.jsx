import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Bike Chain', price: 15.99, stock: 50, category: 'Parts' },
    { id: 2, name: 'Brake Pads', price: 12.99, stock: 30, category: 'Parts' },
    { id: 3, name: 'Inner Tube', price: 8.99, stock: 100, category: 'Parts' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `LKR${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
    message.success('Product deleted successfully');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingProduct) {
        setProducts(products.map(product =>
          product.id === editingProduct.id ? { ...product, ...values } : product
        ));
        message.success('Product updated successfully');
      } else {
        setProducts([...products, { id: Date.now(), ...values }]);
        message.success('Product added successfully');
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Product
        </Button>
      </div>

      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              className="price-input"
              prefix="$"
            />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Please enter stock quantity' }]}
          >
            <InputNumber min={0} className="stock-input" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please enter category' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products; 