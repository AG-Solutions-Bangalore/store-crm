import { useEffect, useState } from "react";
import { DASHBOARD } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
import useToken from "../../api/usetoken";
import {Card, Col, Row, Table, Tag, Typography, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Text,
} from "recharts";
const { Title } = Typography;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const { trigger, loading: isMutating } = useApiMutation();
  const token = useToken();

  const fetchDashboard = async () => {
    const res = await trigger({
      url: DASHBOARD,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res?.code === 201) {
      setData(res);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isMutating || !data) return <Spin fullscreen />;

  const cardItems = [
    { title: "Categories", count: data.categoryCount },
    { title: "Products", count: data.productCount },
    { title: "Orders", count: data.orderCount },
    { title: "Users", count: data.userCount },
    { title: "Guest Users", count: data.guestuserCount },
  ];

  const orderColumns = [
    {
      title: "Order No",
      dataIndex: "order_no",
      key: "order_no",
    },
    {
      title: "Order Ref",
      dataIndex: "order_ref_number",
      key: "order_ref_number",
    },
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (text) => `₹${text}`,
    },
    {
      title: "Date",
      dataIndex: "order_date",
      key: "order_date",
    },
    {
      title: "Status",
      dataIndex: "order_status",
      key: "order_status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  

  return (
    <div className="p-4 space-y-6">
      <Title level={3}>Dashboard</Title>

      <Row gutter={[16, 16]}>
        {cardItems.map((item) => (
          <Col key={item.title} xs={24} sm={12} md={8} lg={4}>
            <Card
              title={item.title}
              bordered={false}
              className="shadow-md text-center"
            >
              <p className="text-2xl font-semibold">{item.count}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Latest Orders" className="shadow-md">
        <Table
          dataSource={data.latestOrders}
          columns={orderColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card title="Monthly Order Summary" className="shadow-md">
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            >
              <CartesianGrid stroke="#000" strokeDasharray="3 3" />
              <XAxis
                type="number"
                tick={{ fill: "#000", fontSize: 12 }}
                axisLine={{ stroke: "#000" }}
                tickLine={{ stroke: "#000" }}
              />
              <YAxis
                type="category"
                dataKey="month_name"
                tick={{ fill: "#000", fontSize: 12 }}
                axisLine={{ stroke: "#000" }}
                tickLine={{ stroke: "#000" }}
              />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Total"]}
                labelStyle={{ color: "#000" }}
              />
              <Bar
                dataKey="total_amount"
                fill="#1677ff"
                barSize={monthlyData.length === 1 ? 30 : 40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
