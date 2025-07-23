import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Image, Space, Tag, Tooltip } from "antd";
import STTable from "../STTable/STTable";
import dayjs from "dayjs";

const GuestUserOrderTable = ({ users, onEdit }) => {
  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark
          key={index}
          className="bg-[#006666] text-white px-1 rounded"
          style={{ backgroundColor: "#006666", color: "white" }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const columns = [
    {
      title: "Order No",
      dataIndex: "order_no",
      key: "order_no",
      render: (_, user) => highlightMatch(user.order_no, user._match),
    },
    {
      title: "Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (_, user) =>
        highlightMatch(
          dayjs(user.order_date).format("DD-MM-YYYY"),
          user._match
        ),
    },
    {
      title: "Name",
      dataIndex: "guest_name",
      key: "guest_name",
      render: (_, user) => highlightMatch(user.guest_name, user._match),
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (_, user) => highlightMatch(user.total_amount, user._match),
    },

    {
      title: "Status",
      dataIndex: "order_status",
      key: "order_status",
      render: (_, user) => {
        const isPending = user.order_status === "pending";

        return (
          <div className="flex justify-center">
            <Tag color={isPending ? "orange" : "green"}>
              {user.order_status}
            </Tag>
          </div>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, id) => {
        return (
          <Space>
            <Tooltip title="Edit Guest Order">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(id)}
                className="bg-[#006666]"
              />
            </Tooltip>
          </Space>
        );
      },
      width: 130,
    },
  ];

  return <STTable data={users} columns={columns} />;
};

export default GuestUserOrderTable;
