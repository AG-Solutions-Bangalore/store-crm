import { Card, Col, Row, Spin, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DASHBOARD } from "../../api";
import useToken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";
import dayjs from "dayjs";
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

  // if (isMutating || !data) return <Spin fullscreen />;
  const monthlyData = data?.monthly || [];

  const cardItems = [
    { title: "Categories", count: data?.categoryCount || "" },
    { title: "Products", count: data?.productCount || "" },
    { title: "Orders", count: data?.orderCount || "" },
    { title: "Users", count: data?.userCount || "" },
    { title: "Guest Users", count: data?.guestuserCount || "" },
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
      render: (text) => (text ? dayjs(text).format("DD-MM-YYYY") : "-"),
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
    <>
      {isMutating || !data ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <Title level={3}>Dashboard</Title>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cardItems.map((item) => (
              <Card
                title={item.title}
                bordered={false}
                className="shadow-md text-center"
              >
                <p className="text-2xl font-semibold">{item.count}</p>
              </Card>
            ))}
          </div>

          <Card title="Latest Orders" className="shadow-md">
            <Table
              dataSource={data.latestOrders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>

          <Card title="Monthly Order Summary" style={{ marginTop: 10 }}>
            {monthlyData && monthlyData.length > 0 ? (
              <div style={{ width: "100%", height: 350, overflow: "hidden" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                  >
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
                      wrapperStyle={{ zIndex: 1000 }}
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
            ) : (
              <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
                No data available
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default Dashboard;
