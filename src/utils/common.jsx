import * as XLSX from "xlsx";

export const convertImageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
      .catch(reject);
  });
};

export const exportExcel = (data, fileName) => {
  // Create a new workbook and add a worksheet
  const ws = XLSX.utils.json_to_sheet(data); // convert your data to worksheet
  const wb = XLSX.utils.book_new(); // create a new workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // add the worksheet to the workbook

  // Export the workbook to an Excel file
  XLSX.writeFile(wb, `${fileName}.xlsx`); // specify the file name
};

export const partnersImage = {
  DL: "/images/logo/delhivery.webp",
  DT: "/images/logo/dtdc.jpg",
  DX: "/images/logo/Express.png",
};
