// import {
//   ArrowRightOutlined,
//   CloseOutlined,
//   AppstoreOutlined,
//   HomeOutlined,
//   TagsOutlined,
//   ShoppingOutlined,
//   TeamOutlined,
//   LockOutlined,
//   SolutionOutlined,
//   CarOutlined,
//   PictureOutlined,
//   BellOutlined,
//   ShoppingCartOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { Alert, Menu } from "antd";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import logo1 from "../assets/logo-1.png";
// import logo from "../assets/logo-black.png";
// import { setShowUpdateDialog } from "../store/auth/versionSlice";
// const getMenuItems = (collapsed) => {
//   if (collapsed) {
//     return [
//       // { key: "/user", icon: <PieChartOutlined />, label: "User" },
//       { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
//       { key: "/category", icon: <ContainerOutlined />, label: "Category" },
//       { key: "/product", icon: <ProductOutlined />, label: "Products" },
//       // {
//       //   type: "group",
//       //   label: "Management",
//       //   children: [
//       //     {
//       //       key: "sub1",
//       //       icon: <MailOutlined />,
//       //       label: "Management",
//       //       children: [
//       //         { key: "/user", label: "User" },
//       //         { key: "/security", label: "Security" },
//       //         { key: "/staff", label: "Staff" },
//       //         { key: "/delivery", label: "Delivery" },
//       //       ],
//       //     },
//       //   ],
//       // },
//       {
//         key: "sub1",
//         icon: <MailOutlined />,
//         label: "Management",
//         children: [
//           { key: "/user", label: "User" },
//           { key: "/security", label: "Security" },
//           { key: "/staff", label: "Staff" },
//           { key: "/delivery", label: "Delivery" },
//         ],
//       },
//       { key: "/slider", icon: <ContainerOutlined />, label: "Slider" },
//       {
//         key: "/notification",
//         icon: <NotificationOutlined />,
//         label: "Notification",
//       },
//       {
//         key: "/order",
//         icon: <ContainerOutlined />,
//         label: "Order",
//       },
//       {
//         key: "/guest-user",
//         icon: <ContainerOutlined />,
//         label: "Guest User",
//       },
//       {
//         key: "/guest-user-order",
//         icon: <ContainerOutlined />,
//         label: "Guest Order",
//       },
//     ];
//   }

//   return [
//     {
//       type: "group",
//       label: "Dashboard",
//       children: [
//         { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
//         { key: "/category", icon: <ContainerOutlined />, label: "Category" },
//         { key: "/product", icon: <ProductOutlined />, label: "Products" },
//       ],
//     },
//     {
//       type: "group",
//       label: "Management",
//       children: [
//         {
//           key: "sub1",
//           icon: <MailOutlined />,
//           label: "Management",
//           children: [
//             { key: "/user", label: "User" },
//             { key: "/security", label: "Security" },
//             { key: "/staff", label: "Staff" },
//             { key: "/delivery", label: "Delivery" },
//           ],
//         },
//       ],
//     },
//     { key: "/slider", icon: <ContainerOutlined />, label: "Slider" },

//     {
//       key: "/notification",
//       icon: <NotificationOutlined />,
//       label: "Notification",
//     },
//     {
//       key: "/order",
//       icon: <ContainerOutlined />,
//       label: "Order",
//     },
//     {
//       key: "/guest-user",
//       icon: <ContainerOutlined />,
//       label: "Guest User",
//     },
//     {
//       key: "/guest-user-order",
//       icon: <ContainerOutlined />,
//       label: "Guest Order",
//     },
//   ];
// };

// export default function Sidebar({ collapsed, isMobile = false, onClose }) {
//   const [selectedKeys, setSelectedKeys] = useState([""]);
//   const [openKeys, setOpenKeys] = useState([""]);
//   const naviagte = useNavigate();
//   const items = getMenuItems(collapsed);
//   const dispatch = useDispatch();
//   const [delayedCollapse, setDelayedCollapse] = useState(collapsed);
//   const localVersion = useSelector((state) => state.auth?.version);
//   const serverVersion = useSelector((state) => state?.version?.version);
//   const showDialog = localVersion !== serverVersion ? true : false;
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setDelayedCollapse(collapsed);
//     }, 150);

//     return () => clearTimeout(timeout);
//   }, [collapsed]);

