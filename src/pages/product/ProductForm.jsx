import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  Switch,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CATEGORY_ACTIVE,
  CREATE_USER_LIST,
  FETCH_UNIT,
  GET_USER_BY_ID,
  PRODUCT_LIST,
  UPDATE_PROFILE,
} from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";

const ProductForm = () => {
  const token = usetoken();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { trigger: FetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: SubmitTrigger, loading: submitloading } = useApiMutation();
  const { trigger, loading: isMutating } = useApiMutation();
  const [form] = Form.useForm();
  const [initialValues, setInitialData] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [productForms, setProductForms] = useState([
    { id: "", is_default: false, product_image: null, preview: "" },
  ]);

  const navigate = useNavigate();

  const fetchUser = async () => {
    const res = await trigger({
      url: CATEGORY_ACTIVE,
      headers: { Authorization: `Bearer ${token}` },
    });
    const resunit = await trigger({
      url: FETCH_UNIT,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res && resunit) {
      setCategoryData(res?.data);
      setUnitData(resunit?.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchProfile = async () => {
    const res = await FetchTrigger({
      url: `${GET_USER_BY_ID}/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res || !res.data) return;

    const userData = res.data;
    setInitialData({
      ...userData,
      user_type: String(userData.user_type),
    });
    form.setFieldsValue(userData);

    setProductForms(
      Array.isArray(res.address)
        ? res.address.map((a) => ({
            id: a.id || "",
            address_type: a.address_type || "",
            address: a.address || "",
            is_default: a.is_default === "yes",
            product_image: null,
            preview: "",
          }))
        : []
    );
  };

  useEffect(() => {
    if (isEditMode) fetchProfile();
  }, [id]);

  const onAddressChange = (index, field, value) => {
    const updated = [...productForms];
    if (field === "is_default" && value === true) {
      updated.forEach((_, i) => {
        updated[i].is_default = i === index;
      });
    } else {
      updated[index][field] = value;
    }
    setProductForms(updated);
  };

  const onProductImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...productForms];
      updated[index].product_image = file;
      updated[index].preview = reader.result;
      setProductForms(updated);
    };
    reader.readAsDataURL(file);
  };

  const addRow = () => {
    setProductForms((prev) => [
      ...prev,
      {
        id: "",
        address_type: "",
        address: "",
        is_default: false,
        product_image: null,
        preview: "",
      },
    ]);
  };

  const removeRow = (index) => {
    if (productForms.length > 1) {
      const updated = [...productForms];
      updated.splice(index, 1);
      setProductForms(updated);
    }
  };

  const handleFinish = async (values) => {
    try {
      const missingImage = productForms.some((p) => !p.product_image);
      if (missingImage) {
        return message.error("Each product must have an image.");
      }

      const formData = new FormData();
      formData.append("category_ids", values.category_ids || "");
      formData.append("product_name", values.product_name || "");
      formData.append(
        "product_short_description",
        values.product_short_description
      );
      formData.append("product_brand", values.product_brand);
      formData.append("product_unit_id", values.product_unit_id);
      formData.append("product_unit_value", values.product_unit_value || "");
      formData.append("product_mrp", values.product_mrp);
      formData.append("product_selling_price", values.product_selling_price);
      formData.append(
        "product_spl_offer_price",
        values.product_spl_offer_price
      );
      if (isEditMode) {
        formData.append("is_active", values.is_active ? "true" : "false");
      }
      productForms.forEach((item, index) => {
        formData.append(
          `subs[${index}][is_default]`,
          item.is_default ? "true" : "false"
        );
        formData.append(`subs[${index}][product_images]`, item.product_image);
      });

      await SubmitTrigger({
        url: isEditMode ? `${PRODUCT_LIST}/${id}?_method=PUT` : PRODUCT_LIST,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success(
        `User ${isEditMode ? "updated" : "created"} successfully!`
      );
      navigate("/user");
    } catch (err) {
      console.error("Error submitting form:", err);
      message.error(`Failed to ${isEditMode ? "update" : "create"} user.`);
    }
  };

  return (
    <>
      {fetchloading || isMutating ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
            className="mt-4"
          >
            <Space className="mb-4 w-full" direction="horizontal">
              <h2 className="text-2xl font-bold text-[#006666]">
                Create Product
              </h2>
            </Space>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Form.Item
                name="category_ids"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select placeholder="Select Category">
                  {categoryData?.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.category_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="product_name"
                label="Product Name"
                rules={[
                  { required: true, message: "Product Name is required" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Brand"
                name="product_brand"
                rules={[{ required: true, message: "Brand is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                className="col-span-2"
                label="Description"
                name="product_short_description"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                name="product_unit_id"
                label="Unit"
                rules={[{ required: true, message: "Please select a unit" }]}
              >
                <Select placeholder="Select Unit">
                  {unitData?.map((unit) => (
                    <Select.Option key={unit.id} value={unit.id}>
                      {unit.unit}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Unit Value"
                name="product_unit_value"
                rules={[{ required: true, message: "Unit Value is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="MRP"
                name="product_mrp"
                rules={[{ required: true, message: "MRP is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="product_selling_price"
                label="Selling Price"
                rules={[
                  { required: true, message: "Selling Price is required" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="product_spl_offer_price"
                label="Offer Price"
                rules={[{ required: true, message: "Offer Price is required" }]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="flex justify-between items-center mb-4">
              <strong>Product Sub</strong>
              <Button type="dashed" onClick={addRow} icon={<PlusOutlined />}>
                Add Product
              </Button>
            </div>

            {productForms.map((addr, idx) => (
              <Card
                key={idx}
                size="small"
                className="mb-4"
                title={`Product ${idx + 1}`}
                extra={
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeRow(idx)}
                    disabled={productForms.length === 1}
                  >
                    Remove
                  </Button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Product Image" required>
                    <div className="flex items-center gap-2">
                      {addr.preview && (
                        <Avatar
                          size={36}
                          src={addr.preview}
                          icon={<UserOutlined />}
                        />
                      )}
                      <Upload
                        showUploadList={false}
                        accept="image/*"
                        beforeUpload={(file) => {
                          onProductImageChange(idx, file);
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                      </Upload>
                    </div>
                  </Form.Item>

                  <Form.Item label="Default">
                    <Switch
                      checked={addr.is_default}
                      onChange={(checked) =>
                        onAddressChange(idx, "is_default", checked)
                      }
                      disabled={
                        !addr.is_default &&
                        productForms.some((a) => a.is_default)
                      }
                    />
                  </Form.Item>
                </div>
              </Card>
            ))}

            <div className="mt-6 text-center">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  // loading={submitloading}
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

export default ProductForm;
