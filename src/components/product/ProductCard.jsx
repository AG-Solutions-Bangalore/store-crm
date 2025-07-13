import React from "react";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Carousel, Image, Popconfirm, Tag } from "antd";

const ProductCard = ({ user, onToggleStatus, onEdit, imageUrls }) => {
  const {
    id,
    product_name,
    product_unit_value,
    unit_name,
    is_active,
    _match,
    product_mrp,
    product_selling_price,
    product_spl_offer_price,
    subs,
  } = user;

  const isActive = is_active == "true";
  const offerPrice = parseFloat(product_spl_offer_price);
  const sellingPrice = parseFloat(product_selling_price);

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

  // Calculate discount if offer exists and is less than selling price
  const discount =
    offerPrice > 0 && sellingPrice > offerPrice
      ? (sellingPrice - offerPrice).toFixed(2)
      : null;

  return (
    <Card
      hoverable
      className="relative rounded-2xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg"
      bodyStyle={{ padding: "1rem" }}
    >
      {offerPrice > 0 && (
        <Tag
          color="red"
          className="absolute top-0 left-0 font-bold text-sm rounded-full"
        >
          Offer
        </Tag>
      )}
      <div className="flex justify-center mb-4">
        <Carousel autoplay autoplaySpeed={2000} className="w-[200px] h-[100px]">
          {(Array.isArray(subs) && subs.length > 0 ? subs : [null]).map(
            (item, index) => {
              const img =
                typeof item === "string" ? item : item?.product_images ?? null;

              const src = img
                ? imageUrls.userImageBase + img
                : imageUrls.noImage;

              return (
                <div key={index} className="flex justify-center items-center">
                  <Image
                    src={src}
                    alt={`Product image ${index + 1}`}
                    width={200}
                    height={100}
                    className="rounded object-cover border"
                  />
                </div>
              );
            }
          )}
        </Carousel>
      </div>

      <div className="flex items-center mb-4">
        <span className="py-1 font-bold">
          {highlightMatch(product_name || "", _match)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <p className="flex items-center gap-2">
          <span className="font-medium">MRP:</span>
          {highlightMatch(product_mrp || "", _match)}
        </p>
        <span className="text-gray-600 font-medium bg-[#e6f2f2] px-3 py-1 rounded-full">
          {highlightMatch(`${product_unit_value} ${unit_name} ` || "", _match)}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-700 space-y-1 flex justify-between">
        <p>
          <span className="font-medium">Selling Price:</span>{" "}
          <span
            className={`${
              offerPrice > 0 ? "line-through text-red-600" : "text-gray-600"
            }`}
          >
            {highlightMatch(product_selling_price || "", _match)}
          </span>
          {/* Show discount if offer */}
          {discount && (
            <span className="ml-2 text-green-600 font-semibold">
              {discount}
            </span>
          )}
        </p>
        <p>
          <span className="font-medium">Offer Price:</span>{" "}
          <span className="text-gray-600">
            {offerPrice > 0
              ? highlightMatch(product_spl_offer_price || "", _match)
              : "-"}
          </span>
        </p>
      </div>

      <div className="flex gap-2 items-center mt-4">
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
    </Card>
  );
};

export default ProductCard;
