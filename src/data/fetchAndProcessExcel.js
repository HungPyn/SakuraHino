import * as XLSX from "xlsx";

export const fetchAndProcessExcel = async (url) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const questionsData = {
      N2: {},
    };
    const rows = jsonData.slice(1);

    rows.forEach((row) => {
      const [group, question, ...options] = row;
      const answer = options.find((option) => option === row[row.length - 1]);

      if (!questionsData.N2[group]) {
        questionsData.N2[group] = [];
      }

      questionsData.N2[group].push({
        question: question,
        options: options.slice(0, -1),
        answer: answer,
      });
    });

    return questionsData;
  } catch (error) {
    console.error("Lỗi khi xử lý file Excel:", error);
    return null;
  }
};
