import {
  UploadOutlined,
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Space,
  Switch,
  Upload,
  message,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { PROFILE, UPDATE_PROFILE } from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";

const UserForm = () => {
  const [form] = Form.useForm();
  const token = usetoken();
  const { trigger } = useApiMutation();
  const [imageBaseUrl, setImageBaseUrl] = useState(null);
  const [noImageUrl, setNoImageUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [userId, setUserId] = useState(null);
  const [addressForms, setAddressForms] = useState([]);
  const fetchProfile = async () => {
    try {
      const res = await trigger({
        url: PROFILE,
        headers: { Authorization: `Bearer ${token}` },
      });
      form.setFieldsValue(res?.data || {});
      setUserId(res.data?.id);
      const userImageData = res.image_url.find(
        (img) => img.image_for == "User"
      );
      const noImageData = res.image_url.find(
        (img) => img.image_for == "No Image"
      );

      setImageBaseUrl(userImageData?.image_url || "");
      setNoImageUrl(noImageData?.image_url || "");

      setAddressForms(
        Array.isArray(res.address)
          ? res.address.map((a) => ({
              id: a.id || "",
              address_type: a.address_type || "",
              address: a.address || "",
              is_default: a.is_default || false,
            }))
          : []
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSave = async (values) => {
    try {
      const formData = new FormData();
      formData.append("firm_name", values.firm_name || "");
      formData.append("gstin", values.gstin || "");
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("mobile", values.mobile);
      formData.append("whatsapp", values.whatsapp || "");
      formData.append("is_active", values.is_active ? "yes" : "no");
      if (avatarFile) {
        formData.append("avatar_photo", avatarFile);
      } else if (form.getFieldValue("avatar_photo")) {
        const imageUrl = `${imageBaseUrl}${form.getFieldValue("avatar_photo")}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "avatar.jpg", { type: blob.type });
        formData.append("avatar_photo", file);
      }
      formData.append(
        "address_data",
        JSON.stringify(
          addressForms.map((addr) => ({
            ...addr,
            is_default: addr.is_default ? "yes" : "no",
          }))
        )
      );

      await trigger({
        url: `${UPDATE_PROFILE}/${values?.id || userId}?_method=PUT`,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      message.error("Failed to update profile.");
    }
  };

  const addRow = useCallback(() => {
    setAddressForms((prev) => [
      ...prev,
      {
        id: "",
        address_type: "",
        address: "",
        is_default: false,
      },
    ]);
  }, []);

  const removeRow = (index) => {
    if (addressForms.length > 1) {
      const updated = [...addressForms];
      updated.splice(index, 1);
      setAddressForms(updated);
    }
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...addressForms];
    if (field === "is_default" && value === true) {
      updated.forEach((_, i) => {
        updated[i].is_default = i === index;
      });
    } else {
      updated[index][field] = value;
    }
    setAddressForms(updated);
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleProfileSave}
        requiredMark={false}
        className="mt-4"
      >
        <Space
          className="mb-4 w-full justify-between"
          direction="horizontal"
          align="start"
        >
          <div className="flex flex-col items-center gap-2">
            <Avatar
              size={64}
              src={
                avatarPreview ||
                (form.getFieldValue("avatar_photo")
                  ? form.getFieldValue("avatar_photo").startsWith("data:image")
                    ? form.getFieldValue("avatar_photo")
                    : `${imageBaseUrl}${form.getFieldValue("avatar_photo")}`
                  : noImageUrl)
              }
              icon={<UserOutlined />}
            />
            <Upload
              showUploadList={false}
              accept="image/*"
              beforeUpload={(file) => {
                setAvatarFile(file);

                const reader = new FileReader();
                reader.onload = () => {
                  setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);

                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
          </div>

          <Form.Item
            label="Active"
            name="is_active"
            valuePropName="checked"
            className="mb-0"
          >
            <Switch />
          </Form.Item>
        </Space>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label="Firm Name" name="firm_name">
            <Input />
          </Form.Item>
          <Form.Item label="GSTIN" name="gstin">
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Name <span className="text-red-500">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Email <span className="text-red-500">*</span>
              </span>
            }
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Mobile <span className="text-red-500">*</span>
              </span>
            }
            name="mobile"
            rules={[{ required: true, message: "Mobile is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="WhatsApp" name="whatsapp">
            <Input />
          </Form.Item>
        </div>

        <div className="flex justify-between items-center mb-4">
          <strong>Addresses</strong>
          <Button type="dashed" onClick={addRow} icon={<PlusOutlined />}>
            Add Address
          </Button>
        </div>

        {addressForms.map((addr, idx) => (
          <Card
            key={idx}
            size="small"
            className="mb-4"
            title={`Address ${idx + 1}`}
            extra={
              addr.id ? (
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeRow(idx)}
                  disabled={addressForms.length === 1}
                >
                  Delete
                </Button>
              ) : (
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeRow(idx)}
                  disabled={addressForms.length === 1}
                >
                  Remove
                </Button>
              )
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Form.Item label="Address" className="col-span-2">
                <Input.TextArea
                  rows={3}
                  value={addr.address}
                  onChange={(e) =>
                    handleAddressChange(idx, "address", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Address Type" className="col-span-2">
                <Input
                  value={addr.address_type}
                  onChange={(e) =>
                    handleAddressChange(idx, "address_type", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Default">
                <Switch
                  checked={addr.is_default}
                  onChange={(checked) =>
                    handleAddressChange(idx, "is_default", checked)
                  }
                  disabled={
                    !addr.is_default && addressForms.some((a) => a.is_default)
                  }
                />
              </Form.Item>
            </div>
          </Card>
        ))}
        <div className=" mt-6">
          <Form.Item className="text-center mt-6">
            <Button type="primary" htmlType="submit">
              Save Profile
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default UserForm;
