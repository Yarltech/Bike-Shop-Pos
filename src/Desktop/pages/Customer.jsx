import React, { useState, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/Products.css'; // Reuse the same styles
import useHeadingObserver from '../layouts/useHeadingObserver';

const Customer = () => {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '0771234567', address: 'Colombo' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0779876543', address: 'Jaffna' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();
  const headingRef = useRef(null);
  useHeadingObserver(headingRef);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="primary" />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    message.success('Customer deleted successfully');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingCustomer) {
        setCustomers(customers.map(customer =>
          customer.id === editingCustomer.id ? { ...customer, ...values } : customer
        ));
        message.success('Customer updated successfully');
      } else {
        setCustomers([...customers, { id: Date.now(), ...values }]);
        message.success('Customer added successfully');
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div className="products-container">
      <h1 ref={headingRef} className="visually-hidden">Customers</h1>
      <div className="products-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Customer
        </Button>
      </div>

      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}> <Input /> </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter phone' }]}> <Input /> </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter address' }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customer;
