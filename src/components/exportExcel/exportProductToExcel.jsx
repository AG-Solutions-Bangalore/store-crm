import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportProductTOExcel = async (data, title = "Product Report") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Product Report");

  // Define columns
  const columns = [
    { header: "Product Name", key: "product_name", width: 25 },
    { header: "Brand", key: "product_brand", width: 20 },
    { header: "Unit", key: "unit_combined", width: 15 },
    { header: "MRP", key: "product_mrp", width: 15 },
    { header: "Selling Price", key: "product_selling_price", width: 15 },
    { header: "Offer Price", key: "product_spl_offer_price", width: 15 },
    { header: "Status", key: "is_active", width: 15 },
  ];
  worksheet.columns = columns;

  const columnCount = columns.length;

  // ----- TITLE ROW (Row 1) -----
  worksheet.mergeCells(1, 1, 1, columnCount);
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
      fgColor: { argb: "f3f4f6" },
    };
    cell.alignment = { horizontal: "center" };
    worksheet.getColumn(index + 1).width = col.width;
  });
  headerRow.commit();

  // ----- DATA ROWS (from Row 3) -----
  data.forEach((item, i) => {
    const row = worksheet.getRow(i + 3);
    row.values = [
      item.product_name,
      item.product_brand,

      `${item.product_unit_value} ${item.unit}`,
      item.product_mrp,
      item.product_selling_price,
      item.product_spl_offer_price,
      item.is_active === "true" ? "Active" : "Inactive",
    ];
    row.alignment = { vertical: "middle" };
    row.commit();
  });

  // ----- EXPORT -----
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${title.replace(/\s+/g, "_")}.xlsx`);
};
