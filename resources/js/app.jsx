// resources/js/app.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Tag,
  Progress,
  Timeline,
  Tabs,
  Table,
  Button,
  Divider,
  Tooltip,
  theme,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  RocketOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import "../css/app.css"; // we’ll add styles in the next step

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

/* -------- Fake data ---------- */

const trafficData = [
  { name: "Mon", users: 1200, orders: 32 },
  { name: "Tue", users: 1700, orders: 55 },
  { name: "Wed", users: 1400, orders: 43 },
  { name: "Thu", users: 2100, orders: 72 },
  { name: "Fri", users: 2600, orders: 91 },
  { name: "Sat", users: 2300, orders: 77 },
  { name: "Sun", users: 1900, orders: 60 },
];

const recentOrders = [
  {
    key: 1,
    customer: "John Doe",
    orderId: "#ORD-1023",
    total: "$149.99",
    status: "Shipped",
  },
  {
    key: 2,
    customer: "Sarah Smith",
    orderId: "#ORD-1024",
    total: "$89.00",
    status: "Processing",
  },
  {
    key: 3,
    customer: "Ali Hassan",
    orderId: "#ORD-1025",
    total: "$240.33",
    status: "Pending",
  },
  {
    key: 4,
    customer: "Maria Lopez",
    orderId: "#ORD-1026",
    total: "$61.40",
    status: "Cancelled",
  },
];

const statusTag = (status) => {
  const map = {
    Shipped: "green",
    Processing: "blue",
    Pending: "orange",
    Cancelled: "red",
  };
  return <Tag color={map[status]}>{status}</Tag>;
};

/* --------- Animated number hook --------- */

function useAnimatedNumber(target, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const diff = target - start;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

/* --------------- Dashboard Component --------------- */

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // Animated stats
  const usersToday = useAnimatedNumber(2431);
  const ordersToday = useAnimatedNumber(87);
  const revenueToday = useAnimatedNumber(12490);
  const conversion = useAnimatedNumber(4.8 * 10) / 10; // keep 1 decimal

  const [refreshing, setRefreshing] = useState(false);

  const handleQuickRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: statusTag,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" size="small">
          View
        </Button>
      ),
    },
  ];

  return (
    <Layout className="dashboard-root">
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        className="dashboard-sider"
      >
        <div className="brand">
          <RocketOutlined className="brand-icon" />
          {!collapsed && <span className="brand-name">NovaAdmin</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={(e) => setActiveMenu(e.key)}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "orders",
              icon: <ShoppingCartOutlined />,
              label: "Orders",
            },
            {
              key: "analytics",
              icon: <BarChartOutlined />,
              label: "Analytics",
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
            },
          ]}
        />
      </Sider>

      <Layout className="dashboard-main">
        <Header className="dashboard-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((c) => !c)}
            />
            <Title level={4} className="header-title">
              {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
            </Title>
            <Tag color="geekblue" className="header-tag">
              Live
            </Tag>
          </div>
          <div className="header-right">
            <Tooltip title="Sync stats">
              <Button
                shape="circle"
                icon={<SyncOutlined spin={refreshing} />}
                onClick={handleQuickRefresh}
              />
            </Tooltip>

            <Badge count={5}>
              <Button shape="circle" icon={<BellOutlined />} />
            </Badge>
            <Divider type="vertical" />
            <Avatar icon={<UserOutlined />} />
            <Text className="header-username">Admin</Text>
          </div>
        </Header>

        <Content className="dashboard-content">
          {/* Top stats cards */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} xl={6}>
              <Card className="card-glass" hoverable>
                <Statistic
                  title="Active Users"
                  value={usersToday}
                  suffix="/ today"
                />
                <Progress
                  percent={78}
                  size="small"
                  status="active"
                  className="card-progress"
                />
                <Text type="secondary">+18% vs yesterday</Text>
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card className="card-glass" hoverable>
                <Statistic title="Orders" value={ordersToday} />
                <Progress percent={62} size="small" status="active" />
                <Text type="secondary">Conversion funnel improving</Text>
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card className="card-glass" hoverable>
                <Statistic
                  title="Revenue"
                  value={revenueToday}
                  prefix="$"
                  precision={0}
                />
                <Text type="secondary">Today • USD</Text>
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card className="card-glass" hoverable>
                <Statistic
                  title="Conversion Rate"
                  value={conversion}
                  suffix="%"
                  precision={1}
                />
                <Text type="secondary">Goal: 6.0%</Text>
                <Progress percent={Math.min((conversion / 6) * 100, 100)} />
              </Card>
            </Col>
          </Row>

          {/* Chart + timeline */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={16}>
              <Card className="card-glass" title="Traffic & Orders">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1677ff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient
                        id="colorOrders"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#52c41a" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#1677ff"
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#52c41a"
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card className="card-glass" title="Activity Stream">
                <Timeline
                  items={[
                    {
                      color: "green",
                      children: "New order #1026 from Germany",
                    },
                    {
                      color: "blue",
                      children: "3 new users signed up",
                    },
                    {
                      color: "orange",
                      children: "Inventory low on Product X",
                    },
                    {
                      color: "gray",
                      children: "Nightly backup completed",
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>

          {/* Tabs + table */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card className="card-glass">
                <Tabs
                  defaultActiveKey="1"
                  items={[
                    {
                      key: "1",
                      label: "Recent Orders",
                      children: (
                        <Table
                          columns={columns}
                          dataSource={recentOrders}
                          pagination={{ pageSize: 4 }}
                          size="middle"
                        />
                      ),
                    },
                    {
                      key: "2",
                      label: "System Health",
                      children: (
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={8}>
                            <Card size="small">
                              <Statistic title="API Latency" value={144} suffix="ms" />
                              <Progress percent={92} status="active" />
                            </Card>
                          </Col>
                          <Col xs={24} md={8}>
                            <Card size="small">
                              <Statistic title="Uptime" value={99.98} suffix="%" />
                              <Text type="secondary">Last 30 days</Text>
                            </Card>
                          </Col>
                          <Col xs={24} md={8}>
                            <Card size="small">
                              <Statistic title="Error Rate" value={0.17} suffix="%" />
                              <Text type="secondary">Within safe limits</Text>
                            </Card>
                          </Col>
                        </Row>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<Dashboard />);
