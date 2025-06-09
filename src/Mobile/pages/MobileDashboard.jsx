import React, { useState, useEffect } from 'react';
import '../styles/MobileDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faArrowUp, faArrowDown, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  getTodayTransactions,
  getTodayOutgoingPayments,
  getLast30DaysTransactionData,
  getTransactionTotals,
  getOutgoingPaymentTotals
} from '../../API/Dashboard';
import { Line } from '@ant-design/plots';
import { message } from 'antd';

const MobileDashboard = () => {
  const [cardData, setCardData] = useState([
    {
      label: 'Total Work',
      amount: 0,
      icon: faClipboardList,
      type: 'blue',
    },
    {
      label: 'Income Amount',
      amount: 0,
      icon: faArrowUp,
      type: 'dark',
    },
    {
      label: 'Outgoing Amount',
      amount: 0,
      icon: faArrowDown,
      type: 'blue',
    },
    {
      label: 'Profit',
      amount: 0,
      icon: faDollarSign,
      type: 'dark',
    },
  ]);

  const [last30DaysFinancials, setLast30DaysFinancials] = useState({
    totalSales: 0,
    incomeAmount: 0,
    outgoingAmount: 0,
    profit: 0,
  });

  const [loadingFinancials, setLoadingFinancials] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);

  const fetchChartData = async () => {
    setLoadingChart(true);
    try {
      const response = await getLast30DaysTransactionData();
      console.log('Mobile Chart data received:', response);
      
      if (response && Array.isArray(response)) {
        const formattedData = response.filter(item => item.profit !== null && typeof item.profit !== 'undefined').map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: parseFloat(item.profit) || 0
        }));
        console.log('Formatted mobile chart data:', formattedData);
        setChartData(formattedData);
      } else {
        console.log('No valid daily sales data received for mobile chart');
        setChartData([]);
      }
    } catch (error) {
      message.error("Failed to fetch mobile chart data.");
      console.error("Error fetching mobile chart data:", error);
      setChartData([]);
    } finally {
      setLoadingChart(false);
    }
  };

  const fetchTodayFinancials = async () => {
    setLoadingFinancials(true);
    try {
      const [todayTransactions, todayOutgoingPayments] = await Promise.all([
        getTodayTransactions(),
        getTodayOutgoingPayments()
      ]);

      const incomeAmount = todayTransactions?.totalAmount || 0;
      const outgoingAmount = todayOutgoingPayments?.totalAmount || 0;
      const profit = incomeAmount - outgoingAmount;

      setCardData([
        {
          label: 'Total Work',
          amount: todayTransactions?.totalCount || 0,
          icon: faClipboardList,
          type: 'blue',
        },
        {
          label: 'Income Amount',
          amount: incomeAmount,
          icon: faArrowUp,
          type: 'dark',
        },
        {
          label: 'Outgoing Amount',
          amount: outgoingAmount,
          icon: faArrowDown,
          type: 'blue',
        },
        {
          label: 'Profit',
          amount: profit,
          icon: faDollarSign,
          type: profit >= 0 ? 'blue' : 'dark',
        },
      ]);
    } catch (error) {
      console.error('Error fetching today\'s dashboard data:', error);
      message.error(`Failed to fetch today's financial data.`);
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
          return '';
        }

        const salesValue = parseFloat(items[0].data.sales);

        if (isNaN(salesValue) || salesValue <= 0) {
          return '';
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
    height: 250,
    padding: 'auto',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fontSize: 10,
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `$${v}`,
      },
    },
    meta: {
      date: {
        range: [0, 1],
      },
    },
  };

  return (
    <motion.div
      className="mobile-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Dashboard</h2>
      
      {/* Today's Financials */}
      <h2 style={{ margin: '16px 0 8px 0', fontSize: '1.5rem' }}>Today Sales Overview</h2>
      <div className="mobile-dashboard-cards">
        {cardData.map((card, index) => (
          <motion.div
            key={card.label}
            className={`mobile-dashboard-card ${card.type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="card-icon">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div className="card-content">
              <div className="card-label">{card.label}</div>
              <div className="card-amount">
                {loadingFinancials ? (
                  <div className="loading-spinner" />
                ) : (
                  <CountUp end={card.amount} duration={1.2} separator="," />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Last 30 Days' Financials */}
      <h2 style={{ margin: '24px 0 8px 0', fontSize: '1.5rem' }}>Last 30 Days Sales Overview</h2>
      <div className="dashboard-cards">
        {[{
          label: 'Total Work',
          amount: last30DaysFinancials.totalSales,
          icon: faClipboardList,
          type: 'blue',
        },
        {
          label: 'Income Amount',
          amount: last30DaysFinancials.incomeAmount,
          icon: faArrowUp,
          type: 'dark',
        },
        {
          label: 'Outgoing Amount',
          amount: last30DaysFinancials.outgoingAmount,
          icon: faArrowDown,
          type: 'blue',
        },
        {
          label: 'Profit',
          amount: last30DaysFinancials.profit,
          icon: faDollarSign,
          type: last30DaysFinancials.profit >= 0 ? 'blue' : 'dark',
        },
        ].map((card, idx) => (
          <motion.div
            key={`last30-${idx}`}
            className={`dashboard-card ${card.type}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 + 0.15 }}
          >
            <div className="card-icon">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div className="card-label">{card.label}</div>
            <div className="card-amount">
              <CountUp 
                end={card.amount} 
                duration={1.2} 
                separator=","
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="analysis-card analysis-card-line"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ margin: '16px' }}
      >
        <div className="analysis-title">Profit Overview (Last 30 Days)</div>
        <div className="analysis-line-chart">
          {loadingChart ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading chart data...</div>
          ) : chartData.length > 0 ? (
            <Line {...chartConfig} />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              No profit data available for the last 30 days.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileDashboard;