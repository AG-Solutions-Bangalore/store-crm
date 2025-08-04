import { PrinterOutlined } from "@ant-design/icons";
import { Button } from "antd";
import printJS from "print-js";
import OrderViewHeader from "../../components/order/OrderViewHeader";
const OrderView = () => {
  const handlePrint = () => {
    printJS({
      printable: "printable-section",
      type: "html",
      targetStyles: ["*"],
    });
  };
  return (
    <>
      <Button
        type="default"
        shape="circle"
        icon={<PrinterOutlined />}
        onClick={handlePrint}
      />
      <div
        className="flex justify-center items-center border border-black"
        id="printable-section"
      >
        <div>
          <OrderViewHeader />
        </div>
      </div>
    </>
  );
};

export default OrderView;
