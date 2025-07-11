import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Form, Input, Space, Switch, Upload } from "antd";
import { useEffect, useState } from "react";
import { PROFILE, UPDATE_PROFILE } from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";

const UserForm = () => {
  const token = usetoken();
  const [form] = Form.useForm();
  const [addressForms, setAddressForms] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [noImageUrl, setNoImageUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const { trigger, loading: loadingProfile } = useApiMutation();
  const [userId, setUserId] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await trigger({
        url: PROFILE,
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data;
      console.log(userData);
      setUserId(userData?.id);
      const imageBase =
        res.image_url.find((i) => i.image_for === "User")?.image_url || "";
      const noImage =
        res.image_url.find((i) => i.image_for === "No Image")?.image_url || "";

      setImageBaseUrl(imageBase);
      setNoImageUrl(noImage);

      form.setFieldsValue({
        ...userData,
        avatar_photo: userData.avatar_photo,
      });

      setAvatarPreview("");

      const mappedAddress =
        res.address?.map((a) => ({
          ...a,
          is_default: a.is_default == "yes",
        })) || [];

      setAddressForms(
        mappedAddress.length
          ? mappedAddress
          : [
              {
                id: null,
                address: "",
                address_type: "",
                is_default: true,
              },
            ]
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
      formData.append(
        "address_data",
        JSON.stringify(
          addressForms.map((addr) => ({
            ...addr,
            is_default: addr.is_default ? "yes" : "no",
          }))
        )
      );

      const base64String = values.avatar_photo;
      if (base64String?.startsWith("data:image")) {
        const res = await fetch(base64String);
        const blob = await res.blob();
        const file = new File([blob], "avatar.jpg", { type: blob.type });
        formData.append("avatar_photo", file);
      }
      console.log(formData);
      const response = await trigger({
        url: `${UPDATE_PROFILE}/${userId}`,
        method: "PUT",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile Updated", response);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...addressForms];
    if (field === "is_default" && value === true) {
      updated.forEach((a, i) => (updated[i].is_default = i === index));
    } else {
      updated[index][field] = value;
    }
    setAddressForms(updated);
  };

  return (
    <Card>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleProfileSave}
        className="mt-4"
        requiredMark={false}
      >
        <Space className="mb-4" direction="horizontal" align="center">
          <Avatar
            size={64}
            src={
              avatarPreview ||
              (form.getFieldValue("avatar_photo")?.startsWith("data:image")
                ? form.getFieldValue("avatar_photo")
                : form.getFieldValue("avatar_photo")
                ? `${imageBaseUrl}${form.getFieldValue("avatar_photo")}`
                : noImageUrl)
            }
            icon={<UserOutlined />}
          />

          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Upload
            showUploadList={false}
            accept="image/*"
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64Image = reader.result;
                form.setFieldsValue({ avatar_photo: base64Image });
                setAvatarPreview(base64Image);
              };
              reader.readAsDataURL(file);
              return false; // prevent upload
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </Upload>
        </Space>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label="Firm Name" name="firm_name" className="mb-0">
            <Input />
          </Form.Item>

          <Form.Item label="GSTIN" name="gstin" className="mb-0">
            <Input />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Name <span className="text-red-500">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: "name is required" }]}
            className="mb-0"
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
            rules={[{ required: true, message: "email is required" }]}
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
            rules={[{ required: true, message: "mobile is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="WhatsApp" name="whatsapp">
            <Input />
          </Form.Item>
        </div>

        <div className="flex justify-between items-center">
          Addresses
          <Form.Item className="mb-4">
            <Button
              type="dashed"
              onClick={() =>
                setAddressForms([
                  ...addressForms,
                  {
                    id: null,
                    address: "",
                    address_type: "",
                    is_default: false,
                  },
                ])
              }
              icon="+"
            >
              Add Address
            </Button>
          </Form.Item>
        </div>

        {addressForms.map((addr, idx) => (
          <Card
            key={idx}
            size="small"
            className="mb-4"
            title={`Address ${idx + 1}`}
            extra={
              <Button
                danger
                size="small"
                disabled={addressForms.length === 1}
                onClick={() => {
                  const updated = [...addressForms];
                  updated.splice(idx, 1);
                  setAddressForms(updated);
                }}
              >
                {addr.id ? "Delete" : "Remove"}
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Form.Item
                label="Address"
                className="col-span-2"
                style={{ marginBottom: 0 }}
              >
                <Input.TextArea
                  rows={3}
                  value={addr.address}
                  onChange={(e) =>
                    handleAddressChange(idx, "address", e.target.value)
                  }
                />
              </Form.Item>

              <Form.Item
                label="Address Type"
                className="col-span-2"
                style={{ marginBottom: 0 }}
              >
                <Input
                  value={addr.address_type}
                  onChange={(e) =>
                    handleAddressChange(idx, "address_type", e.target.value)
                  }
                />
              </Form.Item>

              <Form.Item label="Default" style={{ marginBottom: 0 }}>
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

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit">
            Save Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserForm;
