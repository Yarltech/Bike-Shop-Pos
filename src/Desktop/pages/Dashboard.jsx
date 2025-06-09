import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import { 
  // Removed Ant Design Icons
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faArrowUp, faArrowDown, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import '../styles/Dashboard.css';
import useHeadingObserver from '../layouts/useHeadingObserver';
import {
  getTransactionTotals,
  getTodayTransactions,
  getTodayOutgoingPayments,
  getOutgoingPaymentTotals,
  getLast30DaysTransactionData
} from '../../API/Dashboard';

const Dashboard = () => {
  const headingRef = useRef(null);
  useHeadingObserver(headingRef);

  // State for chart data
  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);

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

  // Fetch chart data
  const fetchChartData = async () => {
    setLoadingChart(true);
    try {
      const response = await getLast30DaysTransactionData();
      console.log('Chart data received from getLast30DaysTransactionData:', response); // Debug log
      
      if (response && Array.isArray(response)) {
        const formattedData = response.filter(item => item.profit !== null && typeof item.profit !== 'undefined').map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: parseFloat(item.profit) || 0 // Ensure sales is a number, default to 0 if invalid after filtering null/undefined
        }));
        console.log('Formatted chart data for display:', formattedData); // Debug log
        setChartData(formattedData);
      } else {
        console.log('No valid daily sales data received'); // Debug log
        setChartData([]);
      }
    } catch (error) {
      message.error("Failed to fetch chart data.");
      console.error("Error fetching chart data:", error);
      setChartData([]);
    } finally {
      setLoadingChart(false);
    }
  };

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
    fetchChartData();
  }, []);

  const chartConfig = {
    data: chartData,
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
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    tooltip: {
      showMarkers: false,
      customContent: (title, items) => {
        if (!items || items.length === 0 || !items[0] || !items[0].data) {
          return ''; // If no items or data, return empty tooltip
        }

        const salesValue = parseFloat(items[0].data.sales);

        // Only display tooltip if salesValue is a positive number
        if (isNaN(salesValue) || salesValue <= 0) {
          return ''; // Return empty string if not a positive number
        }

        return `
          <div style="padding: 5px; font-size: 14px;">
            <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
            <div style="display: flex; justify-content: space-between;">
              <span>Profit:</span>
              <span style="margin-left: 10px;">$${salesValue.toFixed(2)}</span>
            </div>
          </div>
        `;
      },
    },
    height: 300, // Set a fixed height for the chart
    padding: 'auto',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `$${v}`,
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 ref={headingRef} className="visually-hidden">Dashboard</h1>
      
      {/* Today's Financials */}
      <h2 style={{ margin: '16px 0 8px 0' }}>Today</h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            className="dashboard-card blue"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <div className="card-icon"><FontAwesomeIcon icon={faClipboardList} /></div>
            <div className="card-label">Total Work</div>
            <div className="card-amount">
              {loadingFinancials ? (
                <div className="loading-spinner" />
              ) : (
                <CountUp end={todayFinancials.totalSales} duration={1.2} separator="," />
              )}
            </div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            className="dashboard-card dark"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
          >
            <div className="card-icon"><FontAwesomeIcon icon={faArrowUp} /></div>
            <div className="card-label">Income Amount</div>
            <div className="card-amount">
              {loadingFinancials ? (
                <div className="loading-spinner" />
              ) : (
                <CountUp end={todayFinancials.incomeAmount} duration={1.2} separator="," />
              )}
            </div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            className="dashboard-card blue"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <div className="card-icon"><FontAwesomeIcon icon={faArrowDown} /></div>
            <div className="card-label">Outgoing Amount</div>
            <div className="card-amount">
              {loadingFinancials ? (
                <div className="loading-spinner" />
              ) : (
                <CountUp end={todayFinancials.outgoingAmount} duration={1.2} separator="," />
              )}
            </div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            className="dashboard-card dark"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            <div className="card-icon"><FontAwesomeIcon icon={faDollarSign} /></div>
            <div className="card-label">Profit</div>
            <div className="card-amount">
              {loadingFinancials ? (
                <div className="loading-spinner" />
              ) : (
                <CountUp end={todayFinancials.profit} duration={1.2} separator="," />
              )}
            </div>
          </motion.div>
        </Col>
      </Row>

      {/* Last 30 Days' Financials */}
      <h2 style={{ margin: '24px 0 8px 0' }}>Last 30 Days</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            className="dashboard-card blue"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <div className="card-icon"><FontAwesomeIcon icon={faClipboardList} /></div>
            <div className="card-label">Total Work</div>
            <div className="card-amount"><CountUp end={last30DaysFinancials.totalSales} duration={1.2} separator="," /></div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            className="dashboard-card dark"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
          >
            <div className="card-icon"><FontAwesomeIcon icon={faArrowUp} /></div>
            <div className="card-label">Income Amount</div>
            <div className="card-amount"><CountUp end={last30DaysFinancials.incomeAmount} duration={1.2} separator="," /></div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            className="dashboard-card blue"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <div className="card-icon"><FontAwesomeIcon icon={faArrowDown} /></div>
            <div className="card-label">Outgoing Amount</div>
            <div className="card-amount"><CountUp end={last30DaysFinancials.outgoingAmount} duration={1.2} separator="," /></div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            className={`dashboard-card ${last30DaysFinancials.profit >= 0 ? 'blue' : 'dark'}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            <div className="card-icon"><FontAwesomeIcon icon={faDollarSign} /></div>
            <div className="card-label">Profit</div>
            <div className="card-amount"><CountUp end={last30DaysFinancials.profit} duration={1.2} separator="," /></div>
          </motion.div>
        </Col>
      </Row>

      <div className="sales-overview-card" loading={loadingChart} style={{ marginTop: 24 }}>
        <h2>Profit Overview (Last 30 Days)</h2>
        {chartData.length > 0 ? (
          <Line {...chartConfig} />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            No profit data available for the last 30 days.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 