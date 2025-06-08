import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, DatePicker, Space, Button, Tag, Typography, message } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import '../styles/Transactions.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import { getAllTransactionsPaginated } from '../../API/TransactionApi';
import { getAllShopDetails } from '../../API/ShopDetailsApi';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [shopDetails, setShopDetails] = useState(null);

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

  const fetchShopDetails = async () => {
    try {
      const response = await getAllShopDetails();
      if (response && response.responseDto && response.responseDto.length > 0) {
        setShopDetails(response.responseDto[0]);
      } else {
        message.error(response.errorDescription || 'Failed to fetch shop details.');
      }
    } catch (error) {
      message.error('Error fetching shop details');
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage, pageSize);
    fetchShopDetails();
  }, [currentPage, pageSize]);

  const generateReceiptPDF = (transactionNo, customerName, vehicleNumber, services, totalAmount, paymentType, advancePaymentAmount = 0, shopInfo, customerMobile, paymentMethodName) => {
    const doc = new jsPDF();
    
    // Page border
    doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);

    // Company Name, Address, and Bill Receipt Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(shopInfo?.name || 'COMPANY NAME', doc.internal.pageSize.width / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(shopInfo?.shopAddress || 'Address Line 1: Address Line 2:', doc.internal.pageSize.width / 2, 27, { align: 'center' });

    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('BILL RECEIPT', doc.internal.pageSize.width / 2, 45, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 50, doc.internal.pageSize.width - 20, 50);

    // Customer Details
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Customer Name:', 20, 60);
    doc.text(customerName || '', 70, 60);

    doc.text('Vehicle Number:', 20, 68);
    doc.text(vehicleNumber || '', 70, 68);

    doc.text('Mobile Number:', 20, 76);
    doc.text(customerMobile || '', 70, 76);

    doc.setLineWidth(0.5);
    doc.line(20, 80, doc.internal.pageSize.width - 20, 80); // Line below customer details

    // Bill Details (Moved and simplified)
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    doc.text(`Date: ${dayjs().format('YYYY-MM-DD')}`, 20, 90);
    doc.text(`Bill No: ${transactionNo}`, doc.internal.pageSize.width / 2 + 30, 90);
    
    // Services table
    const tableColumn = ['Bill No', 'Services', 'Pay Bill', 'Total']; // Renamed Particulars to Services
    const tableRows = services.map(item => [
      transactionNo, // Using transactionNo as Bill No for each service line
      item.serviceDto.name + (item.description ? `\n(${item.description})` : ''),
      `LKR ${item.amount.toFixed(2)}`, // Pay Bill
      `LKR ${item.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 100, // Adjusted startY for the table
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' }, // Bill No (adjusted width)
        1: { cellWidth: 100 }, // Services (increased width to compensate for Quantity)
        2: { cellWidth: 30, halign: 'right' }, // Pay Bill (adjusted width)
        3: { cellWidth: 30, halign: 'right' }, // Total (adjusted width)
      },
    });
    
    // Payment Details and Total Amount (Moved below table)
    let currentY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Payment Details:', 20, currentY);
    currentY += 7;
    doc.setFont(undefined, 'normal');
    doc.text(`Payment Method: ${paymentMethodName || 'N/A'}`, 20, currentY);
    currentY += 7;
    doc.text(`Payment Type: ${paymentType.toUpperCase()}`, 20, currentY);
    currentY += 7;

    if (paymentType === 'advance') {
      doc.text(`Advance Amount: LKR ${advancePaymentAmount.toFixed(2)}`, 20, currentY);
      currentY += 7;
      doc.text(`Remaining Amount: LKR ${(totalAmount - advancePaymentAmount).toFixed(2)}`, 20, currentY);
      currentY += 7;
    }
    
    // Total Amount at the bottom right, adjusted dynamically
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: LKR ${totalAmount.toFixed(2)}`, doc.internal.pageSize.width - 20, currentY + 10, { align: 'right' });

    // Additional Notes removed
    // Signatures removed

    return doc;
  };

  const handleDownloadReceipt = (record) => {
    if (!shopDetails) {
      message.warning('Shop details not loaded yet. Please try again.');
      return;
    }
    const transactionNo = record.transactionNo;
    const customerName = record.customerDto?.name || 'N/A';
    const vehicleNumber = record.customerDto?.vehicleNumber || 'N/A';
    const customerMobile = record.customerDto?.mobileNumber || 'N/A';
    const services = record.transactionDetailsList || [];
    const totalAmount = record.totalAmount || 0;
    const paymentType = record.status === 'Completed' ? 'final' : 'advance'; // Infer payment type from status
    const advancePaymentAmount = record.advancePaymentAmount || 0;
    const paymentMethodName = record.paymentMethodDto?.name || 'N/A'; // Get payment method name

    const pdfDoc = generateReceiptPDF(
      transactionNo,
      customerName,
      vehicleNumber,
      services,
      totalAmount,
      paymentType,
      advancePaymentAmount,
      shopDetails,
      customerMobile,
      paymentMethodName // Pass paymentMethodName
    );
    pdfDoc.save(`receipt_${transactionNo}.pdf`);
  };

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
            onClick={() => handleDownloadReceipt(record)}
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