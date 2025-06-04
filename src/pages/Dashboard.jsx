import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { DollarOutlined, ToolOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';

const Dashboard = () => {
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

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <h1>Dashboard</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Sales"
              value={1250}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Repairs"
              value={8}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={5}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed Today"
              value={12}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <h2>Sales Overview</h2>
        <Line {...config} />
      </Card>
    </div>
  );
};

export default Dashboard; 