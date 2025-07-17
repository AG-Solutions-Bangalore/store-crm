import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Switch,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { SLIDER_LIST } from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";

const SliderForm = ({ open, setOpenDialog, userId, fetchUser }) => {
  const { message } = App.useApp();
  const isEditMode = userId ? true : false;

  const [form] = Form.useForm();
  const token = usetoken();
  const [initialData, setInitialData] = useState({});
  const { trigger: FetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: SubmitTrigger, loading: submitloading } = useApiMutation();
  const [sliderFile, setSliderFile] = useState(null);
  const [sliderFilePreview, setSliderFilePreview] = useState(null);
  const [noImageUrl, setNoImageUrl] = useState("");
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const fetchSlider = async () => {
    try {
      const res = await FetchTrigger({
        url: `${SLIDER_LIST}/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res || !res.data) return;

      const userData = res.data;
      setInitialData(userData);
      form.setFieldsValue({
        slider_sort: userData.slider_sort,
        slider_url: userData.slider_url,
        is_active: userData.is_active === "true" || userData.is_active === true,
      });

      const userImage = res.image_url?.find((i) => i.image_for === "Slider");
      const noImage = res.image_url?.find((i) => i.image_for === "No Image");

      setImageBaseUrl(userImage?.image_url || "");
      //   setSliderFile(userData.slider_image || "");
      setNoImageUrl(noImage?.image_url || "");
    } catch (err) {
      console.error("Error fetching slider data:", err);
      message.error("Failed to load slider data.");
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchSlider();
    } else {
      form.resetFields();
      setInitialData({});
      setSliderFile(null);
      setSliderFilePreview(null);
    }
  }, [userId]);
  const handleProfileSave = async (values) => {
    try {
      const formData = new FormData();
      formData.append("slider_sort", values.slider_sort || "");
      formData.append("slider_url", values.slider_url || "");

      if (sliderFile) {
        formData.append("slider_image", sliderFile);
      }

      if (isEditMode) {
        formData.append("is_active", values.is_active);
      }
      const respose = await SubmitTrigger({
        url: isEditMode ? `${SLIDER_LIST}/${userId}?_method=PUT` : SLIDER_LIST,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (respose.code === 201) {
        message.success(respose.message || "Slider updated successfully!");
        setOpenDialog(false);
        fetchUser();
      }
    } catch (err) {
      console.error("Error updating Slider:", err);
      message.error(err || "Failed to update Slider.");
    }
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
        {isEditMode ? "Update" : "Create"} Slider
      </h2>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProfileSave}
          initialValues={{ is_active: false }}
          requiredMark={false}
          className="mt-4"
        >
          <Space className="mb-4 w-full justify-between" direction="horizontal">
            {isEditMode && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-full h-[200px] border rounded-md overflow-hidden">
                    <Image
                      src={
                        sliderFilePreview ||
                        (initialData.slider_image
                          ? initialData.slider_image.startsWith("data:image")
                            ? initialData.slider_image
                            : `${imageBaseUrl}${initialData.slider_image}`
                          : noImageUrl)
                      }
                      alt="Slider"
                      className="w-full h-full object-cover"
                    />
                  </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label={
                <span>
                  Sort Order <span className="text-red-500">*</span>
                </span>
              }
              name="slider_sort"
              rules={[{ required: true, message: "Sort Order is required" }]}
            >
              <Input />
            </Form.Item>
            {/* {!isEditMode && ( */}
            <Form.Item
              className="w-full"
              name="slider_image"
              label={
                <span>
                  Image <span className="text-red-500">*</span>
                </span>
              }
              //   rules={[{ required: true, message: "Image is required" }]}
            >
              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={(file) => {
                  setSliderFile(file);
                  const reader = new FileReader();
                  reader.onload = () => setSliderFilePreview(reader.result);
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} className="w-[215px]">
                  Upload Image
                </Button>
              </Upload>

              {/* <Upload
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={(file) => {
                      setCategoryFile(file);
                      const reader = new FileReader();
                      reader.onload = () =>
                        setCategoryFilePreview(reader.result);
                      reader.readAsDataURL(file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                  </Upload> */}
            </Form.Item>
            {/* )} */}

            <Form.Item label={<span>Url</span>} name="slider_url">
              <Input />
            </Form.Item>
          </div>

          <div className=" mt-6">
            <Form.Item className="text-center mt-6">
              <Button type="primary" htmlType="submit" loading={submitloading}>
                {isEditMode ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default SliderForm;