//   const handleOpenDialog = () => {
//     dispatch(
//       setShowUpdateDialog({
//         showUpdateDialog: true,
//         version: serverVersion,
//       })
//     );
//   };
//   return (
//     <motion.aside
//       initial={{ width: collapsed ? 80 : 260 }}
//       animate={{ width: collapsed ? 80 : 260 }}
//       transition={{ duration: 0.3 }}
//       className={`h-full bg-white shadow-xl rounded-r-2xl overflow-hidden flex flex-col font-[Inter] transition-all duration-300
//         ${isMobile ? "fixed z-50 h-screen" : "relative"}`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-center h-14 px-4 bg-[#006666]">
//         <motion.img
//           src={collapsed ? logo1 : logo}
//           alt="Logo"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className={`object-contain transition-all duration-300 ${
//             collapsed ? "w-8" : "w-28"
//           }`}
//         />

//         {isMobile && (
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             onClick={onClose}
//             className="text-white hover:text-red-300 transition-colors"
//           >
//             <CloseOutlined className="text-xl" />
//           </motion.button>
//         )}
//       </div>

//       <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#006666] py-2">
//         <Menu
//           mode="inline"
//           inlineCollapsed={delayedCollapse}
//           items={items}
//           openKeys={openKeys}
//           selectedKeys={selectedKeys}
//           onOpenChange={(keys) => setOpenKeys(keys)}
//           // onClick={({ key }) => {
//           //   setSelectedKeys([key]);
//           //   naviagte(key);
//           // }}
//           onClick={({ key, keyPath }) => {
//             setSelectedKeys([key]);
//             if (isMobile && onClose) {
//               onClose();
//             }
//             if (keyPath.length === 1) {
//               setOpenKeys([]);
//             }

//             naviagte(key);
//           }}
//           className="custom-menu"
//         />
//       </div>

//       {!collapsed && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="text-xs text-gray-500 p-3 text-center border-t border-[#006666] bg-[#e6f2f2]"
//         >
//           {showDialog ? (
//             <div
//               className="w-full cursor-pointer animate-pulse"
//               onClick={handleOpenDialog}
//             >
//               <Alert
//                 message={
//                   <div className="flex items-center justify-center text-xs font-semibold">
//                     <span className="flex items-center gap-1">
//                       New Updated: V{localVersion}
//                       <ArrowRightOutlined />V{serverVersion}
//                     </span>
//                   </div>
//                 }
//                 type="info"
//                 showIcon={false}
//                 banner
//                 className="rounded-md bg-blue-50 text-blue-800 border-blue-100 px-4 py-1 text-center"
//               />
//             </div>
//           ) : (
//             <Alert
//               message={
//                 <div className="flex items-center justify-center text-xs font-semibold">
//                   <span className="flex items-center gap-1">
//                     Version: {localVersion}
//                   </span>
//                 </div>
//               }
//               type="info"
//               showIcon={false}
//               banner
//               className="rounded-md"
//             />
//           )}
//         </motion.div>
//       )}
//     </motion.aside>
//   );
// }
import {
  ArrowRightOutlined,
  CloseOutlined,
  AppstoreOutlined,
  HomeOutlined,
  TagsOutlined,
  ShoppingOutlined,
  TeamOutlined,
  LockOutlined,
  SolutionOutlined,
  CarOutlined,
  PictureOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ContainerOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Alert, Menu } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo-1.png";
import logo from "../assets/logo-black.png";
import { setShowUpdateDialog } from "../store/auth/versionSlice";

// const getMenuItems = (collapsed) => [
//   {
//     key: "/home",
//     icon: <HomeOutlined />,
//     label: "Dashboard",
//   },
//   {
//     key: "/category",
//     icon: <TagsOutlined />,
//     label: "Categories",
//   },
//   {
//     key: "/product",
//     icon: <ShoppingOutlined />,
//     label: "Products",
//   },
//   {
//     key: "management",
//     icon: <TeamOutlined />,
//     label: "Management",

//     children: [
//       {
//         key: "/user",
//         icon: <UserOutlined />,
//         label: "Users",
//       },
//       {
//         key: "/security",
//         icon: <LockOutlined />,
//         label: "Security",
//       },
//       {
//         key: "/staff",
//         icon: <SolutionOutlined />,
//         label: "Staff",
//       },
//       {
//         key: "/delivery",
//         icon: <CarOutlined />,
//         label: "Delivery",
//       },
//     ],
//   },
//   {
//     key: "/slider",
//     icon: <PictureOutlined />,
//     label: "Sliders",
//   },
//   {
//     key: "/notification",
//     icon: <BellOutlined />,
//     label: "Notifications",
//   },
//   {
//     key: "/order",
//     icon: <ShoppingCartOutlined />,
//     label: "Orders",
//   },
//   {
//     key: "/guest-user",
//     icon: <UserOutlined />,
//     label: "Guest Users",
//   },
//   {
//     key: "/guest-user-order",
//     icon: <ShoppingCartOutlined />,
//     label: "Guest Orders",
//   },
// ];

