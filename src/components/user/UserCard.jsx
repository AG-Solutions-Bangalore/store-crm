// import {
//   CheckCircleTwoTone,
//   CloseCircleTwoTone,
//   EditOutlined,
//   EyeInvisibleOutlined,
//   EyeOutlined,
//   MailOutlined,
//   PhoneOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { Avatar, Button, Card, Popconfirm, Tag, Tooltip } from "antd";

// const UserCard = ({ user, onToggleStatus, onEdit, onView, imageUrls }) => {
//   const highlightMatch = (text, match) => {
//     if (!match || !text) return text;
//     const regex = new RegExp(`(${match})`, "gi");
//     return text.split(regex).map((part, index) =>
//       part.toLowerCase() === match.toLowerCase() ? (
//         <mark
//           key={index}
//           className="bg-[#006666] text-white px-1 py-0.5 rounded not-italic"
//           style={{ backgroundColor: "#006666", color: "white" }}
//         >
//           {part}
//         </mark>
//       ) : (
//         part
//       )
//     );
//   };

//   const isActive = user.is_active === "true" || user.is_active === true;
//   const avatarSrc = user.avatar_photo
//     ? imageUrls.userImageBase + user.avatar_photo
//     : imageUrls.noImage;

//   return (
//     <Card
//       hoverable
//       className="rounded-2xl shadow-md border border-gray-100  transition-all duration-200 hover:shadow-lg"
//       styles={{ body: { padding: "0.75rem" } }}
//     >
//       <div className="flex gap-4 items-start mb-3">
//         <Avatar
//           size={64}
//           src={avatarSrc}
//           icon={<UserOutlined />}
//           className="bg-[#006666] flex-shrink-0"
//         />

//         <div className="flex-1 min-w-0">
//           <div className="flex justify-end items-start mb-1">
//             <Tag
//               color={isActive ? "green" : "red"}
//               icon={
//                 isActive ? (
//                   <CheckCircleTwoTone twoToneColor="#52c41a" />
//                 ) : (
//                   <CloseCircleTwoTone twoToneColor="#ff4d4f" />
//                 )
//               }
//               className="rounded-full px-2 py-0.5 text-xs"
//             >
//               {isActive ? "Active" : "Inactive"}
//             </Tag>

//             <div className="flex gap-2">
//               <Tooltip title="Edit User">
//                 <Button
//                   type="primary"
//                   icon={<EditOutlined />}
//                   onClick={() => onEdit(user)}
//                   className="bg-[#006666]"
//                   size="small"
//                 />
//               </Tooltip>
//               <Popconfirm
//                 title={`Mark user as ${isActive ? "Inactive" : "Active"}?`}
//                 onConfirm={() => onToggleStatus(user)}
//                 okText="Yes"
//                 cancelText="No"
//               >
//                 <Tooltip title={isActive ? "Deactivate" : "Activate"}>
//                   <Button
//                     type="default"
//                     size="small"
//                     icon={isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
//                   />
//                 </Tooltip>
//               </Popconfirm>
//             </div>
//           </div>

//           {/* Firm Name */}
//           <Tooltip title={user.firm_name}>
//             <h3 className="text-md font-semibold truncate text-[#006666]">
//               {highlightMatch(user.firm_name || "", user._match)}
//             </h3>
//           </Tooltip>
//         </div>
//       </div>

//       {/* Email Row */}
//       <div className="text-sm text-gray-700">
//         <p className="flex items-center gap-2">
//           <UserOutlined className="text-gray-400" />
//           <span className="truncate">
//             {highlightMatch(user.name || "", user._match)}
//           </span>
//         </p>
//         <p className="flex items-center gap-2 truncate ">
//           <PhoneOutlined className="text-gray-400" rotate={110} />
//           {/* <Tooltip title={user.mobile}> */}
//           <a href={`tel:${user.mobile}`}>
//             <span className="text-gray-700">
//               {highlightMatch(user.mobile || "", user._match)}
//             </span>
//           </a>
//           {/* </Tooltip> */}
//         </p>

//         <p className="flex items-center gap-2 truncate">
//           <MailOutlined className="text-gray-400" />
//           <Tooltip title={user.email}>
//             <span className="truncate">
//               {highlightMatch(user.email || "", user._match)}
//             </span>
//           </Tooltip>
//         </p>
//       </div>
//     </Card>
//   );
// };

// export default UserCard;
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import STTable from "../STTable/STTable";

const UserTable = ({ users, onToggleStatus, onEdit, imageUrls, type }) => {
  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark
          key={index}
          className="bg-[#006666] text-white px-1 rounded"
          style={{ backgroundColor: "#006666", color: "white" }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar_photo",
      key: "avatar",
      render: (_, user) => (
        <div className="flex justify-center">
          <Avatar
            size={38}
            src={
              user.avatar_photo
                ? imageUrls.userImageBase + user.avatar_photo
                : imageUrls.noImage
            }
            icon={<UserOutlined />}
          />
        </div>
      ),
    },
    ...(type === "user"
      ? [
          {
            title: "Firm Name",
            dataIndex: "firm_name",
            key: "firm_name",
            render: (_, user) => (
              <span className="font-semibold text-[#006666]">
                {highlightMatch(user.firm_name, user._match)}
              </span>
            ),
          },
        ]
      : []),

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, user) => highlightMatch(user.name, user._match),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (_, user) => (
        <a href={`tel:${user.mobile}`}>
          {highlightMatch(user.mobile, user._match)}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, user) => (
        <Tooltip title={user.email}>
          {highlightMatch(user.email, user._match)}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (_, user) => {
        const isActive = user.is_active === "true" || user.is_active === true;
        return (
          <div className="flex justify-center">
            <Popconfirm
              title={`Mark user as ${isActive ? "Inactive" : "Active"}?`}
              onConfirm={() => onToggleStatus(user)}
              okText="Yes"
              cancelText="No"
              className="cursor-pointer"
            >
              <Tag
                color={isActive ? "green" : "red"}
                // icon={
                //   isActive ? (
                //     <CheckCircleTwoTone twoToneColor="#52c41a" />
                //   ) : (
                //     <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                //   )
                // }
                icon={isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              >
                {isActive ? "Active" : "Inactive"}
              </Tag>
            </Popconfirm>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => {
        return (
          <Space>
            <Tooltip title="Edit User">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(user)}
                className="bg-[#006666]"
              />
            </Tooltip>
          </Space>
        );
      },
      width: 130,
    },
  ];

  return (
    // <Table
    //   rowKey="id"
    //   dataSource={users}
    //   columns={columns}
    //   pagination={{ pageSize: 10 }}
    //   scroll={{ x: "max-content" }}
    //   bordered
    //   size="small"
    // />
    <STTable data={users} columns={columns} />
  );
};

export default UserTable;
