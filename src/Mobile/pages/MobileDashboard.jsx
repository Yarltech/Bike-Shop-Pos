import React from 'react';
import '../styles/MobileDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faHourglassHalf, faCheckCircle, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const cardData = [
  {
    label: 'Total Sales',
    amount: '53250',
    icon: faChartLine,
    type: 'blue',
  },
  {
    label: 'Pending',
    amount: '12',
    icon: faHourglassHalf,
    type: 'dark',
  },
  {
    label: 'Completed',
    amount: '34',
    icon: faCheckCircle,
    type: 'blue',
  },
  {
    label: 'Outgoing',
    amount: '6700',
    icon: faMoneyBillWave,
    type: 'dark',
  },
];

const MobileDashboard = () => {
  return (
    <motion.div
      className="mobile-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Dashboard</h2>
      <div className="dashboard-cards">
        {cardData.map((card, idx) => (
          <motion.div
            key={idx}
            className={`dashboard-card ${card.type}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          >
            <div className="card-icon">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div className="card-label">{card.label}</div>
            <div className="card-amount">{card.amount}</div>
          </motion.div>
        ))}
      </div>
      {/* Line Chart Analysis Card */}
      <motion.div
        className="analysis-card analysis-card-line"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="analysis-title">Analysis</div>
        <div className="analysis-line-chart">
          {/* SVG Line Chart */}
          <svg width="100%" height="100" viewBox="0 0 240 100" className="line-chart-svg">
            {/* Sample data points */}
            {(() => {
              const data = [30, 22, 40, 60, 55, 48];
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
              const max = Math.max(...data);
              const min = Math.min(...data);
              const points = data.map((v, i) => {
                const x = 20 + i * 40;
                const y = 80 - ((v - min) / (max - min || 1)) * 60;
                return [x, y];
              });
              // Line path
              const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
              return (
                <>
                  {/* Vertical grid lines */}
                  {points.map((p, i) => (
                    <line key={i} x1={p[0]} y1={80} x2={p[0]} y2={p[1]} stroke="#eee" strokeWidth="1" />
                  ))}
                  {/* Line */}
                  <path d={path} fill="none" stroke="#a084e8" strokeWidth="2" />
                  {/* Dots */}
                  {points.map((p, i) => (
                    <circle key={i} cx={p[0]} cy={p[1]} r="5" fill="#fff" stroke="#222" strokeWidth="2" />
                  ))}
                  {/* Month labels */}
                  {points.map((p, i) => (
                    <text key={i} x={p[0]} y={95} textAnchor="middle" fontSize="12" fill="#888">{months[i]}</text>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      </motion.div>
      {/* Device Traffic Bar Chart Card */}
      <motion.div
        className="device-traffic-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="device-traffic-title">Device Traffic</div>
        <div className="device-traffic-bar-chart">
          {(() => {
            const data = [80, 120, 110, 150, 243, 70];
            const labels = ['Linux', 'Mac', 'iOS', 'Windows', 'Android', 'Other'];
            const max = Math.max(...data);
            return data.map((val, i) => {
              const isMax = val === max;
              return (
                <div className="device-bar-group" key={labels[i]}>
                  {isMax && (
                    <div className="device-bar-amount-pill">{val}K</div>
                  )}
                  <div
                    className={`device-bar${isMax ? ' highlight' : ''}`}
                    style={{ height: `${40 + (val / max) * 60}px` }}
                  ></div>
                  <div className="device-bar-label">{labels[i]}</div>
                </div>
              );
            });
          })()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileDashboard;
