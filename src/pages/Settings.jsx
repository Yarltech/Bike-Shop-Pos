import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Button, 
  Divider, 
  Select, 
  message, 
  Row, 
  Col, 
  Typography,
  TimePicker,
  Tabs,
  Upload
} from 'antd';
import { 
  SaveOutlined, 
  ShopOutlined, 
  ClockCircleOutlined, 
  SettingOutlined,
  UploadOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  BellOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import '../styles/Settings.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', values);
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const businessHoursInitialValues = {
    monday: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')],
    tuesday: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')],
    wednesday: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')],
    thursday: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')],
    friday: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')],
    saturday: [dayjs('10:00', 'HH:mm'), dayjs('16:00', 'HH:mm')],
    sunday: null,
  };

  return (
    <div className="settings-container">
      <Card>
        <div className="settings-header">
          <Title level={2} className="settings-title">
            <SettingOutlined />
            Shop Settings
          </Title>
          <Text type="secondary">Manage your shop's configuration and preferences</Text>
        </div>

        <Tabs defaultActiveKey="1" size="large" centered>
          <TabPane 
            tab={
              <span>
                <ShopOutlined />
                Shop Information
              </span>
            } 
            key="1"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                shopName: 'Bike Repair Shop',
                taxRate: 15,
                currency: 'LKR',
                enableNotifications: true,
                enableReceiptPrinting: true,
                businessHours: businessHoursInitialValues,
              }}
            >
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="shopName"
                    label="Shop Name"
                    rules={[{ required: true, message: 'Please enter shop name' }]}
                  >
                    <Input prefix={<ShopOutlined />} placeholder="Enter shop name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="Shop Address"
                rules={[{ required: true, message: 'Please enter shop address' }]}
              >
                <Input.TextArea 
                  prefix={<EnvironmentOutlined />} 
                  rows={3} 
                  placeholder="Enter shop address"
                />
              </Form.Item>

              <Form.Item
                name="logo"
                label="Shop Logo"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <div className="logo-upload">
                    <UploadOutlined />
                    <div>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ClockCircleOutlined />
                Business Hours
              </span>
            } 
            key="2"
          >
            <Form.Item label="Business Hours" className="business-hours-form-item">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <Form.Item
                  key={day}
                  name={['businessHours', day]}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  className="business-hours-day-item"
                >
                  <TimePicker.RangePicker 
                    format="HH:mm"
                    className="time-picker"
                    disabled={day === 'sunday'}
                  />
                </Form.Item>
              ))}
            </Form.Item>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <GlobalOutlined />
                Business Settings
              </span>
            } 
            key="3"
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="taxRate"
                  label="Tax Rate (%)"
                  rules={[{ required: true, message: 'Please enter tax rate' }]}
                >
                  <InputNumber 
                    min={0} 
                    max={100} 
                    className="tax-input"
                    prefix="%"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true, message: 'Please select currency' }]}
                >
                  <Select>
                    <Select.Option value="LKR">LKR (රු)</Select.Option>
                    <Select.Option value="USD">USD ($)</Select.Option>
                    <Select.Option value="EUR">EUR (€)</Select.Option>
                    <Select.Option value="GBP">GBP (£)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <SettingOutlined />
                System Settings
              </span>
            } 
            key="4"
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="enableNotifications"
                  label="Enable Notifications"
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren={<BellOutlined />} 
                    unCheckedChildren={<BellOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="enableReceiptPrinting"
                  label="Enable Receipt Printing"
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren={<PrinterOutlined />} 
                    unCheckedChildren={<PrinterOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Divider />

        <div className="settings-actions">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            loading={loading}
            onClick={() => form.submit()}
          >
            Save Settings
          </Button>
          <Button
            size="large"
            onClick={() => form.resetFields()}
          >
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings; 