import {
  ArrowRightOutlined,
  BarChartOutlined,
  BellOutlined,
  CarOutlined,
  CloseOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  MessageOutlined,
  PictureOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Menu } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo-1.png";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import useFinalUserImage from "./common/Logo";

const getMenuItems = (collapsed) => {
  const dashboardItems = [
    { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "/category", icon: <TagsOutlined />, label: "Category" },
    { key: "/product", icon: <ShoppingOutlined />, label: "Products" },
  ];
  const generalItems = [
    { key: "/user", icon: <UserOutlined />, label: "App User" },
    { key: "/guest-user", icon: <UserOutlined />, label: "Guest User" },
    { key: "/order", icon: <ShoppingCartOutlined />, label: "Order" },
    {
      key: "/guest-user-order",
      icon: <ShoppingCartOutlined />,
      label: "Guest Order",
    },
  ];

  const managementChildren = [
    { key: "/security", icon: <LockOutlined />, label: "Security" },
    { key: "/staff", icon: <SolutionOutlined />, label: "Staff" },
    { key: "/delivery", icon: <CarOutlined />, label: "Delivery" },
  ];

  const otherItems = [
    { key: "/slider", icon: <PictureOutlined />, label: "Slider" },
    { key: "/notification", icon: <BellOutlined />, label: "Notification" },
    {
      key: "/website-enquiry",
      icon: <MessageOutlined />,
      label: "Website Enquiry",
    },
  ];
  const reportItemsChildren = [
    {
      key: "/report-category",
      icon: <ProfileOutlined />,
      label: "Category Report",
    },
    { key: "/report-order", icon: <ProfileOutlined />, label: "Order Report" },
  ];

  if (collapsed) {
    return [
      ...dashboardItems,
      ...generalItems,
      {
        key: "sub1",
        icon: <MailOutlined />,
        label: "Management",
        children: managementChildren,
      },
      ...otherItems,
      {
        key: "sub2",
        icon: <BarChartOutlined />,
        label: "Report",
        children: reportItemsChildren,
      },
    ];
  }

  return [
    {
      type: "group",
      label: "Dashboard",
      children: dashboardItems,
    },
    {
      type: "group",
      label: "General",
      children: generalItems,
    },
    {
      type: "group",
      label: "Management",
      children: [
        {
          key: "sub1",
          icon: <MailOutlined />,
          label: "Management",
          children: managementChildren,
        },
      ],
    },

    {
      type: "group",
      label: "Others",
      children: otherItems,
    },
    {
      type: "group",
      label: "Report",
      children: [
        {
          key: "sub2",
          icon: <BarChartOutlined />,
          label: "Report",
          children: reportItemsChildren,
        },
      ],
    },
  ];
};

export default function Sidebar({ collapsed, isMobile = false, onClose }) {
  const [selectedKeys, setSelectedKeys] = useState([""]);
  const [openKeys, setOpenKeys] = useState([""]);
  const naviagte = useNavigate();
  const items = getMenuItems(collapsed);
  const dispatch = useDispatch();
  const finalUserImage = useFinalUserImage();
  const [delayedCollapse, setDelayedCollapse] = useState(collapsed);
  const localVersion = useSelector((state) => state.auth?.version);
  const serverVersion = useSelector((state) => state?.version?.version);
  const showDialog = localVersion !== serverVersion ? true : false;
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedCollapse(collapsed);
    }, 150);

    return () => clearTimeout(timeout);
  }, [collapsed]);

  const handleOpenDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: true,
        version: serverVersion,
      })
    );
  };
  const rootSubmenuKeys = ["sub1", "sub2"];

  return (
    <motion.aside
      initial={{ width: collapsed ? 95 : 260 }}
      animate={{ width: collapsed ? 95 : 260 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-white shadow-xl rounded-r-2xl overflow-hidden flex flex-col font-[Inter] transition-all duration-300
        ${isMobile ? "fixed z-50 h-screen" : "relative"}`}
    >
      {/* Header bg-[#006666]*/}
      <div className="flex items-center justify-center h-14 px-4 bg-[#e6f2f2]">
        <motion.img
          src={collapsed ? logo1 : finalUserImage}
          alt="Logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`object-contain transition-all duration-300 ${
            collapsed ? "w-8" : "w-28"
          }`}
        />

        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors"
          >
            <CloseOutlined className="text-xl" />
          </motion.button>
        )}
      </div>

      <div className="flex-1  py-2 scrollbar-custom">
        <Menu
          mode="inline"
          inlineCollapsed={delayedCollapse}
          items={items}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          // onOpenChange={(keys) => setOpenKeys(keys)}
          onOpenChange={(keys) => {
            const latestOpenKey = keys.find(
              (key) => openKeys.indexOf(key) === -1
            );
            if (rootSubmenuKeys.includes(latestOpenKey)) {
              setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            } else {
              setOpenKeys(keys);
            }
          }}
          // onClick={({ key }) => {
          //   setSelectedKeys([key]);
          //   naviagte(key);
          // }}
          onClick={({ key, keyPath }) => {
            setSelectedKeys([key]);
            if (isMobile && onClose) {
              onClose();
            }
            if (keyPath.length === 1) {
              setOpenKeys([]);
            }

            naviagte(key);
          }}
          className="custom-menu"
        />
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500 p-3 text-center border-t border-[#006666] bg-[#e6f2f2]"
        >
          {showDialog ? (
            <div
              className="w-full cursor-pointer animate-pulse"
              onClick={handleOpenDialog}
            >
              <Alert
                message={
                  <div className="flex items-center justify-center text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      New Updated: V{localVersion}
                      <ArrowRightOutlined />V{serverVersion}
                    </span>
                  </div>
                }
                type="info"
                showIcon={false}
                banner
                className="rounded-md bg-blue-50 text-blue-800 border-blue-100 px-4 py-1 text-center"
              />
            </div>
          ) : (
            <Alert
              message={
                <div className="flex items-center justify-center text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    Version: {localVersion}
                  </span>
                </div>
              }
              type="info"
              showIcon={false}
              banner
              className="rounded-md"
            />
          )}
        </motion.div>
      )}
    </motion.aside>
  );
}
