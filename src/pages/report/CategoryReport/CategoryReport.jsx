import { Button, Card, Image, Select, Spin, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_REPORT } from "../../../api";
import useToken from "../../../api/usetoken";
import { useApiMutation } from "../../../hooks/useApiMutation";
import printJS from "print-js";
const { Option } = Select;

const CategoryReport = () => {
  const token = useToken();
  const printRef = useRef(null);

  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [noImageUrl, setNoImageUrl] = useState("");

  const { trigger: fetchCategoryReport, loading: isMutating } =
    useApiMutation();

  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await fetchCategoryReport({
          url: CATEGORY_REPORT,
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.code === 201) {
          const images = res.image_url || [];
          const imgUrlObj = Object.fromEntries(
            images.map((i) => [i.image_for, i.image_url])
          );
          setImageBaseUrl(imgUrlObj["Category"] || "");
          setNoImageUrl(imgUrlObj["No Image"] || "");
          setCategory(res.data);
          setFilteredCategory(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch category report:", error);
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
        title="Category Report"
        bordered={false}
        className="shadow-md rounded-lg"
        extra={
          <div className="flex flex-row-reverse items-center gap-2">
            <Button onClick={handlePrint} type="primary">
              Print Report
            </Button>
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={handleFilterChange}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        }
      >
        {/* Only this part will be printed */}
        <div
          ref={printRef}
          id="printable-section"
          className="p-0 m-0 print:p-0 print:m-0"
        >
          <h2 className="text-xl font-semibold text-center mb-4 hidden print:block">
            Category Report
          </h2>

          {isMutating ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : filteredCategory.length > 0 ? (
            <table className="w-full border rounded-md table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left w-[100px]">Image</th>
                  <th className="px-3 py-2 text-left w-[200px]">Name</th>
                  <th className="px-3 py-2 text-left w-[300px]">Description</th>
                  <th className="px-3 py-2 text-center w-[100px]">
                    Sort Order
                  </th>
                  <th className="px-3 py-2 text-center w-[100px]">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategory.map((item) => (
                  <tr key={item.category_name} className="border-t">
                    <td className="px-3 py-2">
                      <Image
                        width={60}
                        height={60}
                        src={`${imageBaseUrl}${item.category_image}`}
                        fallback={noImageUrl}
                        alt="Category"
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {item.category_name}
                    </td>
                    <td className="px-3 py-2">{item.category_description}</td>
                    <td className="px-3 py-2 text-center">
                      {item.category_sort_order}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div
                        className={`inline-block px-2 py-[0.5] rounded-[5px] text-sm font-medium border ${
                          item.is_active === "true"
                            ? "bg-green-100 text-green-700 border-green-400"
                            : "bg-red-100 text-red-700 border-red-400"
                        }`}
                      >
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

export default CategoryReport;
// import printJS from "print-js";
// import { Button } from "antd";

// const CategoryReport = () => {

//   return (
//     <>
//       <Button onClick={handlePrint}>Print with printJS</Button>

//       <div id="printable-section">
//         <h1>Category Report</h1>
//         {/* Your printable table */}
//       </div>
//     </>
//   );
// };
// export default CategoryReport;
