import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Carousel, Image, Popconfirm, Tag } from "antd";
import React from "react";

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
        <mark
          key={index}
          className="bg-[#006666] text-white px-1 py-0.5 rounded not-italic"
          style={{ backgroundColor: "#006666", color: "white" }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const discount =
    offerPrice > 0 && sellingPrice > offerPrice
      ? (sellingPrice - offerPrice).toFixed(2)
      : null;
  return (
    <Card
      hoverable
      className="relative rounded-xl shadow border border-gray-100 transition-all duration-200 hover:shadow-lg"
      styles={{ body: { padding: "0rem" } }}
    >
      {offerPrice > 0 && (
        <div className="absolute left-0 top-5 rotate-[-45deg] bg-red-500 text-white px-4 py-1 text-xs font-bold shadow-md z-10">
          OFFER
        </div>
      )}

      <div
        className="w-full mb-4 relative overflow-hidden rounded-lg"
        style={{ height: "180px" }}
      >
        <Carousel
          autoplay
          autoplaySpeed={2500}
          // dots={false}
          className="w-full h-full"
        >
          {(Array.isArray(subs) && subs.length > 0 ? subs : [null]).map(
            (item, index) => {
              const img =
                typeof item === "string" ? item : item?.product_images ?? null;

              const src = img
                ? imageUrls.userImageBase + img
                : imageUrls.noImage;

              return (
                <div
                  key={index}
                  className="w-full h-[180px] flex items-center justify-center bg-white"
                >
                  <Image
                    src={src}
                    alt={`Product image ${index + 1}`}
                    className="object-cover w-full h-full"
                    // preview={false}
                  />
                </div>
              );
            }
          )}
        </Carousel>
      </div>
      <div className="px-2 mb-2">
        {/* Product Name */}
        <h3 className="text-base font-semibold mb-2 text-[#333] leading-tight">
          {highlightMatch(product_name || "", _match)}
        </h3>

        {/* MRP and Unit */}
        <div className="flex justify-between items-center mb-2 text-sm text-gray-700">
          <div>
            <span className="font-medium mb-0">MRP:</span>{" "}
            {highlightMatch(product_mrp || "", _match)}
          </div>
          <span className="text-gray-600 font-medium bg-[#e6f2f2] px-2 py-0.5 rounded-full">
            {highlightMatch(`${product_unit_value} ${unit_name}`, _match)}
          </span>
        </div>

        {/* Prices */}
        <div className="text-sm text-gray-700 ">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium">Selling:</span>{" "}
              <span
                className={`${
                  offerPrice > 0 ? "line-through text-red-600" : "text-gray-600"
                }`}
              >
                {highlightMatch(product_selling_price || "", _match)}
              </span>
            </div>
            {discount && (
              <span className="text-green-600 font-semibold">-{discount}</span>
            )}
          </div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium">Offer Price:</span>{" "}
              <span className="text-gray-600">
                {offerPrice > 0
                  ? highlightMatch(product_spl_offer_price || "", _match)
                  : "-"}
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <Tag
                color={isActive ? "green" : "red"}
                icon={
                  isActive ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                  )
                }
                className="px-2 py-0.5 rounded-full"
              >
                {isActive ? "Active" : "Inactive"}
              </Tag>

              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(user?.id)}
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
        </div>

        {/* Status + Actions */}
      </div>
    </Card>
  );
};

export default ProductCard;
