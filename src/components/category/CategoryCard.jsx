import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, Popconfirm, Tag } from "antd";

const CategoryCard = ({ user, onToggleStatus, onEdit, imageUrls }) => {
  const {
    id,
    category_name,
    category_image,
    category_sort_order,
    is_active,
    _match,
  } = user;

  const isActive = is_active === "true";

  const avatarSrc = category_image
    ? imageUrls.userImageBase + category_image
    : imageUrls.noImage;

  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark key={index} className="bg-[#006666] px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card
      hoverable
      className="rounded-2xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg"
      bodyStyle={{ padding: "1rem" }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600 font-medium bg-[#e6f2f2] px-3 py-1 rounded-full">
          {highlightMatch(category_sort_order || "", _match)}
        </span>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(id)}
            className="bg-[#006666]"
          />
          <Popconfirm
            title={`Mark user as ${isActive ? "Inactive" : "Active"}?`}
            onConfirm={() => onToggleStatus(user)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="dashed"
              size="small"
              icon={isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            />
          </Popconfirm>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <Image
          width={200}
          height={100}
          src={avatarSrc}
          alt="Category"
          className="rounded object-cover border"
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-semibold text-base">
          {highlightMatch(category_name || "", _match)}
        </span>

        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
