import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../styles/MobilePos.css';
import dayjs from 'dayjs';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { saveOutgoingPayment, updateOutgoingPayment, getAllOutgoingPaymentsPaginated } from '../../API/OutgoingPaymentApi';
import { getAllOutgoingPaymentCategories } from '../../API/OutgoingPaymentCategoryApi';
import { getAllPaymentMethods } from '../../API/PaymentMethodApi';

const { Title } = Typography;
const { Option } = Select;

const MobilePos = () => {
  const [payments, setPayments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalRecords, setTotalRecords] = useState(0);
  const [outgoingPaymentCategories, setOutgoingPaymentCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const fetchPayments = async (page, size) => {
    try {
      const response = await getAllOutgoingPaymentsPaginated(page, size);
      if (response && response.payload) {
        setPayments(response.payload);
        setTotalRecords(response.totalRecords || response.payload.length);
      } else {
        message.error(response.errorDescription || 'Failed to fetch payments.');
      }
    } catch (error) {
      message.error('Error fetching payments');
    }
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
      title: 'Delete Payment?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
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

  return (
    <motion.div
      className="mobile-pos"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mobile-payments-header">
        <Title level={4}>Outgoing Payments</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="mobile-add-button"
        >
          Add Payment
        </Button>
      </div>

      <div className="mobile-payments-list">
        {payments.map((payment) => (
          <motion.div
            key={payment.id}
            className="mobile-payment-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="payment-info">
              <h3>{payment.description}</h3>
              <p className="payment-amount">LKR {payment.amount.toFixed(2)}</p>
              <p className="payment-category">{payment.outgoingPaymentCategoryDto?.name}</p>
              <p className="payment-method">{payment.paymentMethodDto?.name}</p>
              <p className="payment-date">{dayjs(payment.dateTime).format('YYYY-MM-DD HH:mm')}</p>
            </div>
            <div className="payment-actions">
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(payment)}
                type="primary"
                className="mobile-action-button"
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(payment.id)}
                danger
                className="mobile-action-button"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {totalRecords > pageSize && (
        <div className="mobile-pagination">
          <button
            className="mobile-pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="mobile-pagination-info">
            Page {currentPage} of {Math.ceil(totalRecords / pageSize)}
          </span>
          <button
            className="mobile-pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalRecords / pageSize)}
          >
            Next
          </button>
        </div>
      )}

      <Modal
        title={editingPayment ? 'Edit Payment' : 'Add New Payment'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        className="mobile-payment-modal"
        width="100%"
        styles={{
          body: { padding: 0 },
          mask: { background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' },
          content: {
            borderRadius: 20,
            padding: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
        transitionName=""
        maskTransitionName=""
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsModalVisible(false)}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 22,
              fontSize: 16,
              fontWeight: 500,
              borderColor: '#1677ff',
              color: '#1677ff'
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleModalOk}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 22,
              fontSize: 16,
              fontWeight: 500,
              background: '#1677ff',
              border: 'none',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)'
            }}
          >
            {editingPayment ? 'Update' : 'Add'}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          className="mobile-payment-form"
          requiredMark={false}
        >
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input 
              placeholder="e.g., Office supplies"
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, type: 'number', message: 'Please enter a valid amount' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: '100%' }}
              size="large"
              formatter={value => `LKR ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/LKR\s?|(,*)/g, '')}
              placeholder="e.g., 1500.00"
            />
          </Form.Item>

          <Form.Item
            name="outgoingPaymentCategoryDto"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select 
              placeholder="Select a category"
              size="large"
              style={{ width: '100%' }}
              suffixIcon={<DownOutlined style={{ color: '#1677ff', fontSize: 18 }} />}
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
            label="Payment Method"
            rules={[{ required: true, message: 'Please select a payment method' }]}
          >
            <Select 
              placeholder="Select Payment Method"
              size="large"
              style={{ width: '100%' }}
              suffixIcon={<DownOutlined style={{ color: '#1677ff', fontSize: 18 }} />}
            >
              {paymentMethods.map(method => (
                <Option key={method.id} value={method.id}>
                  {method.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default MobilePos;
