import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { SLIDER_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import SliderCard from "../../components/sliders/SliderCard";
import { useApiMutation } from "../../hooks/useApiMutation";
import SliderForm from "./SliderForm";

const { Option } = Select;
const SliderList = () => {
  const token = usetoken();
  const [selectedId, setSelecetdId] = useState(false);
  const [open, setopenDialog] = useState(false);

  const [statusFilter, setStatusFilter] = useState(null);
  const { trigger, loading: isMutating } = useApiMutation();
  const [slider, setSliders] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const fetchUser = async () => {
    const res = await trigger({
      url: SLIDER_LIST,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(res.data)) {
      setSliders(res.data);

      const userImageObj = res.image_url?.find(
        (img) => img.image_for === "Slider"
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
    setSelecetdId(null);
    setTimeout(() => {
      setSelecetdId(id);
      setopenDialog(true);
    }, 0);
  };

  const handleAddUser = () => {
    setopenDialog(true);
    setSelecetdId(null);
  };

  const filteredUsers = slider
    .filter((user) => {
      if (statusFilter === "active" && user.is_active !== "true") return false;
      if (statusFilter === "inactive" && user.is_active !== "false")
        return false;
      return true;
    })
    .filter(Boolean);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#006666]">Slider List</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
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
            Add Slider
          </Button>
        </div>
      </div>
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {filteredUsers.map((user, index) => (
              <SliderCard
                key={index}
                imageUrls={imageUrls}
                users={user}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
      {open && (
        <SliderForm
          open={open}
          setOpenDialog={setopenDialog}
          userId={selectedId}
          fetchUser={fetchUser}
        />
      )}
    </Card>
  );
};

export default SliderList;
