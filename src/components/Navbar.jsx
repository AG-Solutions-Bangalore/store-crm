import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown } from "antd";
import useLogout from "../hooks/useLogout";
import { useState } from "react";
import Profile from "../pages/profile/Profile";
import { useNavigate } from "react-router-dom";

export default function Navbar({ collapsed, onToggle }) {
  const [loading, setLoading] = useState(false);
  const logout = useLogout();
  // const [profiledialog, setOpenDialog] = useState(false);
  const naviagte = useNavigate();
  const handleMenuClick = async ({ key }) => {
    if (key === "logout") {
      setLoading(true);
      try {
        await logout();
      } catch (error) {
        console.log("Logout error:", error);
      } finally {
        setLoading(false);
      }
    } else if (key === "profile") {
      naviagte("/user-form");
    } else if (key === "settings") {
      // Navigate to settings page (optional)
    }
  };

  const profileMenu = {
    items: [
      {
        key: "profile",
        label: (
          <div className="flex items-center gap-2 px-2 py-2">
            <UserOutlined className="text-teal-600" />
            <span className="text-gray-800">Profile</span>
          </div>
        ),
      },
      {
        key: "settings",
        label: (
          <div className="flex items-center gap-2 px-2 py-2">
            <SettingOutlined className="text-teal-600" />
            <span className="text-gray-800">Settings</span>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        label: (
          <div className="flex items-center gap-2 px-2 py-2 text-red-600">
            <LogoutOutlined />
            <span>Logout</span>
          </div>
        ),
      },
    ],
    onClick: handleMenuClick,
    className: "min-w-48",
  };

  return (
    <>
      <header className="bg-white h-14 shadow px-4 flex items-center justify-between">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="text-lg"
        />

        <Dropdown menu={profileMenu} placement="bottomRight" arrow>
          <div className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-full hover:bg-gray-100 transition-all">
            <Avatar
              size="large"
              src="https://vetra.laborasyon.com/assets/images/user/man_avatar3.jpg"
            />
          </div>
        </Dropdown>
      </header>
    </>
  );
}
