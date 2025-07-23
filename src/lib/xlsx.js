import { format } from "date-fns";
import xlsx from "json-as-xlsx";

export function downloadToExcel(data) {
  console.log("data-from-excel", data);

  let columns = [
    {
      sheet: "IncomeAndExpenseReport",
      columns: [
        { label: "CategoryName", value: "categoryName" },
        {
          label: "Date",
          value: (row) => format(row.transactionDate, "yyyy-MM-dd"),
        },
        { label: "Description", value: "description" },
        { label: "Type", value: "transactionType" },
        { label: "Amount", value: "amount" },
      ],
      content: data,
    },
  ];
  let settings = {
    fileName: "HistoryOfIncomeAndExpense",
  };

  xlsx(columns, settings);
}
//  {
//         "_id": "686ccdabfbbd059c3c979108",
//         "amount": 3000,
//         "description": "DSA Course",
//         "date": 8,
//         "month": 7,
//         "year": 2025,
//         "categoryName": "education",
//         "type": "expense"
//     },
