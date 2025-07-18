import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Input, Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import { CATEGORY_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import CategoryCard from "../../components/category/CategoryCard";
import { useApiMutation } from "../../hooks/useApiMutation";
import CategoryForm from "./CategoryForm";
const { Search } = Input;
const CategoryList = () => {
  const { message } = App.useApp();

  const token = usetoken();
  const [open, setopenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageno, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelecetdId] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const fetchUser = async () => {
    const queryParams = new URLSearchParams();
    const term = searchTerm.trim().toLowerCase();

    if ("inactive".startsWith(term) && term.length >= 4) {
      queryParams.append("search", "false");
    } else if ("active".startsWith(term) && term.length >= 4) {
      queryParams.append("search", "true");
    } else {
      if (term) queryParams.append("search", term);
    }

    queryParams.append("page", pageno);

    const res = await trigger({
      url: `${CATEGORY_LIST}?${queryParams.toString()}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res) {
      const responseData = res.data;

      setUsers(responseData?.data || []);
      setTotalPages(responseData?.last_page || 1);
      setPageSize(responseData?.per_page || 10);

      const userImageObj = res.image_url?.find(
        (img) => img.image_for === "Category"
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
  }, [pageno, searchTerm]);

  const handleToggleStatus = async (user) => {
    try {
      const newStatus =
        user.is_active === "true" || user.is_active === true ? "false" : "true";

      const res = await trigger({
        url: `categorys/${user.id}/status`,
        method: "patch",
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
          res.message ||
            `User marked as ${newStatus === "true" ? "Active" : "Inactive"}`
        );
      } else {
        message.error(res.message || "Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(error || "Error updating user status.");
    }
  };

  const handleEdit = (id) => {
    setopenDialog(true);

    setSelecetdId(id);
  };

  const handleAddUser = () => {
    setSelecetdId(null);
    setopenDialog(true);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value.toLowerCase());
    setPageNo(1);
  };
  return (
    <>
      <Card className="min-h-[35rem]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-[#006666]">Category List</h2>

          <div className="flex-1 flex gap-4 sm:justify-end">
            <Search
              placeholder="Search category"
              allowClear
              onChange={handleSearchChange}
              className="max-w-sm"
            />

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
        ) : users.length > 0 ? (
          <>
            <div className="min-h-[22rem]">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {users.map((user) => (
                  <CategoryCard
                    imageUrls={imageUrls}
                    key={user.id}
                    user={user}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-20">
            No category found.
          </div>
        )}
        <div className="flex justify-center mt-8">
          {!isMutating && users.length > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={pageno}
                pageSize={pageSize}
                total={totalPages * pageSize}
                onChange={(page) => setPageNo(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
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
