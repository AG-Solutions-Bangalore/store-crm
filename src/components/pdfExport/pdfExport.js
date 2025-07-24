// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// export const downloadPDF = async (targetId, filename = "report.pdf") => {
//   const input = document.getElementById(targetId);

//   if (!input) {
//     alert("PDF content not found!");
//     return;
//   }

//   try {
//     // Patch unsupported color formats (like oklch)
//     const replaceUnsupportedColors = (element) => {
//       const all = element.querySelectorAll("*");
//       all.forEach((el) => {
//         const style = window.getComputedStyle(el);
//         if (style.color.includes("oklch")) el.style.color = "#000000";
//         if (style.backgroundColor.includes("oklch")) el.style.backgroundColor = "#ffffff";
//         if (style.borderColor.includes("oklch")) el.style.borderColor = "#000000";
//       });
//     };

//     replaceUnsupportedColors(input);

//     // Convert DOM to Canvas
//     const canvas = await html2canvas(input, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     // Set desired margins (in mm)
//     const margin = {
//       top: 20,
//       left: 15,
//       right: 15,
//       bottom: 20,
//     };

//     const contentWidth = pageWidth - margin.left - margin.right;
//     const contentHeight = (canvas.height * contentWidth) / canvas.width;

//     // Ensure content height does not overflow page
//     let renderHeight = contentHeight;
//     let yOffset = margin.top;

//     if (contentHeight + margin.top + margin.bottom > pageHeight) {
//       // Content exceeds one page; handle pagination (optional improvement)
//       console.warn("Content is too tall for one page. Consider adding pagination.");
//       renderHeight = pageHeight - margin.top - margin.bottom;
//     }

//     pdf.addImage(imgData, "PNG", margin.left, yOffset, contentWidth, renderHeight);
//     pdf.save(filename);
//   } catch (error) {
//     console.error("Failed to generate PDF:", error);
//     alert("Something went wrong while generating the PDF.");
//   }
// };
import html2pdf from "html2pdf.js";

export const downloadPDF = (targetId, filename = "report.pdf") => {
  const element = document.getElementById(targetId);

  if (!element) {
    alert("PDF content not found!");
    return;
  }

  // Clean unsupported colors
  const cleanColors = (el) => {
    const elements = el.querySelectorAll("*");
    elements.forEach((node) => {
      const style = window.getComputedStyle(node);
      if (style.color.includes("oklch")) node.style.color = "#000000";
      if (style.backgroundColor.includes("oklch"))
        node.style.backgroundColor = "#ffffff";
      if (style.borderColor.includes("oklch"))
        node.style.borderColor = "#000000";
    });
  };

  cleanColors(element);

  // 👇 Force font-size 14px globally
  element.style.fontSize = "14px";
  const children = element.querySelectorAll("*");
  children.forEach((child) => {
    child.style.fontSize = "14px";
  });

  const options = {
    margin: 5,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .catch((err) => {
      console.error("Error generating PDF:", err);
      alert("Something went wrong while generating the PDF.");
    });
};
