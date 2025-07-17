import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NOTIFICATION_LIST, UPDATE_STATUS, USER_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import UserTable from "../../components/user/UserCard";
import { useApiMutation } from "../../hooks/useApiMutation";
import { App } from "antd";

const { Search } = Input;
import { Select } from "antd";
import NotificationTable from "../../components/notification/NotificationTable";
import NotificationForm from "./NotificationForm";
const { Option } = Select;
const Notification = () => {
  const [selectedId, setSelecetdId] = useState(false);
  const [open, setopenDialog] = useState(false);
  const token = usetoken();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const fetchUser = async () => {
    const res = await trigger({
      url: NOTIFICATION_LIST,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(res.data)) {
      setUsers(res.data);

      const userImageObj = res.image_url?.find(
        (img) => img.image_for === "Notification"
      );
      const noImageObj = res.image_url?.find(
        (img) => img.image_for === "No Image"
      );

      setImageUrls({
        userImageBase: userImageObj?.image_url || "",
        noImage: noImageObj?.image_url || "",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = (id) => {
    setopenDialog(true);
    setSelecetdId(id);
  };

  const handleAddUser = () => {
    setopenDialog(true);
    setSelecetdId(null);
  };

  const filteredUsers = users
    .filter((user) => {
      if (statusFilter === "active" && user.is_active !== "true") return false;
      if (statusFilter === "inactive" && user.is_active !== "false")
        return false;
      return true;
    })
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
        <h2 className="text-2xl font-bold text-[#006666]">Notification List</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
          <Select
            allowClear
            placeholder="Filter by status"
            onChange={(value) => setStatusFilter(value)}
            className="w-40"
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
            className="bg-[#006666]"
          >
            Add Notification
          </Button>
        </div>
      </div>
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <NotificationTable
            imageUrls={imageUrls}
            users={filteredUsers}
            onEdit={handleEdit}
          />
        ) : (
          <div className="text-center text-gray-500 py-20">No users found.</div>
        )}
      </div>

      <NotificationForm
        open={open}
        setOpenDialog={setopenDialog}
        userId={selectedId}
        fetchUser={fetchUser}
      />
    </Card>
  );
};

export default Notification;
