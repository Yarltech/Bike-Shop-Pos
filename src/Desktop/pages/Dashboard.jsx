import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Statistic, Card, message } from 'antd';
import { 
  DollarOutlined, 
  // ToolOutlined, 
  // ClockCircleOutlined, 
  // CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import '../styles/Dashboard.css';
import useHeadingObserver from '../layouts/useHeadingObserver';

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

  // Placeholder API calls
  const fetchTodayFinancials = async () => {
    setLoadingFinancials(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setTodayFinancials({
        totalSales: 9,
        incomeAmount: 12000,
        outgoingAmount: 3000,
        profit: 9000,
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setLast30DaysFinancials({
        totalSales: 68,
        incomeAmount: 380000,
        outgoingAmount: 70000,
        profit: 310000,
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
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Today's Total Work"
              value={todayFinancials.totalSales}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#0057b3' }} // A shade of blue
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Today's Income Amount"
              value={todayFinancials.incomeAmount}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }} // Green
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Today's Outgoing Amount"
              value={todayFinancials.outgoingAmount}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }} // Red
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Today's Profit"
              value={todayFinancials.profit}
              prefix={<DollarOutlined />}
              valueStyle={{ color: todayFinancials.profit >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Last 30 Days' Financials */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Last 30 Days' Total Sales"
              value={last30DaysFinancials.totalSales}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#0057b3' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Last 30 Days' Income Amount"
              value={last30DaysFinancials.incomeAmount}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Last 30 Days' Outgoing Amount"
              value={last30DaysFinancials.outgoingAmount}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingFinancials}>
            <Statistic
              title="Last 30 Days' Profit"
              value={last30DaysFinancials.profit}
              prefix={<DollarOutlined />}
              valueStyle={{ color: last30DaysFinancials.profit >= 0 ? '#3f8600' : '#cf1322' }}
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