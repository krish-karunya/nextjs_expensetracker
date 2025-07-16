import xlsx from "json-as-xlsx";

export function downloadToExcel(data) {
  let columns = [
    {
      sheet: "IncomeAndExpenseReport",
      columns: [
        { label: "CategoryName", value: "categoryName" },
        {
          label: "Date",
          value: (row) => `${row.date}/${row.month}/${row.year}`,
        },
        { label: "Description", value: "description" },
        { label: "Type", value: "type" },
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
