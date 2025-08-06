import { PrinterOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { IdCard, LocateIcon, Mail, MapPin, Phone, Pin } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToWords } from 'to-words';


import useFinalUserImage from "../../components/common/Logo";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useSelector } from "react-redux";
import useToken from "../../api/usetoken";
import moment from "moment";

const OrderView = () => {
  const { orderid: orderId } = useParams();
  const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: { 
        name: 'Rupee',
        plural: 'Rupees',
        symbol: '₹',
        fractionalUnit: {
          name: 'Paisa',
          plural: 'Paise',
          symbol: '',
        },
      }
    }
  });
  const token = useToken();
  const finalUserImage = useFinalUserImage();
  const companyDetails = useSelector((state) => state?.company?.companyDetails);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderRef = useRef(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `http://lohiyakitchen.com/storeapi/public/api/order/${orderId}`
       ,{
        headers: { Authorization: `Bearer ${token}` },
       } );
        setOrderData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const calculateTotal = () => {
    if (!orderData?.subs) return 0;
    return orderData.subs.reduce((sum, item) => {
      return sum + parseFloat(item.product_price) * parseInt(item.product_qnty);
    }, 0);
  };

  const subtotal = calculateTotal();
  const discount = parseFloat(orderData?.discount_amount || 0);
  const deliveryCharges = parseFloat(orderData?.delivery_charges || 0);
  const grandTotal = subtotal - discount + deliveryCharges;

  const handleOrderCopy = useReactToPrint({
    content: () => orderRef.current,
    documentTitle: "order-copy",
    pageStyle: `
      @page {
        size: auto;
        margin: 1mm;
      }
      @media print {
        body {
          margin: 0;
          padding: 2mm;
        }
        .print-hide {
          display: none;
        }
      }
    `,
  });
  const grandTotalInWords = toWords.convert(grandTotal);

  if (loading) return (
     <div className="flex justify-center py-20">
                <Spin size="large" />
              </div>
  );
  if (error) return <div>Error: {error}</div>;
  if (!orderData) return <div>No order data found</div>;

  return (
    <>
      <Button
        type="default"
        shape="circle"
        icon={<PrinterOutlined />}
        onClick={handleOrderCopy}
        className="print-hide"
      />
      <div ref={orderRef}>
        <div className="relative bg-white max-w-5xl mx-auto p-6 border print:border-none border-gray-400 rounded-none space-y-8">
          <div className="absolute right-4 top-4 bg-blue-100 text-blue-800 font-semibold text-xs px-3 py-1 rounded-lg  border border-blue-300">
            Order Copy
          </div>

          {/* Header with logo and company info */}
          <div className="flex gap-6 items-center border-b border-gray-400 rounded-bl-lg">
            <div className="w-32 h-32 flex-shrink-0 border-t border-l border-r  border-gray-400 rounded-lg overflow-hidden">
              <img
                src={finalUserImage}
                alt="User"
                className="object-contain w-full h-full p-2 bg-white"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-800">
                {companyDetails?.store_name}
              </h1>
              <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 text-gray-700">
               <div className="flex flex-row items-center justify-between" >
               <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 " />
                  <span className="font-medium">
                    {companyDetails?.support_email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 " />
                  <span className="font-medium">
                    {companyDetails?.support_phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 " />
                  <span className="font-medium">
                    {companyDetails?.support_whatsapp}
                  </span>
                </div>
               </div>


                <div className="flex items-center gap-2  ">
                  <MapPin className="w-4 h-4 " />
                  <span className="font-medium">
                    {companyDetails?.store_address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order info */}
          <div className="flex justify-between">
            <div className="">
              <div className="text-gray-700 ">
                <p className="font-medium pb-0 ">{orderData.company_name}</p>
                <p>Phone: {orderData.mobile_no}</p>
                <p className="w-96 break-words">Address: {orderData.delivery_address}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-gray-700">
                <p>
                  Date: {moment(orderData.order_date).format('DD-MMM-YYYY')}
                </p>
                <p>Order #: {orderData.order_ref_number}</p>
              </div>
            </div>
          </div>

          {/* Order items table */}
          <div className="border-b border-gray-400 pb-2">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-400">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Qty</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.subs.map((item) => (
                  <tr key={item.id} className="">
                    <td className="px-4 py-2">
                      {item.product_names?.product_name}&nbsp;-&nbsp;<span className="text-xs">{item?.product_names?.product_unit_value} {item.product_names?.unit_name}</span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      ₹{item.product_price}
                    </td>
                    <td className="px-4 py-2 text-right">{item.product_qnty} </td>
                    <td className="px-4 py-2 text-right">
                      ₹{(
                        parseFloat(item.product_price) *
                        parseInt(item.product_qnty)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-between border-b border-gray-400 pb-1">
            <div>
              <p className="font-medium">Amount in words:</p>
              <div className="grid grid-cols-1 ">
              <p className="text-gray-700 ">
  {grandTotalInWords}
</p>

                <span className="text-xs mt-8 ">
                  *All Prices are including Gst
                </span>
              </div>
            </div>

            <div className="w-64">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Discount:</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Delivery Charges:</span>
                <span>₹{deliveryCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-t font-semibold">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery and signature */}
          <div className="flex justify-between pt-4">
            <div className="w-1/2">
              <h3 className="font-semibold">Delivery Instructions:</h3>
              <p className="text-gray-700">{orderData.delivery_instructions}</p>
            </div>

            <div className="w-1/2 text-right">
              <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-400 inline-block px-8">
                <p className="font-medium">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderView;