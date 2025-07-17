// components/forms/ProfileForm.jsx
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Form, Input, Space, Switch, Upload } from "antd";
import { useEffect } from "react";

const ProfileForm = ({
  type,
  form,
  initialValues = {},
  onSubmit,
  title,
  imageBaseUrl,
  noImageUrl,
  setAvatarFile,
  avatarPreview,
  setAvatarPreview,
  addressForms,
  onAddressChange,
  onAddAddress,
  onRemoveAddress,
  loading = false,
}) => {
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues]);

  const handleFinish = (values) => {
    onSubmit?.(values);
  };
  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        className="mt-4"
      >
        {type == "updateprofile" ? (
          <Space className="mb-4 w-full justify-between" direction="horizontal">
            {/* {type == "createuser" ? (
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#006666]">
                    Create User
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar
                    size={64}
                    src={
                      avatarPreview ||
                      (initialValues.avatar_photo
                        ? initialValues.avatar_photo.startsWith("data:image")
                          ? initialValues.avatar_photo
                          : `${imageBaseUrl}${initialValues.avatar_photo}`
                        : noImageUrl)
                    }
                    icon={<UserOutlined />}
                    className="bg-[#006666] flex-shrink-0"
                  />

                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={(file) => {
                      setAvatarFile(file);
                      const reader = new FileReader();
                      reader.onload = () => setAvatarPreview(reader.result);
                      reader.readAsDataURL(file);
                      return false; // prevent auto-upload
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                  </Upload>
                </div>
              </div>
            ) : ( */}
            <>
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  size={64}
                  src={
                    avatarPreview ||
                    (initialValues.avatar_photo
                      ? initialValues.avatar_photo.startsWith("data:image")
                        ? initialValues.avatar_photo
                        : `${imageBaseUrl}${initialValues.avatar_photo}`
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
                    reader.onload = () => setAvatarPreview(reader.result);
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
              >
                <Switch />
              </Form.Item>
            </>
            {/* )} */}
          </Space>
        ) : (
          <Space className="mb-4 w-full justify-between" direction="horizontal">
            <div>
              <h2 className="text-2xl font-bold text-[#006666]">
                {title || ""}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Avatar
                size={64}
                src={
                  avatarPreview ||
                  (initialValues.avatar_photo
                    ? initialValues.avatar_photo.startsWith("data:image")
                      ? initialValues.avatar_photo
                      : `${imageBaseUrl}${initialValues.avatar_photo}`
                    : noImageUrl)
                }
                icon={<UserOutlined />}
                className="bg-[#006666] flex-shrink-0"
              />

              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={(file) => {
                  setAvatarFile(file);
                  const reader = new FileReader();
                  reader.onload = () => setAvatarPreview(reader.result);
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>
            </div>
          </Space>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            name="mobile"
            label={
              <span>
                Mobile <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Mobile is required" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item
            label="WhatsApp"
            name="whatsapp"
            rules={[
              {
                pattern: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit whatsaap number",
              },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          {/* {type != "updateprofile" && (
            <Form.Item
              name="user_type"
              label={
                <span>
                  User type <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Please select a user type" }]}
            >
              <Select placeholder="Select user type">
                <Select.Option value="1">User</Select.Option>
                <Select.Option value="2">Security</Select.Option>
                <Select.Option value="3">Staff</Select.Option>
                <Select.Option value="4">Delivery</Select.Option>
              </Select>
            </Form.Item>
          )} */}
        </div>

        <div className="flex justify-between items-center mb-4">
          <strong>Addresses</strong>
          <Button type="dashed" onClick={onAddAddress} icon={<PlusOutlined />}>
            Add Address
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          {addressForms.map((addr, idx) => (
            <Card
              key={idx}
              size="small"
              className="space-y-3"
              title={`Address ${idx + 1}`}
              extra={
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => onRemoveAddress(idx)}
                  disabled={addressForms.length === 1}
                >
                  Remove
                </Button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ">
                <Form.Item label="Address" className="col-span-2">
                  <Input.TextArea
                    rows={3}
                    value={addr.address}
                    onChange={(e) =>
                      onAddressChange(idx, "address", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Address Type" className="col-span-2">
                  <Input
                    value={addr.address_type}
                    onChange={(e) =>
                      onAddressChange(idx, "address_type", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Default">
                  <Switch
                    checked={addr.is_default}
                    onChange={(checked) =>
                      onAddressChange(idx, "is_default", checked)
                    }
                    disabled={
                      !addr.is_default && addressForms.some((a) => a.is_default)
                    }
                  />
                </Form.Item>
              </div>
            </Card>
          ))}
        </div>
        <div className=" mt-6">
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default ProfileForm;
