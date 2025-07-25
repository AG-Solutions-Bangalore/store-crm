import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportCategoryReportToExcel = async (
  data,
  title = "Category Report"
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Category Report");

  // Define columns
  const columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Description", key: "description", width: 40 },
    { header: "Sort Order", key: "sortOrder", width: 15 },
    { header: "Status", key: "status", width: 15 },
  ];
  worksheet.columns = columns;

  const columnCount = columns.length;

  // ----- TITLE ROW (Row 1) -----
  worksheet.mergeCells(1, 1, 1, columnCount); // Merge A1:D1 (or as many columns as needed)
  const titleCell = worksheet.getCell("A1");
  titleCell.value = title;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "f3f4f6" },
  };
  worksheet.getRow(1).height = 30;

  // ----- HEADER ROW (Row 2) -----
  const headerRow = worksheet.getRow(2);
  columns.forEach((col, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = col.header;
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "f3f4f6" }, // Tailwind gray-100
    };
    cell.alignment = { horizontal: "center" };
    worksheet.getColumn(index + 1).width = col.width;
  });
  headerRow.commit();

  // ----- DATA ROWS (from Row 3) -----
  data.forEach((item, i) => {
    const row = worksheet.getRow(i + 3);
    row.values = [
      item.category_name,
      item.category_description,
      item.category_sort_order,
      item.is_active === "true" ? "Active" : "Inactive",
    ];
    row.alignment = { vertical: "middle" };
    row.commit();
  });

  // ----- EXPORT -----
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${title.replace(/\s+/g, "_")}.xlsx`);
};
