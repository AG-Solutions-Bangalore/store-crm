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
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FETCH_PRODUCTLIST,
  GUEST_USER_ORDER_BY_ID,
  GUEST_USER_ORDER_CREATE,
  GUEST_USER_ORDER_UPDATE,
} from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";
const GuestUserOrderForm = () => {
  const { message } = App.useApp();
  const token = usetoken();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { trigger: FetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: SubmitTrigger, loading: submitloading } = useApiMutation();
  const [form] = Form.useForm();
  const [ProductData, setProductData] = useState([]);

  // const [initialValues, setInitialData] = useState({});
  const [ProductForms, setProductForms] = useState([
    {
      product_id: "",
      product_price: "",
      product_qnty: "",
      order_sub_status: false,
    },
  ]);
  const fetchData = async () => {
    try {
      const productRes = await FetchTrigger({
        url: FETCH_PRODUCTLIST,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(productRes);
      if (productRes?.data) {
        setProductData(productRes.data);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchProfile = async () => {
    const res = await FetchTrigger({
      url: `${GUEST_USER_ORDER_BY_ID}/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res || !res.data) return;

    const userData = res.data;
    // setInitialData({
    //   ...userData,
    // });
    form.setFieldsValue(userData);
    setProductForms(
      Array.isArray(userData.subs)
        ? userData.subs.map((p) => ({
            product_id: p.product_id || "",
            product_price: p.product_price || "",
            product_qnty: p.product_qnty || "",
            is_default: p.is_default === "yes" || p.is_default === true,
          }))
        : []
    );
  };

  useEffect(() => {
    if (isEditMode) fetchProfile();
  }, [id]);
  useEffect(() => {
    form.setFieldsValue({ subs: ProductForms });
  }, [ProductForms]);
  const handleProductChange = (index, field, value) => {
    const updatedForms = [...ProductForms];
    updatedForms[index][field] = value;
    setProductForms(updatedForms);
  };

  const addRow = () => {
    setProductForms((prev) => [
      ...prev,
      { id: "", address_type: "", address: "", is_default: false },
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
    const formattedOrderDate = values.order_date
      ? `${values.order_date.$y}-${String(values.order_date.$M + 1).padStart(
          2,
          "0"
        )}-${String(values.order_date.$D).padStart(2, "0")}`
      : null;

    const subs = ProductForms || [];
    let hasValidSub = false;
    let hasInvalidSub = false;
    let hasDefault = false;

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
      formData.append("firm_name", values.firm_name || "");
      formData.append("gstin", values.gstin || "");
      formData.append("name", values.name || "");
      formData.append("email", values.email || "");
      formData.append("mobile", values.mobile || "");
      formData.append("address", values.address || "");
      formData.append("order_date", formattedOrderDate || "");
      formData.append(
        "delivery_instructions",
        values.delivery_instructions || ""
      );
      formData.append("delivery_charges", values.delivery_charges || "");
      formData.append("discount_amount", values.discount_amount || "");

      if (isEditMode) {
        formData.append("order_status", values.order_status ? "true" : "false");
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

      if (res.code === 201) {
        message.success(
          res.message ||
            `User ${isEditMode ? "updated" : "created"} successfully!`
        );
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
              {isEditMode && (
                <>
                  <Form.Item
                    label="Status"
                    name="order_status"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </>
              )}
            </Space>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      name="product_id"
                      // label="Category"
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
                        // mode="multiple"
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
                    </Form.Item>{" "}
                    <Form.Item
                      label="Product Price"
                      name={[idx, "product_price"]}
                      rules={[
                        {
                          pattern: /^[0-9]+$/,
                          message: "Enter a valid numeric amount",
                        },
                      ]}
                    >
                      <Input
                        value={addr.product_price}
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
                      name={[idx, "product_qnty"]}
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
                        <Switch
                          checked={addr.order_sub_status}
                          onChange={(checked) =>
                            handleProductChange(
                              idx,
                              "order_sub_status",
                              checked
                            )
                          }
                          disabled={
                            !addr.order_sub_status &&
                            ProductForms.some((a) => a.order_sub_status)
                          }
                        />
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
                  Submit
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
