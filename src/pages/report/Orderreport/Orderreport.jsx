import { Card, DatePicker, Form, Button } from "antd";
import dayjs from "dayjs";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { ORDER_REPORT } from "../../../api";
import useToken from "../../../api/usetoken";

const OrderReport = () => {
  const token = useToken();
  const [form] = Form.useForm();
  const { trigger: submitTrigger, loading: submitloading } = useApiMutation();

  const handleSubmit = async (values) => {
    const fromDate = dayjs(values?.from_date).format("YYYY-MM-DD");
    const toDate = dayjs(values?.to_date).format("YYYY-MM-DD");

    const payload = {
      from_date: fromDate,

      to_date: toDate,
    };
    await submitTrigger({
      url: ORDER_REPORT,
      method: "post",
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <Card
      title="Order Report"
      bordered={false}
      className="shadow-md rounded-lg"
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          from_date: dayjs().startOf("month"),
          to_date: dayjs(),
        }}
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            label={
              <span>
                From Date <span className="text-red-500">*</span>
              </span>
            }
            name="from_date"
            rules={[{ required: true, message: "Please select from date" }]}
          >
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                To Date <span className="text-red-500">*</span>
              </span>
            }
            name="to_date"
            rules={[{ required: true, message: "Please select to date" }]}
          >
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>

          <div className="flex items-end">
            <Form.Item className="w-full">
              <Button
                type="primary"
                loading={submitloading}
                htmlType="submit"
                block
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default OrderReport;
