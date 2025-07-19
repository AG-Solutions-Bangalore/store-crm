import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ADDRESS_BY_ID,
  FETCH_PRODUCTLIST,
  GUEST_USER_ORDER_BY_ID,
  ORDER_LIST,
  USER_BY_ID,
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
  const naviagte = useNavigate();
  const [ProductData, setProductData] = useState([]);
  const [UserData, setUserData] = useState([]);

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
        url: `${USER_BY_ID}/6`,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (productRes?.data) {
        setUserData(productRes.data);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };
  const fetchData = async () => {
    try {
      const productRes = await FetchTrigger({
        url: `${ADDRESS_BY_ID}/6`,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (productRes?.data) {
        setAddressData(productRes.data);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProductData();
    fetchuserData();
  }, []);

  const fetchProfile = async () => {
    const res = await FetchTrigger({
      url: `${GUEST_USER_ORDER_BY_ID}/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res || !res.data) return;

    const guestUser = res.data?.[0] ?? {};
    const order = res.order ?? {};
    const orderSubs = res.orderSub ?? [];

    // Format subs
    const processedSubs = Array.isArray(orderSubs)
      ? orderSubs.map((p) => ({
          id: p.id || "",
          product_id: p.product_id || "",
          product_price: parseFloat(p.product_price) || 0,
          product_qnty: parseFloat(p.product_qnty) || 0,
          order_sub_status: p.order_sub_status || false,
        }))
      : [];

    // Set form values
    form.setFieldsValue({
      // Guest user fields
      firm_name: guestUser.firm_name || "",
      gstin: guestUser.gstin || "",
      name: guestUser.name || "",
      mobile: guestUser.mobile || "",
      whatsapp: guestUser.whatsapp || "",
      email: guestUser.email || "",
      address: guestUser.address || "",

      // Order fields
      order_date: order.order_date ? dayjs(order.order_date) : null,
      delivery_instructions: order.delivery_instructions || "",
      order_status: order.order_status || false,
      delivery_charges: order.delivery_charges
        ? parseFloat(order.delivery_charges)
        : 0,
      discount_amount: order.discount_amount
        ? parseFloat(order.discount_amount)
        : 0,

      // Order items
      subs: processedSubs,
    });

    setProductForms(processedSubs);
  };
  useEffect(() => {
    if (isEditMode) fetchProfile();
  }, [id]);

  const handleProductChange = (index, field, value) => {
    const updatedForms = [...ProductForms];
    updatedForms[index][field] = value;

    if (field === "product_id") {
      const selectedProduct = addressData.find((prod) => prod.id === value);

      if (selectedProduct) {
        const price =
          Number(selectedProduct.product_selling_price) !== 0
            ? Number(selectedProduct.product_selling_price)
            : Number(selectedProduct.product_spl_offer_price) !== 0
            ? Number(selectedProduct.product_spl_offer_price)
            : Number(selectedProduct.product_mrp);

        updatedForms[index].product_price = price;

        // ✅ Update AntD Form value as well
        form.setFieldsValue({
          subs: {
            [index]: {
              product_price: price,
            },
          },
        });
      }
    }

    setProductForms(updatedForms);
  };

  const addRow = () => {
    setProductForms((prev) => [
      ...prev,
      { id: "", product_id, product_qnty, is_default: false },
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
    let hasDefault = false;

    subs.forEach((sub) => {
      const { product_id, product_qnty, order_sub_status } = sub;

      const isFilled =
        product_id?.toString().trim() && product_qnty?.toString().trim();

      const isEmpty =
        !product_id?.toString().trim() && product_qnty?.toString().trim();

      if (isFilled) {
        hasValidSub = true;

        if (isEditMode && order_sub_status === true) {
          hasDefault = true;
        }
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
      const formData = new FormData();
      formData.append(
        "order_date",
        values.order_date ? dayjs(values.order_date).format("YYYY-MM-DD") : ""
      );

      formData.append("user_id", values.user_id || "");
      formData.append("delivery_address_id", values.delivery_address_id || "");
      formData.append(
        "delivery_instructions",
        values.delivery_instructions || ""
      );
      formData.append("delivery_charges", values.delivery_charges || "");
      formData.append("discount_amount", values.discount_amount || "");

      if (isEditMode) {
        formData.append("order_status", values.order_status);
      }

      subs.forEach((item, index) => {
        formData.append(`subs[${index}][id]`, item.id);
        formData.append(`subs[${index}][product_id]`, item.product_id);
        formData.append(
          `subs[${index}][product_qnty]`,
          Number(item.product_qnty)
        );

        if (isEditMode) {
          formData.append(
            `subs[${index}][order_sub_status]`,
            item.order_sub_status
          );
        }
      });

      const res = await SubmitTrigger({
        url: isEditMode ? `${ORDER_LIST}/${id}` : ORDER_LIST,
        method: isEditMode ? "put" : "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      if (res.code == 201) {
        message.success(
          res.message ||
            `Order ${isEditMode ? "updated" : "created"} successfully!`
        );
        naviagte("/order");
      } else {
        message.error(res.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      message.error(`Failed to ${isEditMode ? "update" : "create"} order.`);
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
            <Space
              className="mb-4 w-full justify-between"
              direction="horizontal"
            >
              <div>
                <h2 className="text-2xl font-bold text-[#006666]">
                  {isEditMode ? "Update" : "Create"} Order
                </h2>
              </div>
            </Space>

            <div
              className={`grid gap-4 ${
                isEditMode
                  ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {" "}
              <>
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
{/* 
                <Form.Item
                  name="user_id"
                  label={
                    <span>
                      User <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select a User",
                    },
                  ]}
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
                  >
                    {UserData.map((cat) => (
                      <Select.Option key={cat.id} value={cat.id}>
                        {cat.address}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item> */}
                <Form.Item
                  name="delivery_address_id"
                  label={
                    <span>
                      Address <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select a address",
                    },
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
                    {addressData.map((cat) => (
                      <Select.Option key={cat.id} value={cat.id}>
                        {cat.address}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Delivery Instruction"
                  name="delivery_instructions"
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Delivery Charge" name="delivery_charges">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Discount Amount"
                  name="discount_amount"
                  rules={[
                    {
                      pattern: /^[0-9]+$/,
                      message: "Enter a valid numeric amount",
                    },
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </>
              {isEditMode && (
                <Form.Item label="Status" name="order_status">
                  <Select placeholder="Select Status" allowClear>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item label="Address" className="md:col-span-4">
                <Input.TextArea rows={3} />
              </Form.Item>
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
                      isEditMode ? "lg:grid-cols-4" : "lg:grid-cols-3"
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
                          pattern: /^[0-9]+$/,
                          message: "Enter a valid numeric amount",
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
                >
                  {isEditMode ? "Update" : "Submit"}
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
