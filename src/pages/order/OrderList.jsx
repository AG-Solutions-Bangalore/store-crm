import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ORDER_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import OrderTable from "../../components/order/OrderTable";
import { useApiMutation } from "../../hooks/useApiMutation";

const { Search } = Input;
const { Option } = Select;
const OrderList = () => {
  const token = usetoken();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const fetchUser = async () => {
    const res = await trigger({
      url: ORDER_LIST,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(res.data)) {
      setUsers(res.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleView = (user) => {
    navigate(`/order-view/${user.id}`);
  };
  const handleEdit = (user) => {
    navigate(`/order-form/${user.id}`);
  };

  const handleAddUser = () => {
    navigate("/order-form");
  };

  const filteredUsers = users

    .map((user) => {
      const flatString = Object.values(user)
        .filter((v) => typeof v === "string" || typeof v === "number")
        .join(" ")
        .toLowerCase();

      const matched = flatString.includes(searchTerm.toLowerCase());
      return matched ? { ...user, _match: searchTerm } : null;
    })
    .filter(Boolean);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#006666]"> Order List</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
            className="bg-[#006666]"
          >
            Add Order
          </Button>
        </div>
      </div>
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <OrderTable
            users={filteredUsers}
            onEdit={handleEdit}
            handleView={handleView}
          />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
    </Card>
  );
};

export default OrderList;
