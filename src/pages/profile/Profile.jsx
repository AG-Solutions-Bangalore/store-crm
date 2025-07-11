import {
  Modal,
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  Spin,
  Switch,
  Avatar,
  Space,
  Card,
  Divider,
} from "antd";
import { PROFILE } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useEffect, useState } from "react";
import usetoken from "../../api/usetoken";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TabPane } = Tabs;

const Profile = ({ setOpenDialog, profiledialog }) => {
  const token = usetoken();
  const [form] = Form.useForm();
  const [addressForms, setAddressForms] = useState([]);
  const [profileData, setProfileData] = useState(null);

  const { trigger, loading: loadingProfile } = useApiMutation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await trigger({
          url: PROFILE,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(res?.data);
        form.setFieldsValue(res?.data);
        setAddressForms(res?.data?.address_data || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (profiledialog) fetchProfile();
  }, [profiledialog]);

  const handleProfileSave = (values) => {
    const payload = {
      ...values,
      address_data: addressForms,
    };
    console.log("Updated Profile:", payload);
    // You can send this payload using trigger()
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...addressForms];
    updated[index][field] = value;
    setAddressForms(updated);
  };

  const handlePasswordChange = (values) => {
    console.log("Password Change Submitted:", values);
  };

  return (
    <Card>
      <div className="py-2">
        <Tabs defaultActiveKey="1" centered>
          {/* Profile Tab */}
          <TabPane tab="Profile" key="1">
            {loadingProfile ? (
              <div className="text-center my-8">
                <Spin />
              </div>
            ) : (
              <Form
                layout="vertical"
                form={form}
                onFinish={handleProfileSave}
                className="mt-4"
              >
                <Space className="mb-4" direction="horizontal" align="center">
                  <Avatar
                    size={64}
                    src={form.getFieldValue("avatar_photo")}
                    icon={<UserOutlined />}
                  />
                  <Form.Item
                    name="avatar_photo"
                    label="Avatar URL"
                    className="mb-0"
                  >
                    <Input placeholder="https://example.com/avatar.jpg" />
                  </Form.Item>
                </Space>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Form.Item label="Firm Name" name="firm_name">
                    <Input />
                  </Form.Item>

                  <Form.Item label="GSTIN" name="gstin">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Name" name="name">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Email" name="email">
                    <Input type="email" />
                  </Form.Item>

                  <Form.Item label="Mobile" name="mobile">
                    <Input />
                  </Form.Item>

                  <Form.Item label="WhatsApp" name="whatsapp">
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Is Active"
                    name="is_active"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </div>

                <Divider orientation="left">Addresses</Divider>
                {addressForms.map((addr, idx) => (
                  <Card
                    key={idx}
                    size="small"
                    className="mb-4"
                    title={`Address ${idx + 1}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Address Type"
                        value={addr.address_type}
                        onChange={(e) =>
                          handleAddressChange(
                            idx,
                            "address_type",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="Address"
                        value={addr.address}
                        onChange={(e) =>
                          handleAddressChange(idx, "address", e.target.value)
                        }
                      />
                      <div>
                        <span className="mr-2">Is Default:</span>
                        <Switch
                          checked={addr.is_default}
                          onChange={(checked) =>
                            handleAddressChange(idx, "is_default", checked)
                          }
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Form.Item className="text-center mt-6">
                  <Button type="primary" htmlType="submit">
                    Save Profile
                  </Button>
                </Form.Item>
              </Form>
            )}
          </TabPane>

          {/* Change Password Tab */}
          <TabPane tab="Change Password" key="2">
            <Form
              layout="vertical"
              onFinish={handlePasswordChange}
              className="mt-4"
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  { required: true, message: "Please enter current password" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter new password" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Passwords do not match");
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className="text-center">
                <Button type="primary" htmlType="submit">
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default Profile;
