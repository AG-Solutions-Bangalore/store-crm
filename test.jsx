import { Modal, Typography, Tabs, Form, Input, Button, Spin } from "antd";
import { PROFILE } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useEffect, useState } from "react";
import usetoken from "../../api/usetoken";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile = ({ setOpenDialog, profiledialog }) => {
  const token = usetoken();
  const [form] = Form.useForm();
  const { trigger, loading: loadingProfile } = useApiMutation();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await trigger({
          url: PROFILE,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(res);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (profiledialog) fetchProfile();
  }, [profiledialog]);

  const handlePasswordChange = (values) => {
    console.log("Password Change Submitted:", values);
  };

  return (
    <Modal
      open={profiledialog}
      closable={false}
      footer={null}
      centered
      maskClosable={false}
      onCancel={() => setOpenDialog(false)}
    >
      <div className="py-2">
        <Tabs defaultActiveKey="1" centered>
          {/* Profile Tab */}
          <TabPane tab="Profile" key="1">
            {loadingProfile ? (
              <div className="text-center my-8">
                <Spin />
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Title level={4}>User Profile</Title>
                <Text strong>Name:</Text> <Text>{profileData?.name}</Text>
                <br />
                <Text strong>Email:</Text> <Text>{profileData?.email}</Text>
                <br />
                <Text strong>Role:</Text> <Text>{profileData?.role}</Text>
              </div>
            )}
          </TabPane>

          <TabPane tab="Change Password" key="2">
            <Form
              layout="vertical"
              form={form}
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
                <Input.Password placeholder="Enter current password" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter new password" },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
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
                <Input.Password placeholder="Confirm new password" />
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
    </Modal>
  );
};

export default Profile;
