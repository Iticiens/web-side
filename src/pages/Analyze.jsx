// Dashboard.js
import React from 'react';
import { Card, Row, Col, Typography, Space, Tabs, Table } from 'antd';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {  ShoppingOutlined, DollarOutlined, AppstoreOutlined } from '@ant-design/icons';
import '../Components/styles/Dashboard.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const monthlySales = [
  { month: 'Jan', food: 4, drink: 2, snack: 1, dessert: 1 },
  { month: 'Feb', food: 30, drink: 2, snack: 1, dessert: 0.5 },
  { month: 'Mar', food: 140, drink: 1, snack: 2, dessert: 1 },
  { month: 'Apr', food: 2, drink: 1, snack: 1, dessert: 0.5 },
  { month: 'May', food: 30, drink: 1, snack: 1, dessert: 0.5 },
  { month: 'Jun', food: 100, drink: 2, snack: 1, dessert: 0.5 },
  { month: 'Jul', food: 30, drink: 1, snack: 1, dessert: 0.5 },
  { month: 'Aug', food: 40, drink: 2, snack: 1, dessert: 1 },
  { month: 'Sep', food: 50, drink: 2, snack: 1, dessert: 1 },
  { month: 'Oct', food: 30, drink: 1, snack: 1, dessert: 0.5 },
  { month: 'Nov', food: 20, drink: 1, snack: 1, dessert: 0.5 }
];

const products = [
  {
    key: '1',
    name: 'Special Fried rice',
    category: 'Food',
    price: '$4.5',
    cost: '$0.5'
  },
  {
    key: '2',
    name: 'Buttered Spicy Chicken',
    category: 'Food',
    price: '$5.1',
    cost: '$0.8'
  }
];

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <Row gutter={[24, 24]}>
        {/* Profit Card */}
        <Col span={24}>
          <Card className="profit-card">
            <Title level={5}>Profit amount</Title>
            <div className="profit-amount">
              <span className="currency">$</span>
              <span className="amount">15,237.000</span>
            </div>
            <AreaChart width={900} height={100} data={monthlySales} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <Area type="monotone" dataKey="food" stroke="#FCB218" fill="#FCB218" fillOpacity={0.3} />
              <Tooltip />
            </AreaChart>
          </Card>
        </Col>

        {/* Stats Cards */}
        <Col xs={12} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-icon product-icon">
              <ShoppingOutlined />
            </div>
            <div className="stat-content">
              <p>Total Products</p>
              <h2>25</h2>
              <span className="trend positive">+15%</span>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-icon category-icon">
              <AppstoreOutlined />
            </div>
            <div className="stat-content">
              <p>Product Category</p>
              <h2>4</h2>
              <span className="trend positive">+15%</span>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-icon sales-icon">
              {/* <TrendingUpOutlined /> */}
            </div>
            <div className="stat-content">
              <p>Total Sold</p>
              <h2>11,967</h2>
              <span className="trend positive">+15%</span>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-icon income-icon">
              <DollarOutlined />
            </div>
            <div className="stat-content">
              <p>Monthly Income</p>
              <h2>$13,760</h2>
              <span className="trend positive">+15%</span>
            </div>
          </Card>
        </Col>

        {/* Sales Chart */}
        <Col span={16}>
          <Card title="Product Sale">
            <BarChart width={800} height={300} data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="food" stackId="a" fill="#1890ff" />
              <Bar dataKey="drink" stackId="a" fill="#ffd666" />
              <Bar dataKey="snack" stackId="a" fill="#ff7a45" />
              <Bar dataKey="dessert" stackId="a" fill="#95de64" />
            </BarChart>
          </Card>
        </Col>

        {/* Target Prediction */}
        <Col span={8}>
          <Card title="Target Prediction">
            <div className="target-prediction">
              <h3>$ 30,000,000</h3>
              <div className="progress-bar">
                <div className="progress" style={{ width: '60%' }}></div>
              </div>
              <p>Based on the MSME analysis that has been carried out, the development of this business shows a very positive trend.</p>
              <button className="see-more-btn">See More</button>
            </div>
          </Card>
        </Col>

        {/* Products Table */}
        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="all">
              <TabPane tab="All" key="all">
                <Table 
                  columns={[
                    { title: 'Product', dataIndex: 'name' },
                    { title: 'Category', dataIndex: 'category' },
                    { title: 'Price', dataIndex: 'price' },
                    { title: 'Cost', dataIndex: 'cost' }
                  ]} 
                  dataSource={products} 
                />
              </TabPane>
              <TabPane tab="Food" key="food">
                {/* Food items */}
              </TabPane>
              <TabPane tab="Drink" key="drink">
                {/* Drink items */}
              </TabPane>
              <TabPane tab="Snack" key="snack">
                {/* Snack items */}
              </TabPane>
              <TabPane tab="Dessert" key="dessert">
                {/* Dessert items */}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;