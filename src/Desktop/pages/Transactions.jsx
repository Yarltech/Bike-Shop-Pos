import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, DatePicker, Space, Button, Tag, Typography, message } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import '../styles/Transactions.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import { getAllTransactionsPaginated } from '../../API/TransactionApi';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Transactions = () => {
  const [dateRange, setDateRange] = useState(null);
  const headingRef = useRef(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useHeadingObserver(headingRef);

  const fetchTransactions = async (page, size) => {
    setLoading(true);
    try {
      const response = await getAllTransactionsPaginated(page, size);
      if (response && response.responseDto) {
        setTransactions(response.responseDto.payload);
        setTotalRecords(response.responseDto.totalRecords);
      } else {
        message.error(response.errorDescription || 'Failed to fetch transactions');
      }
    } catch (error) {
      message.error('Error fetching transactions');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transactionNo',
      key: 'transactionNo',
      width: 150,
    },
    {
      title: 'Customer',
      dataIndex: ['customerDto', 'name'],
      key: 'customer',
      width: 150,
    },
    {
      title: 'Vehicle',
      dataIndex: ['customerDto', 'vehicleNumber'],
      key: 'vehicle',
      width: 120,
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'total',
      render: (total) => `LKR ${total.toFixed(2)}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="small"
            shape="circle"
          />
        </Space>
      ),
      width: 80,
    },
  ];

  const expandedRowRender = (record) => {
    const itemColumns = [
      { 
        title: 'Service', 
        dataIndex: ['serviceDto', 'name'], 
        key: 'service',
        render: (text, record) => (
          <Space>
            <span>{record.serviceDto.icon}</span>
            <span>{text}</span>
          </Space>
        )
      },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { 
        title: 'Amount', 
        dataIndex: 'amount', 
        key: 'amount', 
        render: (amount) => `LKR ${amount.toFixed(2)}` 
      },
    ];

    return (
      <div className="transaction-details-container">
        <Card size="small" title="Payment Details" className="payment-details-card">
          <div className="payment-details-grid">
            <div className="payment-detail-item">
              <span className="payment-label">Advance Payment:</span>
              <span className="payment-value">
                {record.advancePaymentAmount ? `LKR ${record.advancePaymentAmount.toFixed(2)}` : 'Not Done'}
              </span>
            </div>
            <div className="payment-detail-item">
              <span className="payment-label">Advance Payment Date:</span>
              <span className="payment-value">
                {record.advancePaymentDateTime ? dayjs(record.advancePaymentDateTime).format('YYYY-MM-DD HH:mm') : 'Not Done'}
              </span>
            </div>
            <div className="payment-detail-item">
              <span className="payment-label">Final Payment:</span>
              <span className="payment-value">
                {record.finalPaymentAmount ? `LKR ${record.finalPaymentAmount.toFixed(2)}` : 'Not Done'}
              </span>
            </div>
            <div className="payment-detail-item">
              <span className="payment-label">Final Payment Date:</span>
              <span className="payment-value">
                {record.finalPaymentDateTime ? dayjs(record.finalPaymentDateTime).format('YYYY-MM-DD HH:mm') : 'Not Done'}
              </span>
            </div>
          </div>
        </Card>

        <Card size="small" title="Transaction Details" className="transaction-details-card">
          <Table
            columns={itemColumns}
            dataSource={record.transactionDetailsList}
            pagination={false}
            rowKey="id"
            className="expanded-items-table"
          />
        </Card>
      </div>
    );
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const filteredTransactions = dateRange
    ? transactions.filter(transaction => {
        const transactionDate = dayjs(transaction.advancePaymentDateTime);
        return (
          transactionDate.isAfter(dateRange[0].startOf('day')) &&
          transactionDate.isBefore(dateRange[1].endOf('day'))
        );
      })
    : transactions;

  return (
    <div className="transactions-container">
      <h1 ref={headingRef} className="visually-hidden">Transactions</h1>
      <Card className="transactions-card">
        <div className="transactions-header">
          <Title level={2} className="transactions-title">Transaction History</Title>
          <div className="search-controls">
            <RangePicker
              onChange={setDateRange}
              className="date-range-picker"
              size="large"
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={filteredTransactions}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalRecords,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} transactions`,
              onChange: handleTableChange,
            }}
            expandable={{ expandedRowRender }}
            loading={loading}
            className="transactions-table"
          />
        </div>
      </Card>
    </div>
  );
};

export default Transactions; 