import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Typography, Space, message, Input, Modal, Form, Select, InputNumber } from 'antd';
import { DeleteOutlined, PrinterOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import '../styles/POS.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import { getAllServicesPaginated } from '../../API/ServiceApi';
import { getTransactionsByStatus, updateTransaction } from '../../API/TransactionApi';
import { getAllPaymentMethods } from '../../API/PaymentMethodApi';
import { getAllCustomersPaginated, saveCustomer } from '../../API/CustomerApi';
import { saveTransaction, getAllTransactionsPaginated } from '../../API/TransactionApi';
import { getAllShopDetails } from '../../API/ShopDetailsApi';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title } = Typography;

const POS = ({ setIsModalOpen }) => {
  const [cart, setCart] = useState([]);
  const headingRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [searchPending, setSearchPending] = useState('');
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceModalService, setServiceModalService] = useState(null);
  const [serviceModalForm] = Form.useForm();
  const [editCartItem, setEditCartItem] = useState(null);
  const [selectedPendingPayment, setSelectedPendingPayment] = useState(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('advance'); // 'advance' or 'final'
  const [currentModalStep, setCurrentModalStep] = useState(0); // 0: payment details, 1: customer details
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [lastTransactionNumber, setLastTransactionNumber] = useState(null);
  const [paymentForm] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [shopDetails, setShopDetails] = useState(null); // New state for shop details

  const [selectedCustomerInTable, setSelectedCustomerInTable] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomerRadioType, setSelectedCustomerRadioType] = useState('existing');
  const [customerFormKey, setCustomerFormKey] = useState(0); // New state to force form re-render

  useHeadingObserver(headingRef);

  useEffect(() => {
    if (paymentModalOpen) {
      setSelectedCustomerRadioType('existing');
      customerForm.setFieldsValue({ customerType: 'existing' });
      setSelectedCustomerInTable(null);
      setSearchCustomer('');
      setCustomerFormKey(prevKey => prevKey + 1); // Increment key to force form re-render
    }
  }, [paymentModalOpen, customerForm]);

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

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const response = await getAllServicesPaginated(1, 100, true); // Fetch all active services
      if (response && response.payload) {
        setServices(response.payload);
      } else {
        message.error(response.errorDescription || 'Failed to fetch services.');
      }
    } catch (error) {
      message.error('Error fetching services');
    }
    setLoadingServices(false);
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await getAllPaymentMethods();
      if (response && response.responseDto) {
        setPaymentMethods(response.responseDto);
      } else {
        message.error(response.errorDescription || 'Failed to fetch payment methods.');
      }
    } catch (error) {
      message.error('Error fetching payment methods');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomersPaginated(1, 1000); // Fetch all active customers
      if (response && response.payload) {
        setCustomers(response.payload);
      } else {
        message.error(response.errorDescription || 'Failed to fetch customers.');
      }
    } catch (error) {
      message.error('Error fetching customers');
    }
  };

  const fetchLastTransactionNumber = async () => {
    try {
      const response = await getAllTransactionsPaginated(1, 1); // Fetch only the latest transaction
      if (response && response.responseDto && response.responseDto.payload && response.responseDto.payload.length > 0) {
        setLastTransactionNumber(response.responseDto.payload[0].transactionNo);
      } else {
        setLastTransactionNumber('00000000'); // Default if no transactions exist
      }
    } catch (error) {
      console.error('Error fetching last transaction number:', error);
      setLastTransactionNumber('00000000');
    }
  };

  useEffect(() => {
    fetchServices();
    fetchPaymentMethods();
    fetchCustomers();
    fetchLastTransactionNumber();
    fetchShopDetails(); // Fetch shop details on mount
  }, []);

  useEffect(() => {
    setLoadingPending(true);
    getTransactionsByStatus(1, 10, 'Pending').then((response) => {
      if (response && response.responseDto && response.responseDto.payload) {
        setPendingPayments(response.responseDto.payload);
      } else {
        setPendingPayments([]);
      }
      setLoadingPending(false);
    });
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleServiceClick = (service) => {
    setServiceModalService(service);
    setServiceModalOpen(true);
    serviceModalForm.resetFields();
  };

  const handleEditCartItem = (item) => {
    setEditCartItem(item);
    setServiceModalService(item);
    setServiceModalOpen(true);
    serviceModalForm.setFieldsValue({
      description: item.description,
      amount: item.price,
    });
  };

  const handleServiceModalOk = () => {
    serviceModalForm.validateFields().then(values => {
      const { description, amount } = values;
      if (editCartItem) {
        setCart(cart.map(item =>
          item.id === editCartItem.id
            ? { ...item, description, price: parseFloat(amount) }
            : item
        ));
        setEditCartItem(null);
      } else {
        const product = {
          ...serviceModalService,
          description,
          price: parseFloat(amount),
        };
        addToCart(product);
      }
      setServiceModalOpen(false);
      setServiceModalService(null);
      serviceModalForm.resetFields();
    });
  };

  const handleServiceModalCancel = () => {
    setServiceModalOpen(false);
    setServiceModalService(null);
    setEditCartItem(null);
    serviceModalForm.resetFields();
  };

  const cartColumns = [
    {
      title: 'Icon',
      key: 'icon',
      width: '12%',
      render: (_, record) => <span style={{ fontSize: 22 }}>{record.icon}</span>,
    },
    {
      title: 'Service',
      dataIndex: 'name',
      key: 'name',
      width: '54%',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          {record.description && <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{record.description}</div>}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'price',
      key: 'price',
      width: '20%',
      render: (price) => <span style={{ fontWeight: 600 }}>LKR{price}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      width: '14%',
      render: (_, record) => (
        <span style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditCartItem(record)}
            className="edit-btn"
            style={{ color: '#1677ff' }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeFromCart(record.id)}
            className="delete-btn"
          />
        </span>
      ),
    },
  ];

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalAmount(total);
    };
    calculateTotalAmount();
  }, [cart]);

  const handleRefresh = () => {
    setCart([]);
    message.success('Table refreshed!');
  };

  // Filtered pending payments
  const filteredPendingPayments = pendingPayments.filter(txn => {
    const search = searchPending.trim().toLowerCase();
    if (!search) return true;
    return (
      (txn.customerDto?.name?.toLowerCase().includes(search)) ||
      (txn.customerDto?.vehicleNumber?.toLowerCase().includes(search)) ||
      (txn.transactionNo?.toLowerCase().includes(search))
    );
  });

  // Filtered customers for the table
  const filteredCustomers = customers.filter(customer => {
    const search = searchCustomer.trim().toLowerCase();
    if (!search) return true;
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.vehicleNumber?.toLowerCase().includes(search) ||
      customer.mobileNumber?.toLowerCase().includes(search)
    );
  });

  // Columns for the customer table
  const customerColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Vehicle Number',
      dataIndex: 'vehicleNumber',
      key: 'vehicleNumber',
      sorter: (a, b) => (a.vehicleNumber || '').localeCompare(b.vehicleNumber || ''),
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      sorter: (a, b) => (a.mobileNumber || '').localeCompare(b.mobileNumber || ''),
    },
  ];

  const handlePendingPaymentClick = (txn) => {
    setSelectedPendingPayment(txn);
    if (txn.transactionDetailsList) {
      setCart(txn.transactionDetailsList.map(detail => ({
        id: detail.serviceDto.id,
        name: detail.serviceDto.name,
        icon: detail.serviceDto.icon,
        description: detail.description,
        price: detail.amount,
      })));
    } else {
      setCart([]);
    }
  };

  const handleBackToCart = () => {
    setSelectedPendingPayment(null);
    setCart([]);
  };

  const handleFinalPayment = async () => {
    if (!selectedPendingPayment) return;
    const now = dayjs().format('YYYY-MM-DDTHH:mm:ss');

    const newTotalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    const advancePaymentMade = selectedPendingPayment.advancePaymentAmount || 0;
    const finalPaymentAmountToPay = newTotalAmount - advancePaymentMade;

    const originalDetails = selectedPendingPayment.transactionDetailsList || [];

    const cartDetails = cart.map(item => {
      const orig = originalDetails.find(d => d.serviceDto?.id === item.id);
      return {
        id: orig ? orig.id : undefined,
        serviceDto: { id: item.id, name: item.name, icon: item.icon, isActive: true },
        amount: item.price,
        description: item.description,
        isActive: 1,
      };
    });

    const removedDetails = originalDetails
      .filter(orig => !cart.some(item => item.id === orig.serviceDto?.id))
      .map(orig => ({ ...orig, isActive: 0 }));

    const transactionDetailsList = [...cartDetails, ...removedDetails];

    const updatedTransaction = {
      ...selectedPendingPayment,
      totalAmount: newTotalAmount,
      finalPaymentAmount: finalPaymentAmountToPay,
      finalPaymentDateTime: now,
      status: 'Completed',
      transactionDetailsList,
    };

    const res = await updateTransaction(updatedTransaction);
    if (res && res.status !== false) {
      message.success('Final payment completed and transaction updated!');
      
      // Send receipt via WhatsApp
      openWhatsAppWithReceipt(
        selectedPendingPayment.customerDto.mobileNumber,
        selectedPendingPayment.transactionNo,
        newTotalAmount,
        selectedPendingPayment.customerDto.name,
        selectedPendingPayment.customerDto.vehicleNumber,
        cart,
        'final',
        advancePaymentMade,
        shopDetails
      );
      
      setSelectedPendingPayment(null);
      setCart([]);
      setLoadingPending(true);
      getTransactionsByStatus(1, 10, 'Pending').then((response) => {
        if (response && response.responseDto && response.responseDto.payload) {
          setPendingPayments(response.responseDto.payload);
        } else {
          setPendingPayments([]);
        }
        setLoadingPending(false);
      });
    } else {
      message.error(res?.errorDescription || 'Failed to update transaction');
    }
  };

  const generateNextTransactionNo = () => {
    if (!lastTransactionNumber) return '00000001';
    const num = parseInt(lastTransactionNumber, 10);
    const nextNum = num + 1;
    return String(nextNum).padStart(8, '0');
  };

  const handleAdvancePaymentClick = () => {
    if (cart.length === 0) {
      message.warning('Please add items to the cart first.');
      return;
    }
    setPaymentType('advance');
    setPaymentModalOpen(true);
    setCurrentModalStep(0);
    paymentForm.resetFields();
  };

  const formatReceiptMessage = (transactionNo, customerName, vehicleNumber, services, totalAmount, paymentType, advanceAmount = 0) => {
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
    
    let message = `Zedx Automotive\n\n`;
    message += `Receipt No: ${transactionNo}\n`;
    message += `Date: ${date}\n`;
    message += `Customer: ${customerName}\n`;
    message += `Vehicle: ${vehicleNumber}\n\n`;
    
    message += `Services:\n`;
    services.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      if (item.description) {
        message += `     ${item.description}\n`;
      }
      message += `     LKR ${item.price}\n\n`;
    });
    
    message += `Payment Details:\n`;
    message += `  Payment Type: ${paymentType.toUpperCase()}\n`;
    if (paymentType === 'advance') {
      message += `  Advance Amount: LKR ${advanceAmount}\n`;
      message += `  Remaining Amount: LKR ${totalAmount - advanceAmount}\n`;
    }
    message += `  Total Amount: LKR ${totalAmount}\n\n`;
    
    message += `Thank you for your business!  \n`;
    message += `We appreciate your trust in our services.`;
    
    return message;
  };

  const generateReceiptPDF = (transactionNo, customerName, vehicleNumber, services, totalAmount, paymentType, advanceAmount = 0, shopInfo, customerMobile) => {
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
      item.name + (item.description ? `\n(${item.description})` : ''),
      `LKR ${item.price.toFixed(2)}`, // Pay Bill
      `LKR ${item.price.toFixed(2)}`
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
    doc.text(`Payment Type: ${paymentType.toUpperCase()}`, 20, currentY);
    currentY += 7;

    if (paymentType === 'advance') {
      doc.text(`Advance Amount: LKR ${advanceAmount.toFixed(2)}`, 20, currentY);
      currentY += 7;
      doc.text(`Remaining Amount: LKR ${(totalAmount - advanceAmount).toFixed(2)}`, 20, currentY);
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

  const openWhatsAppWithReceipt = (customerMobile, transactionNo, totalAmount, customerName, vehicleNumber, services, paymentType, advanceAmount = 0, shopDetails) => {
    // Generate PDF
    const pdfDoc = generateReceiptPDF(
      transactionNo,
      customerName,
      vehicleNumber,
      services,
      totalAmount,
      paymentType,
      advanceAmount,
      shopDetails,
      customerMobile
    );
    
    // Save PDF temporarily
    const pdfBlob = pdfDoc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Format the mobile number
    const formattedMobile = customerMobile.replace(/[^0-9]/g, '');
    const whatsappNumber = formattedMobile.startsWith('0') 
      ? `94${formattedMobile.substring(1)}` 
      : `94${formattedMobile}`;
    
    // Create the formatted receipt message
    const message = formatReceiptMessage(
      transactionNo,
      customerName,
      vehicleNumber,
      services,
      totalAmount,
      paymentType,
      advanceAmount
    );
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp Web URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Create a temporary link to download the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `receipt_${transactionNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(pdfUrl);
  };

  const handleInitialFinalPaymentClick = () => {
    if (cart.length === 0) {
      message.warning('Please add items to the cart first.');
      return;
    }
    setPaymentType('final');
    setPaymentModalOpen(true);
    setCurrentModalStep(0);
    paymentForm.resetFields();
  };

  return (
    <div className="pos-container">
      <h1 ref={headingRef} className="visually-hidden">POS</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <>
            <Card className="products-section">
              <Title level={4} style={{ marginBottom: 16 }}>Services</Title>
                <Row gutter={[8, 8]} loading={loadingServices} style={{ maxHeight: 220, overflowY: 'auto' }}>
              {services.map(service => (
                <Col xs={12} sm={8} md={6} key={service.id}>
                  <Card
                    hoverable
                        onClick={() => handleServiceClick(service)}
                    className="product-card"
                  >
                    <div className="product-icon">{service.icon}</div>
                    <Title level={5} className="product-title">{service.name}</Title>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
              <Card className="products-section" style={{ marginTop: 36, minHeight: 310, maxHeight: 310, overflowY: 'auto' }}>
                <Title level={4} style={{ marginBottom: 16 }}>Pending Payments</Title>
                <Input.Search
                  placeholder="Search by customer, vehicle, or transaction no."
                  allowClear
                  value={searchPending}
                  onChange={e => setSearchPending(e.target.value)}
                  style={{ marginBottom: 16, width: '100%', borderRadius: 8 }}
                  size="middle"
                />
                {loadingPending ? <div>Loading...</div> : (
                  <div style={{ 
                    background: '#fff', 
                    borderRadius: 8, 
                    padding: '0 8px',
                    boxShadow: '0 2px 8px #e6f7ff',
                    border: '1px solid #1677ff',
                    maxHeight: 180,
                    overflowY: 'auto'
                  }}>
                    <Table
                      columns={[
                        {
                          title: 'Txn No',
                          dataIndex: 'transactionNo',
                          key: 'transactionNo',
                          width: '30%',
                          render: (text) => <span style={{ fontWeight: 600, color: '#0958d9' }}>{text}</span>
                        },
                        {
                          title: 'Customer',
                          dataIndex: ['customerDto', 'name'],
                          key: 'customerName',
                          width: '40%',
                          render: (_, record) => (
                            <span style={{ fontWeight: 500, color: '#0958d9' }}>
                              {record.customerDto?.name} ({record.customerDto?.vehicleNumber})
                            </span>
                          )
                        },
                        {
                          title: 'Advance',
                          dataIndex: 'advancePaymentAmount',
                          key: 'advanceAmount',
                          width: '30%',
                          render: (text) => <span style={{ fontWeight: 600, color: '#0958d9' }}>LKR{text}</span>
                        },
                      ].map(col => ({
                        ...col,
                        title: <span style={{ color: '#1677ff', fontWeight: 700, fontSize: 14 }}>{col.title}</span>,
                        onHeaderCell: () => ({ style: { background: '#e6f7ff', border: 'none' } }),
                        onCell: () => ({ style: { background: '#fff', border: 'none' } }),
                      }))}
                      dataSource={filteredPendingPayments}
                      rowKey="id"
                      pagination={false}
                      size="small"
                      scroll={{ y: 170 }}
                      locale={{
                        emptyText: <div style={{ color: '#1677ff', fontWeight: 600, fontSize: 16, textAlign: 'center', padding: 16 }}>No pending payments</div>
                      }}
                      onRow={(record) => ({
                        onClick: () => {
                          handlePendingPaymentClick(record);
                          message.success(`Selected transaction: ${record.transactionNo}`);
                        },
                        style: { cursor: 'pointer' },
                        onMouseEnter: (event) => {
                          event.currentTarget.style.backgroundColor = '#e6f7ff'; // Light blue on hover
                        },
                        onMouseLeave: (event) => {
                          event.currentTarget.style.backgroundColor = '#fff'; // White on leave
                        },
                      })}
                    />
                  </div>
                )}
              </Card>
            </>
          </Col>
          <Col xs={24} lg={10}>
            <Card className="cart-section" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Current Order</Title>
                <Space>
                    <Button type="default" icon={<ReloadOutlined />} onClick={handleRefresh}
                    style={{
                      background: '#1677ff',
                      border: '1.5px solid #1677ff',
                      color: '#fff',
                      boxShadow: '0 1px 4px #e6f7ff',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 16,
                      height: 32,
                      width: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#0958d9'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#1677ff'; }}
                  />
                </Space>
              </div>
                <div className="cart-table-container" style={{ flex: 1, minHeight: 340, maxHeight: 340, background: '#f5faff', borderRadius: 12, boxShadow: '0 2px 8px #e6f7ff', padding: 0, marginBottom: 8, overflowY: 'auto' }}>
                <Table
                  dataSource={cart}
                    columns={cartColumns.map(col => ({
                      ...col,
                      title: <span style={{ color: '#1677ff', fontWeight: 700, fontSize: 16 }}>{col.title}</span>,
                      onHeaderCell: () => ({ style: { background: '#e6f7ff', border: 'none', fontSize: 16 } }),
                      onCell: () => ({ style: { fontSize: 15, background: '#f5faff', border: 'none' } }),
                    }))}
                  pagination={false}
                  rowKey="id"
                  scroll={{ x: 'max-content' }}
                    size="middle"
                    locale={{
                      emptyText: <div style={{ color: '#1677ff', fontWeight: 600, fontSize: 18, textAlign: 'center', padding: 32 }}>No items in cart</div>
                    }}
                    style={{ background: 'transparent', border: 'none' }}
                    bordered={false}
                  />
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                {selectedPendingPayment ? (
                  <>
                    <Button
                      type="primary"
                      block
                      icon={<PrinterOutlined />}
                      className="final-payment-button"
                      size="large"
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                      onClick={handleFinalPayment}
                    >
                      Final Payment
                    </Button>
                    <Button
                      block
                      style={{ marginTop: 8 }}
                      onClick={handleBackToCart}
                    >
                      Back
                    </Button>
                  </>
                ) : (
                  <>
              <div className="order-summary" style={{ textAlign: 'right', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Total: LKR{totalAmount.toFixed(2)}</Title>
              </div>
              <Button
                type="primary"
                block
                icon={<PrinterOutlined />}
                className="advance-payment-button"
                size="large"
                onClick={handleAdvancePaymentClick}
              >
                Advance Payment
              </Button>
              <Button
                type="primary"
                block
                icon={<PrinterOutlined />}
                className="final-payment-button"
                size="large"
                style={{ marginTop: 8, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={handleInitialFinalPaymentClick}
              >
                Final Payment
              </Button>
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>
        {/* Service Modal */}
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
              {serviceModalService ? `Add ${serviceModalService.name}` : ''}
            </div>
          }
          open={serviceModalOpen}
          onOk={handleServiceModalOk}
          onCancel={handleServiceModalCancel}
          okText="Add to Cart"
          cancelText="Cancel"
          destroyOnClose
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
        >
          <Form form={serviceModalForm} layout="vertical">
            <Form.Item
              name="description"
              label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Description</span>}
              rules={[{ required: false, message: 'Please enter a description' }]}
            >
              <Input.TextArea 
                placeholder="Enter description" 
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{
                  borderRadius: 6,
                  borderColor: '#1677ff',
                  boxShadow: '0 2px 8px #e6f7ff'
                }}
              />
            </Form.Item>
            <Form.Item
              name="amount"
              label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Amount (LKR)</span>}
              rules={[{ required: true, message: 'Please enter an amount' }, { type: 'number', min: 0, message: 'Enter a valid amount' }]}
            >
              <InputNumber 
                min={0} 
                placeholder="Enter amount" 
                style={{ 
                  width: '100%',
                  borderRadius: 6,
                  borderColor: '#1677ff',
                  boxShadow: '0 2px 8px #e6f7ff'
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
        {/* Payment / Customer Modal */}
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
              {paymentType === 'advance' ? 'Advance Payment Details' : 'Final Payment Details'}
            </div>
          }
          open={paymentModalOpen}
          onCancel={() => { setPaymentModalOpen(false); setSelectedCustomerRadioType('existing'); }}
          footer={null}
          destroyOnClose
          width={600}
          styles={{
            body: {
              padding: '24px 32px',
              background: '#f5faff',
              borderRadius: 8
            }
          }}
        >
          {currentModalStep === 0 && (
            <Form 
              form={paymentForm} 
              layout="vertical" 
              onFinish={() => {
                setCurrentModalStep(1);
                setSelectedCustomerRadioType('existing');
                customerForm.setFieldsValue({ customerType: 'existing' });
                setSelectedCustomerInTable(null);
                setSearchCustomer('');
              }}
            >
              <Form.Item
                name="paymentMethod"
                label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Payment Method</span>}
                rules={[{ required: true, message: 'Please select a payment method' }]}
              >
                <Select 
                  placeholder="Select Payment Method"
                  style={{
                    borderRadius: 6,
                    borderColor: '#1677ff',
                    boxShadow: '0 2px 8px #e6f7ff'
                  }}
                >
                  {paymentMethods.map(method => (
                    <Select.Option key={method.id} value={method.id}>{method.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {paymentType === 'advance' && (
                <Form.Item
                  name="advanceAmount"
                  label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Advance Payment Amount</span>}
                  rules={[{ required: true, message: 'Please enter advance amount' }, { type: 'number', min: 0, message: 'Amount must be positive' }]}
                >
                  <InputNumber 
                    min={0} 
                    placeholder="Enter advance amount" 
                    style={{ 
                      width: '100%',
                      borderRadius: 6,
                      borderColor: '#1677ff',
                      boxShadow: '0 2px 8px #e6f7ff'
                    }}
                  />
                </Form.Item>
              )}
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{
                    background: '#1677ff',
                    borderColor: '#1677ff',
                    height: 40,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 6,
                    boxShadow: '0 2px 8px #e6f7ff',
                    width: '100%'
                  }}
                >
                  Next
                </Button>
              </Form.Item>
            </Form>
          )}
          {currentModalStep === 1 && (
            <Form
              key={customerFormKey}
              form={customerForm}
              layout="vertical"
              initialValues={{ customerType: 'existing' }}
              onFinish={async (values) => {
                let customerId = values.customer;
                if (selectedCustomerRadioType === 'new') {
                  const newCustomerData = {
                    name: values.newCustomerName,
                    vehicleNumber: values.newCustomerVehicle,
                    mobileNumber: values.newCustomerMobile,
                    isActive: true,
                  };
                  const res = await saveCustomer(newCustomerData);
                  if (res && res.responseDto) {
                    customerId = res.responseDto.id;
                  } else {
                    message.error(res?.errorDescription || 'Failed to save new customer');
                    return;
                  }
                }
                const transactionNo = generateNextTransactionNo();
                const total = cart.reduce((sum, item) => sum + item.price, 0);
                const paymentMethodId = paymentForm.getFieldValue('paymentMethod');
                const advanceAmount = paymentForm.getFieldValue('advanceAmount');

                const transactionData = {
                  transactionNo,
                  totalAmount: total,
                  paymentMethodDto: { id: paymentMethodId },
                  customerDto: { id: customerId },
                  transactionDetailsList: cart.map(item => ({
                    serviceDto: { id: item.id },
                    amount: item.price,
                    description: item.description,
                    isActive: true,
                  })),
                };

                if (paymentType === 'advance') {
                  transactionData.advancePaymentAmount = advanceAmount;
                  transactionData.advancePaymentDateTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');
                  transactionData.status = 'Pending';
                } else if (paymentType === 'final') {
                  transactionData.finalPaymentAmount = total;
                  transactionData.finalPaymentDateTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');
                  transactionData.status = 'Completed';
                }
                const res = await saveTransaction(transactionData);
                if (res && res.status !== false) {
                  message.success(`Transaction ${transactionNo} saved successfully!`);
                  
                  // Get customer details
                  const customerMobile = selectedCustomerRadioType === 'existing' 
                    ? selectedCustomerInTable.mobileNumber 
                    : values.newCustomerMobile;
                  const customerName = selectedCustomerRadioType === 'existing'
                    ? selectedCustomerInTable.name
                    : values.newCustomerName;
                  const vehicleNumber = selectedCustomerRadioType === 'existing'
                    ? selectedCustomerInTable.vehicleNumber
                    : values.newCustomerVehicle;
                    
                  // Open WhatsApp with receipt
                  openWhatsAppWithReceipt(
                    customerMobile,
                    transactionNo,
                    total,
                    customerName,
                    vehicleNumber,
                    cart,
                    paymentType,
                    advanceAmount,
                    shopDetails
                  );
                  
                  setCart([]);
                  setPaymentModalOpen(false);
                  setSelectedPendingPayment(null);
                  fetchLastTransactionNumber();
                  setLoadingPending(true);
                  getTransactionsByStatus(1, 10, 'Pending').then((response) => {
                    if (response && response.responseDto && response.responseDto.payload) {
                      setPendingPayments(response.responseDto.payload);
                    } else {
                      setPendingPayments([]);
                    }
                    setLoadingPending(false);
                  });
                } else {
                  message.error(res?.errorDescription || 'Failed to save transaction');
                }
              }}
            >
              <div style={{ 
                marginBottom: 24, 
                display: 'flex', 
                gap: 12,
                padding: '12px 16px',
                background: '#e6f7ff',
                borderRadius: 8,
                border: '1px solid #1677ff'
              }}>
                <Button
                  type={selectedCustomerRadioType === 'existing' ? 'primary' : 'default'}
                  onClick={() => setSelectedCustomerRadioType('existing')}
                  style={selectedCustomerRadioType === 'existing' ? { 
                    backgroundColor: '#1677ff', 
                    borderColor: '#1677ff', 
                    color: '#fff',
                    height: 40,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 6,
                    boxShadow: '0 2px 8px #e6f7ff'
                  } : { 
                    color: '#1677ff', 
                    borderColor: '#1677ff',
                    height: 40,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 6
                  }}
                >
                  Existing Customer
                </Button>
                <Button
                  type={selectedCustomerRadioType === 'new' ? 'primary' : 'default'}
                  onClick={() => setSelectedCustomerRadioType('new')}
                  style={selectedCustomerRadioType === 'new' ? { 
                    backgroundColor: '#1677ff', 
                    borderColor: '#1677ff', 
                    color: '#fff',
                    height: 40,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 6,
                    boxShadow: '0 2px 8px #e6f7ff'
                  } : { 
                    color: '#1677ff', 
                    borderColor: '#1677ff',
                    height: 40,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 6
                  }}
                >
                  New Customer
                </Button>
              </div>
              {selectedCustomerRadioType === 'existing' ? (
                <>
                  <Form.Item label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Select Existing Customer</span>}>
                    <Input.Search
                      placeholder="Search by name, vehicle or mobile number"
                      allowClear
                      value={searchCustomer}
                      onChange={e => setSearchCustomer(e.target.value)}
                      style={{ 
                        marginBottom: 16,
                        borderRadius: 6,
                        borderColor: '#1677ff',
                        boxShadow: '0 2px 8px #e6f7ff'
                      }}
                    />
                    <div style={{ 
                      background: '#fff', 
                      borderRadius: 8, 
                      padding: 16,
                      boxShadow: '0 2px 8px #e6f7ff',
                      border: '1px solid #1677ff'
                    }}>
                      <Table
                        columns={customerColumns}
                        dataSource={filteredCustomers}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        size="small"
                        scroll={{ y: 240 }}
                        onRow={(record) => ({
                          onClick: () => {
                            setSelectedCustomerInTable(record);
                            customerForm.setFieldsValue({ customer: record.id });
                            message.success(`Selected customer: ${record.name}`);
                          },
                        })}
                        rowSelection={{
                          type: 'radio',
                          selectedRowKeys: selectedCustomerInTable ? [selectedCustomerInTable.id] : [],
                          onChange: (selectedKeys, selectedRows) => {
                            setSelectedCustomerInTable(selectedRows[0]);
                            customerForm.setFieldsValue({ customer: selectedRows[0]?.id });
                          },
                        }}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="customer"
                    noStyle
                    rules={[{ required: true, message: 'Please select a customer' }]}
                  >
                    <Input type="hidden" />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    name="newCustomerName"
                    label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Customer Name</span>}
                    rules={[{ required: true, message: 'Please enter customer name' }]}
                  >
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
                    name="newCustomerVehicle"
                    label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Vehicle Number</span>}
                    rules={[{ required: true, message: 'Please enter vehicle number' }]}
                  >
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
                    name="newCustomerMobile"
                    label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>Mobile Number</span>}
                    rules={[{ required: true, message: 'Please enter mobile number' }, { pattern: /^\d{10}$/, message: 'Enter a valid 10-digit mobile number' }]}
                  >
                    <Input 
                      placeholder="Enter mobile number"
                      style={{
                        borderRadius: 6,
                        borderColor: '#1677ff',
                        boxShadow: '0 2px 8px #e6f7ff'
                      }}
                    />
                  </Form.Item>
                </>
              )}
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button 
                    onClick={() => setCurrentModalStep(0)}
                    style={{
                      height: 40,
                      fontSize: 16,
                      fontWeight: 500,
                      borderRadius: 6,
                      borderColor: '#1677ff',
                      color: '#1677ff',
                      width: 120
                    }}
                  >
                    Back
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    style={{
                      background: '#1677ff',
                      borderColor: '#1677ff',
                      height: 40,
                      fontSize: 16,
                      fontWeight: 500,
                      borderRadius: 6,
                      boxShadow: '0 2px 8px #e6f7ff',
                      width: 120
                    }}
                  >
                    Finish
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    );
  };

export default POS; 