const getMenuItems = (collapsed) => {
  if (collapsed) {
    return [
      // { key: "/user", icon: <PieChartOutlined />, label: "User" },
      { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
      { key: "/category", icon: <ContainerOutlined />, label: "Category" },
      { key: "/product", icon: <ProductOutlined />, label: "Products" },
      // {
      //   type: "group",
      //   label: "Management",
      //   children: [
      //     {
      //       key: "sub1",
      //       icon: <MailOutlined />,
      //       label: "Management",
      //       children: [
      //         { key: "/user", label: "User" },
      //         { key: "/security", label: "Security" },
      //         { key: "/staff", label: "Staff" },
      //         { key: "/delivery", label: "Delivery" },
      //       ],
      //     },
      //   ],
      // },
      {
        key: "sub1",
        icon: <MailOutlined />,
        label: "Management",
        children: [
          { key: "/user", label: "User" },
          { key: "/security", label: "Security" },
          { key: "/staff", label: "Staff" },
          { key: "/delivery", label: "Delivery" },
        ],
      },
      { key: "/slider", icon: <ContainerOutlined />, label: "Slider" },
      {
        key: "/notification",
        icon: <NotificationOutlined />,
        label: "Notification",
      },
      {
        key: "/order",
        icon: <ContainerOutlined />,
        label: "Order",
      },
      {
        key: "/guest-user",
        icon: <ContainerOutlined />,
        label: "Guest User",
      },
      {
        key: "/guest-user-order",
        icon: <ContainerOutlined />,
        label: "Guest Order",
      },
    ];
  }

  return [
    {
      type: "group",
      label: "Dashboard",
      children: [
        { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
        { key: "/category", icon: <ContainerOutlined />, label: "Category" },
        { key: "/product", icon: <ProductOutlined />, label: "Products" },
      ],
    },
    {
      type: "group",
      label: "Management",
      children: [
        {
          key: "sub1",
          icon: <MailOutlined />,
          label: "Management",
          children: [
            { key: "/user", label: "User" },
            { key: "/security", label: "Security" },
            { key: "/staff", label: "Staff" },
            { key: "/delivery", label: "Delivery" },
          ],
        },
      ],
    },
    { key: "/slider", icon: <ContainerOutlined />, label: "Slider" },

    {
      key: "/notification",
      icon: <NotificationOutlined />,
      label: "Notification",
    },
    {
      key: "/order",
      icon: <ContainerOutlined />,
      label: "Order",
    },
    {
      key: "/guest-user",
      icon: <ContainerOutlined />,
      label: "Guest User",
    },
    {
      key: "/guest-user-order",
      icon: <ContainerOutlined />,
      label: "Guest Order",
    },
  ];
};

export default function Sidebar({ collapsed, isMobile = false, onClose }) {
  const [selectedKeys, setSelectedKeys] = useState([""]);
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();
  const items = getMenuItems(collapsed);
  const dispatch = useDispatch();
  const [delayedCollapse, setDelayedCollapse] = useState(collapsed);
  const localVersion = useSelector((state) => state.auth?.version);
  const serverVersion = useSelector((state) => state?.version?.version);
  const showDialog = localVersion !== serverVersion;

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

  const handleClick = ({ key, keyPath }) => {
    setSelectedKeys([key]);

    if (isMobile && onClose) {
      onClose(); // Close drawer on mobile for both root & submenu
    }

    // Collapse submenu if main item
    if (keyPath.length === 1) {
      setOpenKeys([]);
    }

    navigate(key);
  };

  return (
    <motion.aside
      initial={{ width: collapsed ? 80 : 260 }}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-white shadow-xl rounded-r-2xl overflow-hidden flex flex-col font-[Inter] transition-all duration-300 ${
        isMobile ? "fixed z-50 h-screen" : "relative"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center ${
          isMobile ? "justify-between" : "justify-center"
        } h-14 px-4 bg-[#006666]`}
      >
        <motion.img
          src={collapsed ? logo1 : logo}
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
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={handleClick}
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


