import React from "react";
import useFinalUserImage from "../common/Logo";
import {
  MailOutlined,
  PhoneOutlined,
  BarcodeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
const OrderViewHeader = () => {
  const finalUserImage = useFinalUserImage();

  return (
    <div className="grid grid-cols-3 gap-4 max-w-4xl text-sm">
      {/* Left: Image */}
      <div className="w-full h-auto flex-shrink-0">
        <img
          src={finalUserImage}
          alt="User"
          className="object-cover rounded"
        />
      </div>

      {/* Right: Info */}
      <div className="col-span-2">
        <h1 className="text-3xl font-semibold text-gray-800">Lohiya Kitchen</h1>

        <div className="mt-2 flex flex-row text-gray-700 space-y-1">
          <div className="flex items-center gap-2">
            <MailOutlined className="text-[16px] text-[#1c8fc7]" />
            <span className="font-medium">lohiya@example.com</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-[16px] text-[#1c8fc7]" />
            <span className="font-medium">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2">
            <BarcodeOutlined className="text-[16px] text-[#1c8fc7]" />
            <span className="font-medium">27AABCU9603R1Z2</span>
          </div>
          <div className="flex items-center gap-2">
            <IdcardOutlined className="text-[16px] text-[#1c8fc7]" />
            <span className="font-medium">AABCU9603R</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderViewHeader;
