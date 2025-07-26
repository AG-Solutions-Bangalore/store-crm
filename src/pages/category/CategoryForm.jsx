import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Switch,
  Upload
} from "antd";
import { useEffect, useState } from "react";
import { CATEGORY_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import CropImageModal from "../../components/common/CropImageModal";
import { useApiMutation } from "../../hooks/useApiMutation";

const CategoryForm = ({ open, setOpenDialog, userId, fetchUser }) => {
  const { message } = App.useApp();
  const isEditMode = userId ? true : false;
  const [form] = Form.useForm();
  const token = usetoken();
  const [initialData, setInitialData] = useState({});
  const { trigger: FetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: SubmitTrigger, loading: submitloading } = useApiMutation();
  const [categoryFile, setCategoryFile] = useState(null);
  const [categoryFilePreview, setCategoryFilePreview] = useState(null);
  const [categoryBannerFile, setCategoryBannerFile] = useState(null);
  const [noImageUrl, setNoImageUrl] = useState("");
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [croppingImage, setCroppingImage] = useState(null);
  const [bannerCroppingImage, setBannerCroppingImage] = useState(null);
  const [bannerCropModalVisible, setBannerCropModalVisible] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await FetchTrigger({
        url: `${CATEGORY_LIST}/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res || !res.data) return;

      const userData = res.data;
      setInitialData(userData);
      // Set the fetched values directly into the form
      form.setFieldsValue({
        category_name: userData.category_name,
        category_sort_order: userData.category_sort_order,
        category_description: userData.category_description,
        is_active: userData.is_active,
      });

      // Handle category image and banner
      const userImage = res.image_url?.find((i) => i.image_for === "Category");
      const noImage = res.image_url?.find((i) => i.image_for === "No Image");
      setImageBaseUrl(userImage?.image_url || "");
      // categoryBannerFile(userImage?.category_banner_image || "");
      setNoImageUrl(noImage?.image_url || "");
    } catch (err) {
      console.error("Error fetching category data:", err);
      message.error("Failed to load category data.");
    }
  };

  useEffect(() => {
    setInitialData({});
    setCategoryBannerFile(null);
    setCategoryFilePreview(null);
    setCategoryFile(null);
    if (isEditMode) {
      fetchProfile();
    } else {
      form.resetFields();
      setInitialData({});
      setCategoryBannerFile(null);
      setCategoryFilePreview(null);
      setCategoryFile(null);
    }
  }, [userId]);
  const handleProfileSave = async (values) => {
    try {
      const formData = new FormData();
      formData.append("category_name", values.category_name || "");
      formData.append("category_sort_order", values.category_sort_order || "");
      formData.append("category_description", values.category_description);

      if (categoryFile) {
        formData.append("category_image", categoryFile);
      }
      if (categoryBannerFile) {
        formData.append("category_banner_image", categoryBannerFile);
      }
      if (isEditMode) {
        formData.append("is_active", values.is_active);
      }
      const respose = await SubmitTrigger({
        url: isEditMode
          ? `${CATEGORY_LIST}/${userId}?_method=PUT`
          : CATEGORY_LIST,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (respose.code == 201) {
        message.success(respose.message || "Category updated successfully!");
        setOpenDialog(false);
        fetchUser();
      } else {
        message.error(respose.message || "Category Failed ");
      }
    } catch (error) {
      console.error("Error submitting category:", error);

      const errMsg = error?.response?.data?.message;

      if (typeof errMsg === "string") {
        message.error(errMsg);
      } else if (typeof errMsg === "object") {
        // If message is an object with field-level errors
        const flatErrors = Object.values(errMsg).flat(); // flatten all messages
        flatErrors.forEach((msg) => {
          message.error(msg);
        });
      } else {
        message.error("Something went wrong while submitting the Category.");
      }
    }
  };

  const openCropper = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCroppingImage(reader.result);
      setCropModalVisible(true);
    };
    reader.readAsDataURL(file);
  };
  const openBannerCropper = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setBannerCroppingImage(reader.result);
      setBannerCropModalVisible(true);
    };
    reader.readAsDataURL(file);
  };
  const handleCroppedBannerImage = ({ blob, fileUrl }) => {
    setCategoryBannerFile(blob);
    setBannerCropModalVisible(false);
  };

  const handleCroppedImage = ({ blob, fileUrl }) => {
    setCategoryFile(blob);
    setCategoryFilePreview(fileUrl);
    setCropModalVisible(false);
  };
  return (
    <Modal
      open={open}
      onClose
      //   closable={false}
      footer={null}
      centered
      maskClosable={false}
      onCancel={() => setOpenDialog(false)}
      width={800}
    >
      <h2 className="text-2xl font-bold text-[#006666]">
        {isEditMode ? "Update" : "Create"} Category
      </h2>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProfileSave}
          requiredMark={false}
          className="mt-4"
        >
          <Space className="mb-4 w-full justify-between" direction="horizontal">
            {isEditMode && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <Avatar
                    size={64}
                    src={
                      categoryFilePreview ||
                      (initialData.category_image
                        ? initialData.category_image.startsWith("data:image")
                          ? initialData.category_image
                          : `${imageBaseUrl}${initialData.category_image}`
                        : noImageUrl)
                    }
                    icon={<UserOutlined />}
                  />
                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={(file) => {
                      // setCategoryFile(file);
                      openCropper(file);
                      const reader = new FileReader();
                      reader.onload = () =>
                        setCategoryFilePreview(reader.result);
                      reader.readAsDataURL(file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                  </Upload>
                </div>
                <Form.Item
                  label="Active"
                  name="is_active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </>
            )}
          </Space>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4`}>
            <Form.Item
              label={
                <span>
                  Category Name <span className="text-red-500">*</span>
                </span>
              }
              name="category_name"
              rules={[{ required: true, message: "name is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Sort Order <span className="text-red-500">*</span>
                </span>
              }
              name="category_sort_order"
              rules={[{ required: true, message: "Sort Order is required" }]}
            >
              <Input />
            </Form.Item>
            {!isEditMode && (
              <Form.Item
                label={<span>Category Image</span>}
                name="category_image"
              >
                <Upload
                  showUploadList={false}
                  accept="image/*"
                  beforeUpload={(file) => {
                    openCropper(file);
                    // setCategoryFile(file);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>
                    Upload Category Image
                  </Button>
                </Upload>
                {categoryFile && (
                  <div className="mt-2 text-sm text-gray-600 overflow-hiden">
                    Selected file:{" "}
                    <strong>
                      {" "}
                      {categoryFile.name.length > 15
                        ? `${categoryFile.name.slice(0, 15)}...`
                        : categoryFile.name}
                    </strong>
                  </div>
                )}
              </Form.Item>
            )}
            <Form.Item
              label={<span>Banner Image</span>}
              name="category_banner_image"
            >
              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={(file) => {
                  // setCategoryBannerFile(file);
                  openBannerCropper(file);
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Banner Image</Button>
              </Upload>

              {categoryBannerFile && (
                <div className="mt-2 text-sm text-gray-600 overflow-hiden">
                  Selected file:{" "}
                  <strong>
                    {categoryBannerFile.name?.length > 15
                      ? `${categoryBannerFile.name.slice(0, 15)}...`
                      : categoryBannerFile.name}
                  </strong>
                </div>
              )}
            </Form.Item>
          </div>
          <Form.Item
            label={
              <span>
                Description <span className="text-red-500">*</span>
              </span>
            }
            name="category_description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={3} type="email" />
          </Form.Item>
          <div className=" mt-6">
            <Form.Item className="text-center mt-6">
              <Button type="primary" htmlType="submit" loading={submitloading}>
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
      <CropImageModal
        open={cropModalVisible}
        imageSrc={croppingImage}
        onCancel={() => setCropModalVisible(false)}
        onCropComplete={handleCroppedImage}
        cropSize={{ width: 400, height: 400 }}
        title="Crop Category Image"
      />
      <CropImageModal
        open={bannerCropModalVisible}
        imageSrc={bannerCroppingImage}
        onCancel={() => setBannerCropModalVisible(false)}
        onCropComplete={handleCroppedBannerImage}
        cropSize={{ width: 400, height: 400 }}
        title="Crop Banner Image"
      />
    </Modal>
  );
};

export default CategoryForm;
