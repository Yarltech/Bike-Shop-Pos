import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Card, Typography, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/OutgoingPaymentCategories.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import { saveOutgoingPaymentCategory, updateOutgoingPaymentCategory, getAllOutgoingPaymentCategories, updateOutgoingPaymentCategoryStatus } from '../../API/OutgoingPaymentCategoryApi';

const { Title } = Typography;

const OutgoingPaymentCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const headingRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);

  useHeadingObserver(headingRef);

  const fetchCategories = async (page, size) => {
    setLoading(true);
    try {
      const response = await getAllOutgoingPaymentCategories();
      if (response && response.responseDto) {
        setCategories(response.responseDto);
        setTotalCategories(response.responseDto.length); // Assuming getAll returns all and pagination happens client-side if needed, otherwise API should return total records
      } else {
        message.error(response.errorDescription || 'Failed to fetch categories.');
      }
    } catch (error) {
      message.error('Error fetching categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="category-name">{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Category">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              className="action-button edit"
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="Delete Category">
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
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: async () => {
        const response = await updateOutgoingPaymentCategoryStatus(id, 0); // Set status to 0 for soft delete
        if (response && response.responseDto) {
          message.success('Category deleted successfully');
          fetchCategories(currentPage, pageSize); // Re-fetch categories to update the table
        } else {
          message.error(response.errorDescription || 'Failed to delete category.');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const categoryData = { ...values, isActive: true };

      let response;
      if (editingCategory) {
        response = await updateOutgoingPaymentCategory({ ...categoryData, id: editingCategory.id });
        if (response && response.responseDto) {
          message.success('Category updated successfully');
        } else {
          message.error(response.errorDescription || 'Failed to update category.');
        }
      } else {
        response = await saveOutgoingPaymentCategory(categoryData);
        if (response && response.responseDto) {
          message.success('Category added successfully');
        } else {
          message.error(response.errorDescription || 'Failed to add category.');
        }
      }
      setIsModalVisible(false);
      fetchCategories(currentPage, pageSize);
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
    <div className="outgoing-payment-categories-container">
      <h1 ref={headingRef} className="visually-hidden">Outgoing Payment Categories</h1>
      
      <Card className="outgoing-payment-categories-card">
        <div className="outgoing-payment-categories-header">
          <Title level={2} className="outgoing-payment-categories-title">Outgoing Payment Categories Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            className="add-category-button"
          >
            Add New Category
          </Button>
        </div>

        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalCategories,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} categories`,
              onChange: handleTableChange,
            }}
            loading={loading}
            className="outgoing-payment-categories-table"
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
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
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
        okText={editingCategory ? 'Update Category' : 'Add Category'}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Category Name</span>}
            rules={[{ required: true, message: 'Please enter category name' }]}>
            <Input 
              placeholder="e.g., Office Supplies"
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

export default OutgoingPaymentCategories; 