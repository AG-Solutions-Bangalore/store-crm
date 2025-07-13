import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, message, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import CategoryCard from "../../components/category/CategoryCard";
import { useApiMutation } from "../../hooks/useApiMutation";
import CategoryForm from "./CategoryForm";
const { Search } = Input;
const { Option } = Select;
const CategoryList = () => {
  const token = usetoken();
  const [open, setopenDialog] = useState(false);
  const [selectedId, setSelecetdId] = useState(false);
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
      url: CATEGORY_LIST,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res) {
      setUsers(res.data);
      console.log(res);

      const userImageObj = res.image_url?.find(
        (img) => img.image_for == "Category"
      );
      const noImageObj = res.image_url?.find(
        (img) => img.image_for == "No Image"
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

  const handleToggleStatus = (user) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, is_active: u.is_active === "true" ? "false" : "true" }
        : u
    );
    setUsers(updatedUsers);
    message.success(
      `User marked as ${user.is_active === "true" ? "Inactive" : "Active"}`
    );
  };

  const handleEdit = (id) => {
    setopenDialog(true);
    console.log(id);
    setSelecetdId(id);
  };

  const handleAddUser = () => {
    setopenDialog(true);
  };
  const filteredUsers = users
    .filter((user) => {
      // Match status
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
    <>
      <Card className="min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-[#006666]">Category List</h2>

          <div className="flex-1 flex gap-4 sm:justify-end">
            <Search
              placeholder="Search category"
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
              Add Category
            </Button>
          </div>
        </div>

        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredUsers.map((user) => (
              <CategoryCard
                imageUrls={imageUrls}
                key={user.id}
                user={user}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            No category found.
          </div>
        )}
      </Card>

      <CategoryForm
        open={open}
        setOpenDialog={setopenDialog}
        userId={selectedId}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default CategoryList;
