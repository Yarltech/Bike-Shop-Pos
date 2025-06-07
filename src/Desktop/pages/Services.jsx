import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Card, Typography, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/Services.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import { saveService, updateService, getAllServicesPaginated, updateServiceStatus } from '../../API/ServiceApi';

const { Title } = Typography;

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();
  const headingRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalServices, setTotalServices] = useState(0);

  useHeadingObserver(headingRef);

  const fetchServices = async (page, size) => {
    setLoading(true);
    const response = await getAllServicesPaginated(page, size, true);
    if (response && response.payload) {
      setServices(response.payload);
      setTotalServices(response.totalRecords);
    } else {
      message.error(response.errorDescription || 'Failed to fetch services.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: (icon) => (
        <div className="service-icon-cell">
          <span className="service-icon">{icon}</span>
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text) => <span className="service-name">{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Service">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              className="action-button edit"
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="Delete Service">
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
    setEditingService(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    form.setFieldsValue(service);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this service?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: async () => {
        const response = await updateServiceStatus(id, 0); // Set status to 0 for soft delete
        if (response && response.responseDto) {
          message.success('Service deleted successfully');
          fetchServices(currentPage, pageSize); // Re-fetch services to update the table
        } else {
          message.error(response.errorDescription || 'Failed to delete service.');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let response;
      if (editingService) {
        response = await updateService({ ...values, id: editingService.id, isActive: 1 });
        if (response && response.responseDto) {
          message.success('Service updated successfully');
        } else {
          message.error(response.errorDescription || 'Failed to update service.');
        }
      } else {
        response = await saveService({ ...values, isActive: 1 });
        if (response && response.responseDto) {
          message.success('Service added successfully');
        } else {
          message.error(response.errorDescription || 'Failed to add service.');
        }
      }
      setIsModalVisible(false);
      fetchServices(currentPage, pageSize); // Re-fetch services to update the table
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="services-container">
      <h1 ref={headingRef} className="visually-hidden">Services</h1>
      
      <Card className="services-card">
        <div className="services-header">
          <Title level={2} className="services-title">Services Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            className="add-service-button"
          >
            Add New Service
          </Button>
        </div>

        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={services}
            rowKey="id"
            pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              total: totalServices,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} services`,
              onChange: handleTableChange,
            }}
            loading={loading}
            className="services-table"
          />
        </div>
      </Card>

      <Modal
        title={
          <div className="modal-title">
            <span className="modal-title-icon">{editingService ? '✏️' : '➕'}</span>
            {editingService ? 'Edit Service' : 'Add New Service'}
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
        className="service-modal"
        okText={editingService ? 'Update Service' : 'Add Service'}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          className="service-form"
        >
          <Form.Item
            name="name"
            label="Service Name"
            rules={[{ required: true, message: 'Please enter service name' }]}
          >
            <Input placeholder="e.g., Bike Repair" />
          </Form.Item>
          
          <Form.Item
            name="icon"
            label="Icon"
            rules={[{ required: true, message: 'Please enter an icon' }]}
          >
            <Input placeholder="Enter an emoji (e.g., 🔧)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services; 