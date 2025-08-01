import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FETCH_PRODUCTLIST,
  GUEST_USER_ORDER_BY_ID,
  GUEST_USER_ORDER_CREATE,
  GUEST_USER_ORDER_UPDATE,
  ORDER_STATUS,
} from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";
import dayjs from "dayjs";
const GuestUserOrderForm = () => {
  const { message } = App.useApp();
  const token = usetoken();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { trigger: FetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: SubmitTrigger, loading: submitloading } = useApiMutation();
  const [form] = Form.useForm();
  const [ProductData, setProductData] = useState([]);
  const naviagte = useNavigate();
  const [ordersstatus, setOrdersSatus] = useState([]);
  const [ProductForms, setProductForms] = useState([
    {
      id: "",
      product_id: "",
      product_price: "",
      product_qnty: "",
      order_sub_status: false,
    },
  ]);
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

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
    fetchOrderStatus();
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
      const selectedProduct = ProductData.find((prod) => prod.id === value);

      if (selectedProduct) {
        const price =
          Number(selectedProduct.product_selling_price) !== 0
            ? Number(selectedProduct.product_selling_price)
            : Number(selectedProduct.product_spl_offer_price) !== 0
            ? Number(selectedProduct.product_spl_offer_price)
            : Number(selectedProduct.product_mrp);

        updatedForms[index].product_price = price;

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
      {
        id: "",
        product_id: "",
        product_price: "",
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
      const { product_id, product_price, product_qnty, order_sub_status } = sub;

      const isFilled =
        product_id?.toString().trim() &&
        product_price?.toString().trim() &&
        product_qnty?.toString().trim();

      const isEmpty =
        !product_id?.toString().trim() &&
        !product_price?.toString().trim() &&
        !product_qnty?.toString().trim();

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
      const formData = new FormData();
      formData.append("firm_name", values.firm_name || "");
      formData.append("gstin", values.gstin || "");
      formData.append("name", values.name || "");
      formData.append("email", values.email || "");
      formData.append("mobile", values.mobile || "");
      formData.append("address", values.address || "");
      formData.append(
        "order_date",
        values.order_date ? dayjs(values.order_date).format("YYYY-MM-DD") : ""
      );

      formData.append(
        "delivery_instructions",
        values.delivery_instructions || ""
      );
      formData.append("delivery_charges", values.delivery_charges || "");
      formData.append("discount_amount", values.discount_amount || "");

      if (isEditMode) {
        formData.append("order_status", values.order_status);
      }

      formData.append(
        "subs",
        JSON.stringify(
          subs.map((item) => {
            const sub = {
              product_id: item.product_id,
              product_price: item.product_price,
              product_qnty: item.product_qnty,
            };

            if (isEditMode) {
              sub.order_sub_status = item.order_sub_status ? "yes" : "no";
            }

            return sub;
          })
        )
      );
      subs.forEach((item, index) => {
        formData.append(`subs[${index}][id]`, item.id);
        formData.append(`subs[${index}][product_id]`, item.product_id);
        formData.append(
          `subs[${index}][product_price]`,
          Number(item.product_price)
        );
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
        url: isEditMode
          ? `${GUEST_USER_ORDER_UPDATE}/${id}?_method=PUT`
          : GUEST_USER_ORDER_CREATE,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.code == 201) {
        message.success(
          res.message ||
            `User ${isEditMode ? "updated" : "created"} successfully!`
        );
        naviagte("/guest-user-order");
      } else {
        message.error(res.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      message.error(`Failed to ${isEditMode ? "update" : "create"} user.`);
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
                  {isEditMode ? "Update" : "Create"}Guest Order
                </h2>
              </div>
            </Space>
            {isEditMode && (
              <Card
                // bordered={false}
                style={{ marginBottom: 16 }}
                bodyStyle={{ padding: 16 }}
              >
                <Row gutter={[16, 12]}>
                  {[
                    {
                      label: "Firm Name",
                      value: form.getFieldValue("firm_name"),
                    },
                    { label: "GSTIN", value: form.getFieldValue("gstin") },
                    { label: "Name", value: form.getFieldValue("name") },
                    { label: "Email", value: form.getFieldValue("email") },
                    { label: "Mobile", value: form.getFieldValue("mobile") },
                    {
                      label: "WhatsApp",
                      value: form.getFieldValue("whatsapp"),
                    },
                  ].map(({ label, value }, index) => (
                    <Col xs={24} md={12} lg={8} key={index}>
                      <div className="text-sm">
                        <span className="text-gray-500">{label}: </span>
                        <span className="text-gray-800 font-medium">
                          {value || <span className="text-gray-400">-</span>}
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            <div
              className={`grid gap-4 ${
                isEditMode
                  ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {" "}
              {!isEditMode && (
                <>
                  <Form.Item label="Firm Name" name="firm_name">
                    <Input />
                  </Form.Item>
                  <Form.Item label="GSTIN" name="gstin">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span>
                        Name <span className="text-red-500">*</span>
                      </span>
                    }
                    name="name"
                    rules={[{ required: true, message: "Name is required" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span>
                        Email <span className="text-red-500">*</span>
                      </span>
                    }
                    name="email"
                    rules={[{ required: true, message: "Email is required" }]}
                  >
                    <Input type="email" />
                  </Form.Item>
                  <Form.Item
                    name="mobile"
                    label={
                      <span>
                        Mobile <span className="text-red-500">*</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: "Mobile is required" },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit mobile number",
                      },
                    ]}
                  >
                    <Input maxLength={10} />
                  </Form.Item>
                  <Form.Item
                    label="WhatsApp"
                    name="whatsapp"
                    rules={[
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit whatsaap number",
                      },
                    ]}
                  >
                    <Input maxLength={10} />
                  </Form.Item>
                </>
              )}
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
              <Form.Item label="Status" name="order_status">
                <Select placeholder="Select Status" allowClear>
                  {ordersstatus.map((status) => (
                    <Option key={status.id} value={status.status}>
                      {status.status}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Address" className="md:col-span-4">
                <Input.TextArea rows={3} />
              </Form.Item>
            </div>

            <div className="flex justify-between items-center mb-4">
              <strong>Product</strong>
              <Button type="dashed" onClick={addRow} icon={<PlusOutlined />}>
                Add Product
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {ProductForms.map((addr, idx) => (
                <Card
                  key={idx}
                  size="small"
                  className="space-y-3"
                  title={`Product ${idx + 1}`}
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
                      label="Product Price"
                      // name={[idx, "product_price"]}
                      name={["subs", idx, "product_price"]}
                      rules={[
                        {
                          pattern: /^[0-9]+$/,
                          message: "Enter a valid numeric amount",
                        },
                      ]}
                    >
                      <Input
                        value={parseFloat(addr.product_price) || 0}
                        // value={addr.product_price}
                        onChange={(e) =>
                          handleProductChange(
                            idx,
                            "product_price",
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label="Quantity"
                      // name={[idx, "product_qnty"]}
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

export default GuestUserOrderForm;
