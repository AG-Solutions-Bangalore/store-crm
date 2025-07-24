import {
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Button, Card, Select, Spin, Tooltip } from "antd";
import printJS from "print-js";
import { useEffect, useState } from "react";
import { PRODUCT_REPORT } from "../../../api";
import useToken from "../../../api/usetoken";
import { exportCategoryReportToExcel } from "../../../components/exportCategoryToExcel/exportCategoryToExcel";
import { downloadPDF } from "../../../components/pdfExport/pdfExport";
import { useApiMutation } from "../../../hooks/useApiMutation";
const { Option } = Select;

const ProductReport = () => {
  const token = useToken();

  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  const { trigger: fetchCategoryReport, loading: isMutating } =
    useApiMutation();

  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await fetchCategoryReport({
          url: PRODUCT_REPORT,
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.code === 201) {
          setCategory(res.data);
          setFilteredCategory(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch product report:", error);
      }
    };

    getReport();
  }, []);

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    if (value === "all") {
      setFilteredCategory(category);
    } else {
      const isActive = value === "active";
      setFilteredCategory(
        category.filter((item) => item.is_active === String(isActive))
      );
    }
  };

  const handlePrint = () => {
    printJS({
      printable: "printable-section",
      type: "html",
      targetStyles: ["*"],
    });
  };
  return (
    <>
      <Card
        title="Product Report"
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <div className="flex  items-center gap-2">
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={handleFilterChange}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>

            <Tooltip title="Print Report">
              <Button
                type="default"
                shape="circle"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              />
            </Tooltip>
            <Tooltip title="Download PDF">
              <Button
                type="default"
                shape="circle"
                icon={<FilePdfOutlined />}
                onClick={() =>
                  downloadPDF("printable-section", "my-report.pdf")
                }
              />
            </Tooltip>

            <Tooltip title="Excel Report">
              <Button
                type="default"
                shape="circle"
                icon={<FileExcelOutlined />}
                onClick={() =>
                  exportCategoryReportToExcel(
                    filteredCategory,
                    "Product Report"
                  )
                }
              />
            </Tooltip>
          </div>
        }
      >
        {/* Only this part will be printed */}
        <div id="printable-section" className="p-0 m-0 print:p-0 print:m-0">
          <h2 className="text-xl font-semibold">Product Report</h2>

          {isMutating ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : filteredCategory.length > 0 ? (
            <table
              className="w-full border rounded-md table-fixed"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-center w-[200px]">Name</th>
                  <th className="px-3 py-2 text-center w-[80px]">Unit</th>
                  <th className="px-3 py-2 text-center w-[100px]">MRP</th>
                  <th className="px-3 py-2 text-center w-[100px]">
                    Selling Price
                  </th>
                  <th className="px-3 py-2 text-center w-[100px]">
                    Special Offer
                  </th>
                  <th className="px-3 py-2 text-center w-[100px]">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategory.map((item) => (
                  <tr
                    key={item.product_name}
                    className="border-t"
                    style={{ pageBreakInside: "avoid" }}
                  >
                    <td className="px-3 py-2 font-medium">
                      {item.product_name}
                    </td>

                    <td className="px-3 py-2 text-center">
                      {item.product_unit_value}-{item.unit}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.product_mrp}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.product_selling_price}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.product_spl_offer_price}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div>
                        <span className="mx-2 my-1">
                          {item.is_active == "true" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-20">
              No data found.
            </div>
          )}
        </div>
      </Card>
    </>
  );
};
export default ProductReport;
