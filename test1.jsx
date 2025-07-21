// import { useEffect, useState } from "react";
// import { DASHBOARD } from "../../api";
// import { useApiMutation } from "../../hooks/useApiMutation";
// import useToken from "../../api/usetoken";
// import { Card, Col, Row, Table, Tag, Typography, Spin } from "antd";
// import { Bar } from "@ant-design/plots";

// const { Title } = Typography;

// const Dashboard = () => {
//   const [data, setData] = useState(null);
//   const { trigger, loading: isMutating } = useApiMutation();
//   const token = useToken();

//   const fetchDashboard = async () => {
//     const res = await trigger({
//       url: DASHBOARD,
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (res?.code === 201) {
//       setData(res);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   if (isMutating || !data) return <Spin fullscreen />;

//   const cardItems = [
//     { title: "Categories", count: data.categoryCount },
//     { title: "Products", count: data.productCount },
//     { title: "Orders", count: data.orderCount },
//     { title: "Users", count: data.userCount },
//     { title: "Guest Users", count: data.guestuserCount },
//   ];

//   const orderColumns = [
//     {
//       title: "Order No",
//       dataIndex: "order_no",
//       key: "order_no",
//     },
//     {
//       title: "Order Ref",
//       dataIndex: "order_ref_number",
//       key: "order_ref_number",
//     },
//     {
//       title: "Company",
//       dataIndex: "company_name",
//       key: "company_name",
//     },
//     {
//       title: "Amount",
//       dataIndex: "total_amount",
//       key: "total_amount",
//       render: (text) => `₹${text}`,
//     },
//     {
//       title: "Date",
//       dataIndex: "order_date",
//       key: "order_date",
//     },
//     {
//       title: "Status",
//       dataIndex: "order_status",
//       key: "order_status",
//       render: (status) => (
//         <Tag color={status === "completed" ? "green" : "orange"}>
//           {status.toUpperCase()}
//         </Tag>
//       ),
//     },
//   ];

//   const barConfig = {
//     data: data.monthly.map((item) => ({
//       ...item,
//       total_amount: parseFloat(item.total_amount), // Ensure number type
//     })),
//     xField: "total_amount",
//     yField: "month_name",
//     seriesField: "month_name", // optional if only one month — you can remove this
//     color: "#1677ff",
//     autoFit: true,
//     height: 300,
//     barWidthRatio: 0.5,
//     tooltip: {
//       formatter: (datum) => ({
//         name: datum.month_name,
//         value: `₹${datum.total_amount}`,
//       }),
//     },
//     xAxis: {
//       label: {
//         formatter: (val) => `₹${val}`,
//         style: { fontSize: 12 },
//       },
//       title: {
//         text: "Total Amount",
//         style: { fontWeight: 500 },
//       },
//     },
//     yAxis: {
//       title: {
//         text: "Month",
//         style: { fontWeight: 500 },
//       },
//       label: {
//         style: {
//           fontSize: 12,
//         },
//       },
//     },
//     interactions: [
//       {
//         type: "element-active", // only highlight bar, no big hover box
//       },
//     ],
//     label: {
//       position: "middle",
//       layout: [
//         { type: "interval-adjust-position" },
//         { type: "interval-hide-overlap" },
//         { type: "adjust-color" },
//       ],
//     },
//   };

//   return (
//     <div className="p-4 space-y-6">
//       <Title level={3}>Dashboard</Title>

//       <Row gutter={[16, 16]}>
//         {cardItems.map((item) => (
//           <Col key={item.title} xs={24} sm={12} md={8} lg={4}>
//             <Card
//               title={item.title}
//               bordered={false}
//               className="shadow-md text-center"
//             >
//               <p className="text-2xl font-semibold">{item.count}</p>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       <Card title="Latest Orders" className="shadow-md">
//         <Table
//           dataSource={data.latestOrders}
//           columns={orderColumns}
//           rowKey="id"
//           pagination={false}
//         />
//       </Card>

//       <Card title="Monthly Order Summary" className="shadow-md">
//         <div className="w-full max-w-full overflow-auto">
//           <Bar {...barConfig} />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect, useState } from "react";
import { Card, Col, Row, Table, Tag, Typography, Spin } from "antd";
import { Bar } from "@ant-design/plots";

const { Title } = Typography;

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      const mockData = {
        categoryCount: 12,
        productCount: 48,
        orderCount: 102,
        userCount: 21,
        guestuserCount: 8,
        latestOrders: [
          {
            id: 1,
            order_no: "ORD-001",
            order_ref_number: "REF-12345",
            company_name: "ACME Corp",
            total_amount: 1500,
            order_date: "2025-07-20",
            order_status: "completed",
          },
          {
            id: 2,
            order_no: "ORD-002",
            order_ref_number: "REF-12346",
            company_name: "Globex Ltd",
            total_amount: 3200,
            order_date: "2025-07-19",
            order_status: "pending",
          },
        ],
        monthly: [
          { month_name: "Jan", total_amount: 10000 },
          { month_name: "Feb", total_amount: 8000 },
          { month_name: "Mar", total_amount: 9500 },
          { month_name: "Apr", total_amount: 7200 },
          { month_name: "May", total_amount: 10400 },
          { month_name: "Jun", total_amount: 11800 },
          { month_name: "Jul", total_amount: 9100 },
        ],
      };
      setData(mockData);
    }, 1000);
  }, []);

  if (!data) return <Spin fullscreen />;

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

  const barConfig = {
    data:
      data.monthly,
    xField: "total_amount",
    yField: "month_name",
    color: "#1677ff",
    autoFit: true,
    height: 300,
    barWidthRatio: 0.4, // tighter control
    xAxis: {
      label: {
        formatter: (val) => `₹${val}`,
        style: { fontSize: 12 },
      },
      title: {
        text: "Total Amount",
        style: { fontWeight: 500 },
      },
    },
    yAxis: {
      title: {
        text: "Month",
        style: { fontWeight: 500 },
      },
      label: {
        style: { fontSize: 12 },
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum.month_name,
        value: `₹${datum.total_amount}`,
      }),
    },
    interactions: [{ type: "element-active" }],
    label: {
      position: "middle",
      layout: [
        { type: "interval-adjust-position" },
        { type: "interval-hide-overlap" },
        { type: "adjust-color" },
      ],
    },
  };

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
        <div className="w-full max-w-full overflow-auto">
          <Bar {...barConfig} />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
