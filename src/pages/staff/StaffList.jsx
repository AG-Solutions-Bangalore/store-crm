import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Input, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UPDATE_STATUS, USER_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import UserTable from "../../components/user/UserTable";
import { useApiMutation } from "../../hooks/useApiMutation";

const { Search } = Input;
const { Option } = Select;
const StaffList = () => {
  const { message } = App.useApp();
  const token = usetoken();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const navigate = useNavigate();
  const fetchUser = async () => {
    const res = await trigger({
      url: USER_LIST,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res?.code == 201 && Array.isArray(res.data)) {
      setUsers(res.data);

      const userImageObj = res.image_url?.find(
        (img) => img.image_for === "User"
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

  const handleEdit = (user) => {
    navigate(`/user-edit/${user.id}`, {
      state: {
        user_type: 3,
        title: "Staff",
        navigatedata: "/staff",
      },
    });
  };
  const handleAddUser = () => {
    navigate("/user-create", {
      state: {
        user_type: 3,
        title: "Staff",
        navigatedata: "/staff",
      },
    });
  };

  const filteredUsers = users
    .filter((user) => {
      if (user.user_type !== 3) return false;
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

  const handleToggleStatus = async (user) => {
    try {
      const newStatus =
        user.is_active === "true" || user.is_active === true ? "false" : "true";

      const res = await trigger({
        url: `${UPDATE_STATUS}/${user.id}`,
        method: "put",
        data: { is_active: newStatus },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.code === 200 || res?.code === 201) {
        const updatedUsers = users.map((u) =>
          u.id === user.id ? { ...u, is_active: newStatus } : u
        );
        setUsers(updatedUsers);
        message.success(
          `User marked as ${newStatus === "true" ? "Active" : "Inactive"}`
        );
      } else {
        message.error("Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Error updating user status.");
    }
  };
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#006666]">Staff List</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search user name or mobile"
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
            Add Staff
          </Button>
        </div>
      </div>
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <UserTable
            imageUrls={imageUrls}
            users={filteredUsers}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
          />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
    </Card>
  );
};

export default StaffList;
