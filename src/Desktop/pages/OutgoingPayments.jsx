import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Card, Typography, Tooltip, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import '../styles/OutgoingPayments.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import dayjs from 'dayjs';
import { saveOutgoingPayment, updateOutgoingPayment, getAllOutgoingPaymentsPaginated } from '../../API/OutgoingPaymentApi';
import { getAllOutgoingPaymentCategories } from '../../API/OutgoingPaymentCategoryApi';
import { getAllPaymentMethods } from '../../API/PaymentMethodApi';

const { Title } = Typography;
const { Option } = Select;

const OutgoingPayments = () => {
  const [payments, setPayments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [form] = Form.useForm();
  const headingRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPayments, setTotalPayments] = useState(0);
  const [outgoingPaymentCategories, setOutgoingPaymentCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useHeadingObserver(headingRef);

  const fetchPayments = async (page, size) => {
    setLoading(true);
    try {
      const response = await getAllOutgoingPaymentsPaginated(page, size);
      if (response && response.payload) {
        setPayments(response.payload);
        setTotalPayments(response.totalRecords);
      } else {
        message.error(response.errorDescription || 'Failed to fetch payments.');
      }
    } catch (error) {
      message.error('Error fetching payments');
    }
    setLoading(false);
  };

  const fetchCategoriesAndMethods = async () => {
    try {
      const categoriesResponse = await getAllOutgoingPaymentCategories();
      if (categoriesResponse && categoriesResponse.responseDto) {
        setOutgoingPaymentCategories(categoriesResponse.responseDto);
      } else {
        message.error(categoriesResponse.errorDescription || 'Failed to fetch categories.');
      }

      const methodsResponse = await getAllPaymentMethods();
      if (methodsResponse && methodsResponse.responseDto) {
        setPaymentMethods(methodsResponse.responseDto);
      } else {
        message.error(methodsResponse.errorDescription || 'Failed to fetch payment methods.');
      }
    } catch (error) {
      message.error('Error fetching categories and methods');
    }
  };

  useEffect(() => {
    fetchPayments(currentPage, pageSize);
    fetchCategoriesAndMethods();
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span className="payment-description">{text}</span>,
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      sorter: (a, b) => dayjs(a.dateTime).unix() - dayjs(b.dateTime).unix(),
      render: (text) => <span className="payment-datetime">{dayjs(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `LKR${amount.toFixed(2)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Category',
      dataIndex: ['outgoingPaymentCategoryDto', 'name'],
      key: 'category',
      render: (text) => <span className="payment-category">{text}</span>,
    },
    {
      title: 'Payment Method',
      dataIndex: ['paymentMethodDto', 'name'],
      key: 'paymentMethod',
      render: (text) => <span className="payment-method">{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Payment">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              className="action-button edit"
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="Delete Payment">
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

  const handleAdd = () => {
    setEditingPayment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    form.setFieldsValue({
      ...payment,
      outgoingPaymentCategoryDto: payment.outgoingPaymentCategoryDto?.id,
      paymentMethodDto: payment.paymentMethodDto?.id,
      dateTime: dayjs(payment.dateTime),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this payment?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk() {
        setPayments(payments.filter(payment => payment.id !== id));
        message.success('Payment deleted successfully');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const paymentData = {
        ...values,
        outgoingPaymentCategoryDto: { id: values.outgoingPaymentCategoryDto },
        paymentMethodDto: { id: values.paymentMethodDto },
        dateTime: editingPayment ? editingPayment.dateTime : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      };

      let response;
      if (editingPayment) {
        response = await updateOutgoingPayment({ ...paymentData, id: editingPayment.id });
        if (response && response.responseDto) {
          message.success('Payment updated successfully');
        } else {
          message.error(response.errorDescription || 'Failed to update payment.');
        }
      } else {
        response = await saveOutgoingPayment(paymentData);
        if (response && response.responseDto) {
          message.success('Payment added successfully');
        } else {
          message.error(response.errorDescription || 'Failed to add payment.');
        }
      }
      setIsModalVisible(false);
      fetchPayments(currentPage, pageSize);
    } catch (error) {
      console.error('Form validation failed:', error);
      message.error('Please fill in all required fields correctly.');
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="outgoing-payments-container">
      <h1 ref={headingRef} className="visually-hidden">Outgoing Payments</h1>
      
      <Card className="outgoing-payments-card">
        <div className="outgoing-payments-header">
          <Title level={2} className="outgoing-payments-title">Outgoing Payments Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            className="add-payment-button"
          >
            Add New Payment
          </Button>
        </div>

        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={payments}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalPayments,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} payments`,
              onChange: handleTableChange,
            }}
            loading={loading}
            className="outgoing-payments-table"
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
            {editingPayment ? 'Edit Payment' : 'Add New Payment'}
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
        okText={editingPayment ? 'Update Payment' : 'Add Payment'}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="description"
            label={
              <span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>
                Description
                <Tooltip title="A brief description of the payment">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: 'Please enter description' }]}>
            <Input 
              placeholder="e.g., Office supplies"
              style={{
                borderRadius: 6,
                borderColor: '#1677ff',
                boxShadow: '0 2px 8px #e6f7ff'
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="amount"
            label={
              <span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>
                Amount
                <Tooltip title="Enter the payment amount">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, type: 'number', message: 'Please enter a valid amount' }]}>
            <InputNumber
              min={0}
              step={0.01}
              style={{
                width: '100%',
                borderRadius: 6,
                borderColor: '#1677ff',
                boxShadow: '0 2px 8px #e6f7ff'
              }}
              formatter={value => `LKR ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/LKR\s?|(,*)/g, '')}
              placeholder="e.g., 1500.00"
            />
          </Form.Item>

          <Form.Item
            name="outgoingPaymentCategoryDto"
            label={
              <span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>
                Category
                <Tooltip title="Select the payment category">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: 'Please select a category' }]}>
            <Select 
              placeholder="Select a category"
              style={{
                borderRadius: 6,
                borderColor: '#1677ff',
                boxShadow: '0 2px 8px #e6f7ff'
              }}
            >
              {outgoingPaymentCategories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="paymentMethodDto"
            label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Payment Method</span>}
            rules={[{ required: true, message: 'Please select a payment method' }]}>
            <Select 
              placeholder="Select Payment Method"
              style={{
                borderRadius: 6,
                borderColor: '#1677ff',
                boxShadow: '0 2px 8px #e6f7ff'
              }}
            >
              {paymentMethods.map(method => (
                <Option key={method.id} value={method.id}>{method.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OutgoingPayments; 