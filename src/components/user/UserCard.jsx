import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  IdcardOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Popconfirm, Tag, Tooltip } from "antd";
const getUserTypeColor = (type) => {
  const map = {
    1: "blue",
    2: "orange",
    3: "purple",
    4: "cyan",
  };
  return map[Number(type)] || "default";
};

const getUserTypeLabel = (type) => {
  const userTypeMap = {
    1: "User",
    2: "Security",
    3: "Staff",
    4: "Delivery",
  };

  return userTypeMap[type] || "Unknown";
};

const UserCard = ({ user, onToggleStatus, onEdit, onView, imageUrls }) => {
  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const isActive = user.is_active === "true";
  const avatarSrc = user.avatar_photo
    ? imageUrls.userImageBase + user.avatar_photo
    : imageUrls.noImage;
  return (
    <Card
      hoverable
      className="rounded-2xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg"
      bodyStyle={{ padding: "1.25rem" }}
    >
      <div className="flex items-center gap-4">
        <Avatar
          size={64}
          icon={<UserOutlined />}
          src={avatarSrc}
          className="bg-[#006666] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <Tooltip title={user.name}>
            <h3 className="text-lg font-semibold truncate text-[#006666]">
              {highlightMatch(user.name, user._match)}
            </h3>
          </Tooltip>
          <p className="text-sm text-gray-600 truncate flex items-center gap-1">
            <PhoneOutlined className="text-gray-400" />
            {highlightMatch(user.mobile, user._match)}
          </p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 space-y-1">
        <p className="flex items-center gap-2">
          <IdcardOutlined className="text-gray-400" />
          <span className="font-medium">User Type:</span>
          <Tag color={getUserTypeColor(user.user_type)}>
            {highlightMatch(getUserTypeLabel(user.user_type), user._match)}
          </Tag>
        </p>
        <p>
          <span className="font-medium">Firm Name:</span>{" "}
          <span className="text-gray-600">
            {highlightMatch(user.firm_name || "", user._match)}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          {isActive ? (
            <Tag
              color="green"
              icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
              className="px-2 py-0.5 rounded-full"
            >
              Active
            </Tag>
          ) : (
            <Tag
              color="red"
              icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
              className="px-2 py-0.5 rounded-full"
            >
              Inactive
            </Tag>
          )}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(user)}
            className="bg-[#006666] w-full"
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title={`Mark user as ${isActive ? "Inactive" : "Active"}?`}
            onConfirm={() => onToggleStatus(user)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="dashed"
              block
              size="small"
              icon={isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            >
              {isActive ? "Set Inactive" : "Set Active"}
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};
export default UserCard;
