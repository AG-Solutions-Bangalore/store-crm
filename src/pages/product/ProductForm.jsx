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
  Select,
  Spin,
  Switch,
  Upload,
  App,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORY_ACTIVE, FETCH_UNIT, PRODUCT_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";

const ProductForm = () => {
  const { message } = App.useApp();
  const token = usetoken();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { trigger: fetchTrigger, loading: fetchLoading } = useApiMutation();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const [form] = Form.useForm();
  const [categoryData, setCategoryData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [productForms, setProductForms] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const [categoryRes, unitRes] = await Promise.all([
      fetchTrigger({
        url: CATEGORY_ACTIVE,
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetchTrigger({
        url: FETCH_UNIT,
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    if (categoryRes?.data) setCategoryData(categoryRes.data);
    if (unitRes?.data) setUnitData(unitRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchProduct = async () => {
    const res = await fetchTrigger({
      url: `${PRODUCT_LIST}/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res?.data) return;

    const userData = res.data;
    const userImage = res.image_url?.find((i) => i.image_for === "Product");
    const noImage = res.image_url?.find((i) => i.image_for === "No Image");
    const baseImageUrl = userImage?.image_url || "";
    const noImageUrl = noImage?.image_url || "";

    form.setFieldsValue({
      ...userData,

      category_ids: userData.category_ids
        ? userData.category_ids.split(",").map((id) => Number(id))
        : [],
      is_active: userData.is_active === "true" || userData.is_active === true,
    });

    const subs = (userData.subs || []).map((sub) => ({
      id: sub.id,
      product_id: sub.product_id,
      is_default: sub.is_default == "true",
      is_active: sub.is_active == "true",
      preview: sub.product_images
        ? `${baseImageUrl}${sub.product_images}`
        : noImageUrl,
      product_images: null,
    }));

    setProductForms(subs);
  };

  useEffect(() => {
    if (isEditMode) fetchProduct();
    else {
      setProductForms([
        {
          id: "",
          is_default: false,
          is_active: false,
          preview: "",
          product_images: null,
        },
      ]);
    }
  }, [id]);

  useEffect(() => {
    form.setFieldsValue({ subs: productForms });
  }, [productForms]);

  const updateProductField = (index, field, value) => {
    const updated = [...productForms];
    if (field === "is_default" && value === true) {
      updated.forEach((item, i) => (item.is_default = i === index));
    } else {
      updated[index][field] = value;
    }
    setProductForms(updated);
  };

  const handleImageUpload = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...productForms];
      updated[index].product_images = file;
      updated[index].preview = reader.result;
      setProductForms(updated);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleFinish = async (values) => {
    try {
      const subs = values.subs || [];
      const allHaveImages = productForms.every(
        (item) => item.preview || item.product_images instanceof File
      );
      if (!allHaveImages) {
        message.error("All product subs must have an image.");
        return;
      }

      if (subs.length === 0) {
        message.error("At least one product sub is required.");
        return;
      }

      const hasDefault = productForms.some((item) => item.is_default === true);
      if (!hasDefault) {
        message.error("Please mark one sub as default.");
        return;
      }

      const formData = new FormData();
      formData.append("category_ids", values.category_ids || "");
      formData.append("product_name", values.product_name || "");
      formData.append(
        "product_short_description",
        values.product_short_description || ""
      );
      formData.append("product_brand", values.product_brand || "");
      formData.append("product_unit_id", values.product_unit_id || "");
      formData.append("product_unit_value", values.product_unit_value || "");
      formData.append("product_mrp", values.product_mrp || "");
      formData.append(
        "product_selling_price",
        values.product_selling_price || ""
      );
      formData.append(
        "product_spl_offer_price",
        values.product_spl_offer_price || ""
      );

      if (isEditMode) {
        formData.append("is_active", values.is_active ? "true" : "false");
      }

      productForms.forEach((item, index) => {
        if (isEditMode) {
          formData.append(`subs[${index}][id]`, item.id || "");
        }
        formData.append(
          `subs[${index}][is_default]`,
          item.is_default ? "true" : "false"
        );
        formData.append(
          `subs[${index}][is_active]`,
          item.is_active ? "true" : "false"
        );
        if (item.product_images instanceof File) {
          formData.append(
            `subs[${index}][product_images]`,
            item.product_images
          );
        }
      });
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      await submitTrigger({
        url: isEditMode ? `${PRODUCT_LIST}/${id}?_method=PUT` : PRODUCT_LIST,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success(
        `Product ${isEditMode ? "updated" : "created"} successfully!`
      );
      navigate("/product");
    } catch (error) {
      console.error("Error submitting Product:", error);

      const errMsg = error?.response?.data?.message;

      if (typeof errMsg === "string") {
        message.error(errMsg);
      } else if (typeof errMsg === "object") {
        const flatErrors = Object.values(errMsg).flat();
        flatErrors.forEach((msg) => {
          message.error(msg);
        });
      } else {
        message.error("Something went wrong while submitting the Product.");
      }
    }
  };

  return fetchLoading ? (
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#006666]">
            {isEditMode ? "Edit" : "Create"} Product
          </h2>
          {isEditMode && (
            <Form.Item name="is_active" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Form.Item
            name="category_ids"
            // label="Category"
            label={
              <span>
                Category <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please select at least one category",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select Categories"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {categoryData.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="product_name"
            label={
              <span>
                Product Name <span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Product name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="product_brand"
            label="Brand"
            // rules={[{ required: true, message: "Brand is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="product_unit_value"
            label={
              <span>
                Unit Value<span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Unit value is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="product_unit_id"
            label={
              <span>
                Unit<span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Please select a unit" }]}
          >
            <Select placeholder="Select Unit">
              {unitData.map((unit) => (
                <Select.Option key={unit.id} value={unit.id}>
                  {unit.unit}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="product_mrp"
            label={
              <span>
                MRP<span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "MRP is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="product_selling_price"
            label={
              <span>
                Selling Price<span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Selling price is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="product_spl_offer_price" label="Offer Price">
            <Input />
          </Form.Item>
          <Form.Item
            name="product_short_description"
            label="Description"
            className="md:col-span-4"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>

        <Form.List name="subs">
          {(fields, { add, remove }) => (
            <>
              <div className="flex justify-between items-center mb-4">
                <strong>Product Sub Variants</strong>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const newSub = {
                      id: "",
                      is_default: false,
                      is_active: false,
                      product_images: null,
                      preview: "",
                    };
                    setProductForms([...productForms, newSub]);
                    add();
                  }}
                >
                  Add Product
                </Button>
              </div>

              {fields.map(({ key, name, ...restField }, index) => {
                const current = productForms[index] || {};
                return (
                  <Card
                    key={key}
                    size="small"
                    className="mb-4"
                    title={`Image ${index + 1}`}
                    extra={
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          const updated = [...productForms];
                          updated.splice(index, 1);
                          setProductForms(updated);
                          remove(name);
                        }}
                        disabled={fields.length === 1}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, "product_images"]}
                        label="Product Image"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar
                            size={36}
                            src={current.preview}
                            icon={<UserOutlined />}
                          />
                          <Upload
                            showUploadList={false}
                            accept="image/*"
                            beforeUpload={(file) =>
                              handleImageUpload(index, file)
                            }
                          >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                          </Upload>
                        </div>
                      </Form.Item>

                      <Form.Item
                        name={[name, "is_default"]}
                        label="Default"
                        valuePropName="checked"
                      >
                        <Switch
                          checked={current.is_default}
                          onChange={(checked) =>
                            updateProductField(index, "is_default", checked)
                          }
                        />
                      </Form.Item>

                      {isEditMode && (
                        <Form.Item
                          name={[name, "is_active"]}
                          label="Active"
                          valuePropName="checked"
                        >
                          <Switch
                            checked={current.is_active}
                            onChange={(checked) =>
                              updateProductField(index, "is_active", checked)
                            }
                          />
                        </Form.Item>
                      )}
                    </div>
                  </Card>
                );
              })}
              <Form.Item name="is_default_error" style={{ display: "none" }}>
                <div />
              </Form.Item>
            </>
          )}
        </Form.List>

        <div className="mt-6 text-center">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default ProductForm;
