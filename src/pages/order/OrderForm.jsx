import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { App, Button, Card, DatePicker, Form, Input, Select, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ADDRESS_BY_ID,
  CUSTOMER_LIST,
  FETCH_PRODUCTLIST,
  GUEST_USER_ORDER_BY_ID,
  ORDER_LIST,
  ORDER_STATUS,
} from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";
const OrderForm = () => {
  const { message } = App.useApp();
  const token = usetoken();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { trigger: FetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: SubmitTrigger, loading: submitloading } = useApiMutation();
  const [form] = Form.useForm();
  const [addressData, setAddressData] = useState([]);
  const navigate = useNavigate();
  const [ProductData, setProductData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [ordersstatus, setOrdersSatus] = useState([]);

  const [ProductForms, setProductForms] = useState([
    {
      id: "",
      product_id: "",
      product_qnty: "",
      order_sub_status: false,
    },
  ]);
  const fetchProductData = async () => {
    try {
      const productRes = await FetchTrigger({
        url: FETCH_PRODUCTLIST,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (productRes?.data) {
        setProductData(productRes.data);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };

  const fetchuserData = async () => {
    try {
      const productRes = await FetchTrigger({
        url: CUSTOMER_LIST,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (productRes?.data) {
        setUserData(productRes.data);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };
  const fetchOrderStatus = async () => {
    const res = await FetchTrigger({
      url: `${ORDER_STATUS}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.code === 201) {
      const responseData = res.data;

      setOrdersSatus(responseData || []);
    }
  };
  useEffect(() => {
    fetchProductData();
    fetchuserData();
    fetchOrderStatus();
  }, []);

  const fetchOrder = async () => {
    const res = await FetchTrigger({
      url: `${ORDER_LIST}/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("res",res?.data)
    if (!res || !res.data) return;

    const guestUser = res.data ;
    console.log("guest",guestUser)
    const order = res.order ?? {};
    const orderSubs = res?.data?.subs ?? [];

    
    setOrderData(order);
    if (guestUser?.user_id) {
      await handleUserChange(guestUser?.user_id);
    }

    const processedSubs = Array.isArray(orderSubs)
      ? orderSubs.map((p) => ({
          id: p.id || "",
          product_id: p.product_id || "",
          product_price: parseFloat(p.product_price) || 0,
          product_qnty: parseFloat(p.product_qnty) || 0,
          order_sub_status: p.order_sub_status || false,
        }))
      : [];

    form.setFieldsValue({
      // firm_name: guestUser.company_name || "",
      // gstin: guestUser.gstin || "",
      // name: guestUser.name || "",
      // mobile: guestUser.mobile || "",
      // whatsapp: guestUser.whatsapp || "",
      // email: guestUser.email || "",
      // address: guestUser.address || "",

      order_date: guestUser.order_date ? dayjs(order.order_date) : null,
      user_id: guestUser.user_id || "",
      delivery_address_id: guestUser?.delivery_address_id || "",
      delivery_instructions: guestUser.delivery_instructions || "",
      order_status: guestUser.order_status || false,
      delivery_charges: guestUser.delivery_charges
        ? parseFloat(guestUser.delivery_charges)
        : 0,
      discount_amount: guestUser.discount_amount
        ? parseFloat(guestUser.discount_amount)
        : 0,

      subs: processedSubs,
    });

    setProductForms(processedSubs);
  };

  useEffect(() => {
    if (isEditMode) fetchOrder();
  }, [id]);

  const handleUserChange = async (userId) => {
    form.setFieldsValue({ delivery_address_id: undefined });
    if (!userId) {
      setAddressData([]);
      return;
    }

    try {
      const res = await FetchTrigger({
        url: `${ADDRESS_BY_ID}/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res?.data) {
        setAddressData(res.data);
      }
      if (isEditMode) {
        console.log(orderData, "id dd");
        const matchedAddress = res.data.find(
          (addr) => addr.id == orderData?.delivery_address_id
        );

        if (matchedAddress) {
          form.setFieldsValue({
            delivery_address_id: matchedAddress.id,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch address data:", err);
      message.error("Failed to load address.");
      setAddressData([]);
    }
  };
  const handleProductChange = (index, field, value) => {
    const updatedForms = [...ProductForms];
    updatedForms[index][field] = value;

    setProductForms(updatedForms);
  };

  const addRow = () => {
    setProductForms((prev) => [
      ...prev,
      {
        id: "",
        product_id: "",
        product_qnty: "",
        order_sub_status: false,
      },
    ]);
  };

  const removeRow = (index) => {
    if (ProductForms.length > 1) {
      const updated = [...ProductForms];
      updated.splice(index, 1);
      setProductForms(updated);
    }
  };

  const handleSubmit = async (values) => {
    const subs = ProductForms || [];
    let hasValidSub = false;
    let hasInvalidSub = false;
    // let hasDefault = false;
    subs.forEach((sub) => {
      const { product_id, product_qnty, order_sub_status } = sub;

      const isFilled =
        product_id?.toString().trim() && product_qnty?.toString().trim();

      const isEmpty =
        !product_id?.toString().trim() && product_qnty?.toString().trim();

      if (isFilled) {
        hasValidSub = true;

        // if (isEditMode && order_sub_status === true) {
        //   hasDefault = true;
        // }
      } else if (!isEmpty) {
        hasInvalidSub = true;
      }
    });

    if (!hasValidSub) {
      message.error("At least one valid product row is required.");
      return;
    }

    if (hasInvalidSub) {
      message.error(
        "Some product rows are partially filled. Please complete or remove them."
      );
      return;
    }

    try {
      // const formData = new FormData();
      // formData.append(
      //   "order_date",
      //   values.order_date ? dayjs(values.order_date).format("YYYY-MM-DD") : ""
      // );

      // formData.append("user_id", values.user_id || "");
      // formData.append("delivery_address_id", values.delivery_address_id || "");
      // formData.append(
      //   "delivery_instructions",
      //   values.delivery_instructions || ""
      // );
      // formData.append("delivery_charges", values.delivery_charges || "");
      // formData.append("discount_amount", values.discount_amount || "");

      // if (isEditMode) {
      //   formData.append("order_status", values.order_status);
      // }

      // subs.forEach((item, index) => {
      //   formData.append(`subs[${index}][id]`, item.id);
      //   formData.append(`subs[${index}][product_id]`, item.product_id);
      //   formData.append(
      //     `subs[${index}][product_qnty]`,
      //     Number(item.product_qnty)
      //   );

      //   if (isEditMode) {
      //     formData.append(
      //       `subs[${index}][order_sub_status]`,
      //       item.order_sub_status
      //     );
      //   }
      // });
      const payload = {
        order_date: values.order_date
          ? dayjs(values.order_date).format("YYYY-MM-DD")
          : "",
        user_id: values.user_id || "",
        delivery_address_id: values.delivery_address_id || "",
        delivery_instructions: values.delivery_instructions || "",
        delivery_charges: values.delivery_charges || "",
        discount_amount: values.discount_amount || "",
        subs: subs.map((item) => {
          const subItem = {
            id: item.id,
            product_id: item.product_id,
            product_qnty: Number(item.product_qnty),
          };
      
          if (isEditMode) {
            subItem.order_sub_status = item.order_sub_status;
          }
      
          return subItem;
        }),
      };
      
      if (isEditMode) {
        payload.order_status = values.order_status;
      }
      
      const res = await SubmitTrigger({
        url: isEditMode ? `${ORDER_LIST}/${id}` : ORDER_LIST,
        method: isEditMode ? "put" : "post",
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,

        },
      });
      if (res.code == 201) {
        message.success(
          res.message ||
            `Order ${isEditMode ? "updated" : "created"} successfully!`
        );
        navigate("/order");
      } else {
        message.error(res.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      message.error(err.response.data.message || `Failed to ${isEditMode ? "update" : "create"} order.`);
    }
  };

  return (
    <>
      {fetchloading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            className="mt-4"
          >
            <div className="flex items-center gap-3 mb-4 ">
              <div
                className="bg-[#e6f2f2] rounded-full p-2 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <ArrowLeftOutlined style={{ color: "#006666" }} />
              </div>
              <h2 className="text-2xl font-bold text-[#006666] mb-0">
                {isEditMode ? "Edit" : "Create"} Order
              </h2>
            </div>
            <div
              className={"grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5"}
            >
              {/* Order Date */}
              <Form.Item
                label={
                  <span>
                    Order Date <span className="text-red-500">*</span>
                  </span>
                }
                name="order_date"
                rules={[
                  { required: true, message: "Please select order date" },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" className="w-full" />
              </Form.Item>

              {/* User */}
              <Form.Item
                name="user_id"
                label={
                  <span>
                    User <span className="text-red-500">*</span>
                  </span>
                }
                rules={[{ required: true, message: "Please select a User" }]}
              >
                <Select
                  placeholder="Select User"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={handleUserChange}
                >
                  {UserData.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.firm_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Address */}
              <Form.Item
                name="delivery_address_id"
                label={
                  <span>
                    Address <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Please select an address" },
                ]}
              >
                <Select
                  placeholder="Select Address"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {addressData.map((addr) => (
                    <Select.Option key={addr.id} value={addr.id}>
                      {addr.address_type} - {addr.address}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Delivery Charge"
                name="delivery_charges"
                rules={[
                  {
                    pattern: /^\d*\.?\d{0,2}$/,
                    message: "Enter a valid charge (e.g. 23.5)",
                  },
                ]}
              >
                <Input
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Tab",
                      "ArrowLeft",
                      "ArrowRight",
                      "Delete",
                      ".",
                    ];
                    const isCtrlCombo = e.ctrlKey || e.metaKey;

                    if (
                      allowedKeys.includes(e.key) ||
                      isCtrlCombo ||
                      /^[0-9]$/.test(e.key)
                    ) {
                      return;
                    }

                    e.preventDefault();
                  }}
                  maxLength={8}
                />
              </Form.Item>

              <Form.Item
                label="Discount Amount"
                name="discount_amount"
                rules={[
                  {
                    pattern: /^\d*\.?\d{0,2}$/,
                    message: "Enter a valid amount (e.g. 23.5)",
                  },
                ]}
              >
                <Input
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Tab",
                      "ArrowLeft",
                      "ArrowRight",
                      "Delete",
                      ".",
                    ];
                    const isCtrlCombo = e.ctrlKey || e.metaKey;

                    if (
                      allowedKeys.includes(e.key) ||
                      isCtrlCombo ||
                      /^[0-9]$/.test(e.key)
                    ) {
                      return;
                    }

                    e.preventDefault();
                  }}
                  maxLength={8}
                />
              </Form.Item>

              {isEditMode && (
                <Form.Item label="Status" name="order_status">
                  <Select placeholder="Select Status" allowClear>
                    {ordersstatus.map((status) => (
                      <Option key={status.id} value={status.status}>
                        <span className="capitalize">{status.status}</span>{" "}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                label="Delivery Instruction"
                name="delivery_instructions"
                className={`${isEditMode ? "col-span-1 md:col-span-4":" col-span-1 md:col-span-5"}`}
              >
                <Input.TextArea rows={3} maxLength={200} />
              </Form.Item>

              {/* Order Status (Only in Edit Mode) */}

          
            </div>

            <div className="flex justify-between items-center mb-4">
              <strong>Order</strong>
              <Button type="dashed" onClick={addRow} icon={<PlusOutlined />}>
                Add Order
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {ProductForms.map((addr, idx) => (
                <Card
                  key={idx}
                  size="small"
                  className="space-y-3"
                  title={`Order ${idx + 1}`}
                  extra={
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeRow(idx)}
                      disabled={ProductForms.length === 1}
                    >
                      Remove
                    </Button>
                  }
                >
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 ${
                      isEditMode ? "lg:grid-cols-3" : "lg:grid-cols-2"
                    } gap-4`}
                  >
                    <Form.Item
                      name={["subs", idx, "product_id"]}
                      label={
                        <span>
                          Product <span className="text-red-500">*</span>
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please select a product",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Product"
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          option?.children
                            ?.toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        value={addr.product_id}
                        onChange={(value) =>
                          handleProductChange(idx, "product_id", value)
                        }
                      >
                        {ProductData.map((cat) => (
                          <Select.Option key={cat.id} value={cat.id}>
                            {cat.product_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Quantity"
                      name={["subs", idx, "product_qnty"]}
                      rules={[
                        {
                          pattern: /^\d*\.?\d{0,2}$/,
                          message: "Enter a valid quantity (e.g. 23.5)",
                        },
                      ]}
                    >
                      <Input
                        value={addr.product_qnty}
                        onChange={(e) =>
                          handleProductChange(
                            idx,
                            "product_qnty",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          const allowedKeys = [
                            "Backspace",
                            "Tab",
                            "ArrowLeft",
                            "ArrowRight",
                            "Delete",
                            ".",
                          ];
                          const isCtrlCombo = e.ctrlKey || e.metaKey;

                          if (
                            allowedKeys.includes(e.key) ||
                            isCtrlCombo ||
                            /^[0-9]$/.test(e.key)
                          ) {
                            return;
                          }

                          e.preventDefault();
                        }}
                        maxLength={4}
                      />
                    </Form.Item>
                    {isEditMode && (
                      <Form.Item label="Status">
                        <Select
                          placeholder="Select Status"
                          allowClear
                          value={addr.order_sub_status}
                          onChange={(value) =>
                            handleProductChange(idx, "order_sub_status", value)
                          }
                        >
                          <Select.Option value="pending">Pending</Select.Option>
                          <Select.Option value="completed">
                            Completed
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className=" mt-6">
              <Form.Item className="text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitloading}
                  style={{ marginRight: 8 }}
                >
                  {isEditMode ? "Update" : "Submit"}
                </Button>
                <Button danger type="default" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      )}
    </>
  );
};

export default OrderForm;
