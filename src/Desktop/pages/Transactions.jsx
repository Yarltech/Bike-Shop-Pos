import React, { useState, useRef } from 'react';
import { Table, Card, DatePicker, Space, Button, Tag } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import '../styles/Transactions.css';
import useHeadingObserver from '../layouts/useHeadingObserver';

const { RangePicker } = DatePicker;

const Transactions = () => {
  const [dateRange, setDateRange] = useState(null);
  const headingRef = useRef(null);
  useHeadingObserver(headingRef);

  // Sample transactions data
  const transactions = [
    {
      id: 1,
      date: '2024-03-15 14:30',
      items: [
        { name: 'Bike Chain', quantity: 1, price: 15.99 },
        { name: 'Brake Pads', quantity: 2, price: 12.99 },
      ],
      total: 41.97,
      paymentMethod: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 2,
      date: '2024-03-15 15:45',
      items: [
        { name: 'Inner Tube', quantity: 1, price: 8.99 },
        { name: 'Tire', quantity: 1, price: 29.99 },
      ],
      total: 38.98,
      paymentMethod: 'Cash',
      status: 'Completed',
    },
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <ul className="transaction-items">
          {items.map((item, index) => (
            <li key={index}>
              {item.quantity}x {item.name} (${item.price.toFixed(2)})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `LKR${total.toFixed(2)}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
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
          >
            Receipt
          </Button>
        </Space>
      ),
    },
  ];

  const filteredTransactions = dateRange
    ? transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate >= dateRange[0].startOf('day').toDate() &&
          transactionDate <= dateRange[1].endOf('day').toDate()
        );
      })
    : transactions;

  return (
    <div className="transactions-container">
      <h1 ref={headingRef} className="visually-hidden">Transactions</h1>
      <Card>
        <div className="transactions-header">
          <div className="search-controls">
            <RangePicker
              onChange={setDateRange}
              className="date-range-picker"
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
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
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Transactions; 