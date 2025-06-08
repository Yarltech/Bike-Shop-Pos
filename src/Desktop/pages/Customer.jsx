import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Card, Typography, Tooltip, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/Customers.css'; // Reuse the same styles
import useHeadingObserver from '../layouts/useHeadingObserver';
import { saveCustomer, updateCustomer, getAllCustomersPaginated, updateCustomerStatus } from '../../API/CustomerApi';
import { getTransactionsByCustomer } from '../../API/TransactionApi';
import dayjs from 'dayjs';

const { Title } = Typography;

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();
  const headingRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [customerTransactions, setCustomerTransactions] = useState({});
  const [loadingTransactions, setLoadingTransactions] = useState({});
  
  useHeadingObserver(headingRef);

  const fetchCustomers = async (page, size) => {
    setLoading(true);
    try {
      const response = await getAllCustomersPaginated(page, size, true);
      if (response && response.payload) {
        setCustomers(response.payload);
        setTotalCustomers(response.totalRecords);
      } else {
        message.error(response.errorDescription || 'Failed to fetch customers.');
      }
    } catch (error) {
      message.error('Error fetching customers');
    }
    setLoading(false);
  };

  const fetchCustomerTransactions = async (customerId) => {
    if (customerTransactions[customerId]) return; // Don't fetch if already loaded

    setLoadingTransactions(prev => ({ ...prev, [customerId]: true }));
    try {
      const response = await getTransactionsByCustomer(1, 10, customerId);
      if (response && response.responseDto) {
        setCustomerTransactions(prev => ({
          ...prev,
          [customerId]: response.responseDto.payload
        }));
      } else {
        message.error(response.errorDescription || 'Failed to fetch customer transactions.');
      }
    } catch (error) {
      message.error('Error fetching customer transactions');
    }
    setLoadingTransactions(prev => ({ ...prev, [customerId]: false }));
  };

  useEffect(() => {
    fetchCustomers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <span className="customer-name">{text}</span>,
    },
    { 
      title: 'Vehicle Number', 
      dataIndex: 'vehicleNumber', 
      key: 'vehicleNumber',
      render: (text) => <span className="customer-vehicle-number">{text}</span>,
    },
    { 
      title: 'Mobile Number', 
      dataIndex: 'mobileNumber', 
      key: 'mobileNumber',
      render: (text) => <span className="customer-mobile-number">{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Customer">
            <Button 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              className="action-button edit"
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="Delete Customer">
            <Button 
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              danger
              className="action-button delete"
              shape="circle"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const transactionColumns = [
      {
        title: 'Transaction No',
        dataIndex: 'transactionNo',
        key: 'transactionNo',
        width: 150,
      },
      {
        title: 'Date',
        dataIndex: 'advancePaymentDateTime',
        key: 'date',
        render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        width: 180,
      },
      {
        title: 'Total',
        dataIndex: 'totalAmount',
        key: 'total',
        render: (total) => `LKR ${total.toFixed(2)}`,
        width: 120,
      },
      {
        title: 'Payment Method',
        dataIndex: ['paymentMethodDto', 'name'],
        key: 'paymentMethod',
        width: 150,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'Completed' ? 'green' : 'orange'}>
            {status}
          </Tag>
        ),
        width: 120,
      },
    ];

    return (
      <div className="customer-transactions-container">
        <Card size="small" title="Transaction History" className="customer-transactions-card">
          <Table
            columns={transactionColumns}
            dataSource={customerTransactions[record.id] || []}
            pagination={false}
            rowKey="id"
            loading={loadingTransactions[record.id]}
            className="customer-transactions-table"
          />
        </Card>
      </div>
    );
  };

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
    Modal.confirm({
      title: 'Are you sure you want to delete this customer?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: async () => {
        const response = await updateCustomerStatus(id, 0); // Set status to 0 for soft delete
        if (response && response.responseDto) {
          message.success('Customer deleted successfully');
          fetchCustomers(currentPage, pageSize); // Re-fetch customers to update the table
        } else {
          message.error(response.errorDescription || 'Failed to delete customer.');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let response;
      if (editingCustomer) {
        response = await updateCustomer({ ...values, id: editingCustomer.id, isActive: 1 });
        if (response && response.responseDto) {
          message.success('Customer updated successfully');
        } else {
          message.error(response.errorDescription || 'Failed to update customer.');
        }
      } else {
        response = await saveCustomer({ ...values, isActive: 1 });
        if (response && response.responseDto) {
          message.success('Customer added successfully');
        } else {
          message.error(response.errorDescription || 'Failed to add customer.');
        }
      }
      setIsModalVisible(false);
      fetchCustomers(currentPage, pageSize); // Re-fetch customers to update the table
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const onExpand = (expanded, record) => {
    if (expanded) {
      fetchCustomerTransactions(record.id);
    }
  };

  return (
    <div className="customers-container">
      <h1 ref={headingRef} className="visually-hidden">Customers</h1>
      
      <Card className="customers-card">
        <div className="customers-header">
          <Title level={2} className="customers-title">Customer Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            className="add-customer-button"
          >
            Add New Customer
          </Button>
        </div>

        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              total: totalCustomers,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} customers`,
              onChange: handleTableChange,
            }}
            expandable={{
              expandedRowRender,
              onExpand,
            }}
            loading={loading}
            className="customers-table"
          />
        </div>
      </Card>

      <Modal
        title={
          <div style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#1677ff',
            borderBottom: '2px solid #e6f7ff',
            paddingBottom: 12,
            marginBottom: 8
          }}>
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okButtonProps={{
          style: {
            background: '#1677ff',
            borderColor: '#1677ff',
            height: 40,
            fontSize: 16,
            fontWeight: 500,
            borderRadius: 6,
            boxShadow: '0 2px 8px #e6f7ff'
          }
        }}
        cancelButtonProps={{
          style: {
            height: 40,
            fontSize: 16,
            fontWeight: 500,
            borderRadius: 6,
            borderColor: '#1677ff',
            color: '#1677ff'
          }
        }}
        styles={{
          body: {
            padding: '24px 32px',
            background: '#f5faff',
            borderRadius: 8
          }
        }}
        okText={editingCustomer ? 'Update Customer' : 'Add Customer'}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Customer Name</span>}
            rules={[{ required: true, message: 'Please enter customer name' }]}>
            <Input 
              placeholder="Enter customer name"
              style={{
                borderRadius: 6,
                borderColor: '#1677ff',
                boxShadow: '0 2px 8px #e6f7ff'
              }}
            />
          </Form.Item>
          <Form.Item
            name="vehicleNumber"
            label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Vehicle Number</span>}
            rules={[{ required: true, message: 'Please enter vehicle number' }]}>
            <Input 
              placeholder="Enter vehicle number"
              style={{
                borderRadius: 6,
                borderColor: '#1677ff',
                boxShadow: '0 2px 8px #e6f7ff'
              }}
            />
          </Form.Item>
          <Form.Item
            name="mobileNumber"
            label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Mobile Number</span>}
            rules={[{ required: true, message: 'Please enter mobile number' }, { pattern: /^\d{10}$/, message: 'Enter a valid 10-digit mobile number' }]}>
            <Input 
              placeholder="Enter mobile number"
              style={{
                borderRadius: 6,
                borderColor: '#1677ff',
                boxShadow: '0 2px 8px #e6f7ff'
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customer;
