import {
  AppstoreOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Alert, Menu } from "antd";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import { useNavigate } from "react-router-dom";

const getMenuItems = (collapsed) => {
  if (collapsed) {
    return [
      { key: "/user", icon: <PieChartOutlined />, label: "User" },
      { key: "/category", icon: <DesktopOutlined />, label: "Category" },
      { key: "/product", icon: <ContainerOutlined />, label: "Products" },
      {
        key: "sub1",
        icon: <MailOutlined />,
        label: "Navigation One",
        children: [
          { key: "5", label: "Option 5" },
          { key: "6", label: "Option 6" },
          { key: "7", label: "Option 7" },
          { key: "8", label: "Option 8" },
        ],
      },
    ];
  }

  return [
    {
      type: "group",
      label: "Dashboard",
      children: [
        { key: "/user", icon: <PieChartOutlined />, label: "User" },
        { key: "/category", icon: <DesktopOutlined />, label: "Category" },
        { key: "/product", icon: <DesktopOutlined />, label: "Product" },
      ],
    },
    {
      type: "group",
      label: "Management",
      children: [
        { key: "3", icon: <ContainerOutlined />, label: "Projects" },
        {
          key: "sub1",
          label: "Navigation One",
          icon: <MailOutlined />,
          children: [
            { key: "5", label: "Option 5" },
            { key: "6", label: "Option 6" },
            { key: "7", label: "Option 7" },
            { key: "8", label: "Option 8" },
          ],
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
  return (
    <motion.aside
      initial={{ width: collapsed ? 80 : 260 }}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-white shadow-xl rounded-r-2xl overflow-hidden flex flex-col font-[Inter] transition-all duration-300
        ${isMobile ? "fixed z-50 h-screen" : "relative"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 bg-[#006666] text-white">
        <motion.img
          src="https://vetra.laborasyon.com/assets/images/logo-light.svg"
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

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#006666] py-2">
        <Menu
          mode="inline"
          inlineCollapsed={delayedCollapse}
          items={items}
          selectedKeys={selectedKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={({ key }) => {
            setSelectedKeys([key]);
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
