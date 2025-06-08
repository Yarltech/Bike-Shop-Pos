import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Statistic, Card, message } from 'antd';
import { 
  DollarOutlined, 
  ArrowUpOutlined,
  ArrowDownOutlined,
  FieldNumberOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import CountUp from 'react-countup';
import '../styles/Dashboard.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import {
  getTransactionTotals,
  getTodayTransactions,
  getTodayOutgoingPayments,
  getOutgoingPaymentTotals
} from '../../API/Dashboard';

const Dashboard = () => {
  const headingRef = useRef(null);
  useHeadingObserver(headingRef);

  // Sample data for the line chart
  const data = [
    { date: '2024-01', sales: 3500 },
    { date: '2024-02', sales: 4200 },
    { date: '2024-03', sales: 3800 },
    { date: '2024-04', sales: 4500 },
    { date: '2024-05', sales: 5000 },
  ];

  const config = {
    data,
    xField: 'date',
    yField: 'sales',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  // State for financial data
  const [todayFinancials, setTodayFinancials] = useState({
    totalSales: 0,
    incomeAmount: 0,
    outgoingAmount: 0,
    profit: 0,
  });

  const [last30DaysFinancials, setLast30DaysFinancials] = useState({
    totalSales: 0,
    incomeAmount: 0,
    outgoingAmount: 0,
    profit: 0,
  });

  const [loadingFinancials, setLoadingFinancials] = useState(false);

  // Real API calls for dashboard data
  const fetchTodayFinancials = async () => {
    setLoadingFinancials(true);
    try {
      const [todayTransactions, todayOutgoingPayments] = await Promise.all([
        getTodayTransactions(),
        getTodayOutgoingPayments()
      ]);

      setTodayFinancials({
        totalSales: todayTransactions?.totalCount || 0,
        incomeAmount: todayTransactions?.totalAmount || 0,
        outgoingAmount: todayOutgoingPayments?.totalAmount || 0,
        profit: (todayTransactions?.totalAmount || 0) - (todayOutgoingPayments?.totalAmount || 0),
      });
    } catch (error) {
      message.error("Failed to fetch today's financial data.");
      console.error("Error fetching today's financials:", error);
    } finally {
      setLoadingFinancials(false);
    }
  };

  const fetchLast30DaysFinancials = async () => {
    setLoadingFinancials(true);
    try {
      const [transactionTotals, outgoingPaymentTotals] = await Promise.all([
        getTransactionTotals(),
        getOutgoingPaymentTotals()
      ]);

      setLast30DaysFinancials({
        totalSales: transactionTotals?.totalCount || 0,
        incomeAmount: transactionTotals?.totalAmount || 0,
        outgoingAmount: outgoingPaymentTotals?.totalAmount || 0,
        profit: (transactionTotals?.totalAmount || 0) - (outgoingPaymentTotals?.totalAmount || 0),
      });
    } catch (error) {
      message.error("Failed to fetch last 30 days' financial data.");
      console.error("Error fetching last 30 days' financials:", error);
    } finally {
      setLoadingFinancials(false);
    }
  };

  useEffect(() => {
    fetchTodayFinancials();
    fetchLast30DaysFinancials();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 ref={headingRef} className="visually-hidden">Dashboard</h1>
      
      {/* Today's Financials */}
      <h2 style={{ margin: '16px 0 8px 0' }}>Today</h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Total Work"
              value={todayFinancials.totalSales}
              prefix={<FieldNumberOutlined />}
              valueStyle={{ color: '#333' }}
              valueRender={() => (
                <CountUp end={todayFinancials.totalSales} duration={1.2} separator="," />
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Income Amount"
              value={todayFinancials.incomeAmount}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
              valueRender={() => (
                <CountUp end={todayFinancials.incomeAmount} duration={1.2} separator="," />
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Outgoing Amount"
              value={todayFinancials.outgoingAmount}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }}
              valueRender={() => (
                <CountUp end={todayFinancials.outgoingAmount} duration={1.2} separator="," />
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Profit"
              value={todayFinancials.profit}
              prefix={<DollarOutlined />}
              valueStyle={{ color: todayFinancials.profit >= 0 ? '#3f8600' : '#cf1322' }}
              valueRender={() => (
                <CountUp end={todayFinancials.profit} duration={1.2} separator="," />
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Last 30 Days' Financials */}
      <h2 style={{ margin: '24px 0 8px 0' }}>Last 30 Days</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Total Work"
              value={last30DaysFinancials.totalSales}
              prefix={<FieldNumberOutlined />}
              valueStyle={{ color: '#333' }}
              valueRender={() => (
                <CountUp end={last30DaysFinancials.totalSales} duration={1.2} separator="," />
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Income Amount"
              value={last30DaysFinancials.incomeAmount}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
              valueRender={() => (
                <CountUp end={last30DaysFinancials.incomeAmount} duration={1.2} separator="," />
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Outgoing Amount"
              value={last30DaysFinancials.outgoingAmount}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }}
              valueRender={() => (
                <CountUp end={last30DaysFinancials.outgoingAmount} duration={1.2} separator="," />
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Profit"
              value={last30DaysFinancials.profit}
              prefix={<DollarOutlined />}
              valueStyle={{ color: last30DaysFinancials.profit >= 0 ? '#3f8600' : '#cf1322' }}
              valueRender={() => (
                <CountUp end={last30DaysFinancials.profit} duration={1.2} separator="," />
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card className="sales-overview-card">
        <h2>Sales Overview</h2>
        <Line {...config} />
      </Card>
    </div>
  );
};

export default Dashboard; 