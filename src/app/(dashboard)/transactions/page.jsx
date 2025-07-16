"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./Datatable";
import { dummyData } from "@/lib/constant";
import axiosInstance from "@/lib/axios";
import { LoaderCircle } from "lucide-react";
import { downloadToExcel } from "@/lib/xlsx";
import DatePicker from "../_component/DatePicker";
import DateRangePickers from "../_component/DateRangePicker";
import { useState } from "react";
import { addDays } from "date-fns";
import CustomDatePicker from "../_component/CustomDatePicker";

// const fetchIncomeData = () => {
//   return axiosInstance.get("income");
// };
// const fetchExpenseData = () => {
//   return axiosInstance.get("expense");
// };

const fetchTransactionData = (from, to) => {
  return axiosInstance.get(`transaction?startDate=${from}&endDate=${to}`);
};

const handleClick = (refetch) => {
  refetch();
};

export default function DemoPage() {
  const [date, setDate] = useState({
    from: addDays(new Date(), -20),
    to: new Date(),
  });

  console.log("from ->", date.from);

  const formatDateToYMD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // or use '/' instead of '-'
  };
  // console.log(date.from.toLocaleDateString("en-IN")); // e.g. 25/6/2025
  // console.log(date.to.toLocaleDateString("en-IN"));

  // console.log(date);

  const fromDate = formatDateToYMD(date.from);
  const toDate = formatDateToYMD(date.to);

  // Create a API to fetch the transaction Details :

  const {
    data: tranData,
    isLoading: tranLoading,
    refetch,
  } = useQuery({
    queryKey: ["transactionData"],
    queryFn: () => fetchTransactionData(fromDate, toDate),
  });
  console.log(tranData);

  console.log("transaction data - >", tranData?.data?.transactions);

  // const { data: incomeData, isLoading } = useQuery({
  //   queryKey: ["incomeTableData"],
  //   queryFn: () => fetchIncomeData(date),
  // });
  // console.log(incomeData?.data?.incomeList);
  // const income = incomeData?.data?.incomeList;

  // const { data: expenseData, isLoading: expenseDataLoading } = useQuery({
  //   queryKey: ["expenseTableData"],
  //   queryFn: fetchExpenseData,
  // });
  // console.log(expenseData?.data?.expenseList);
  // const expense = expenseData?.data?.expenseList;

  // if (isLoading || expenseDataLoading) {
  //   return (
  //     <div className="w-full h-screen flex justify-center items-center">
  //       <LoaderCircle className="animate-spin size-16 mx-auto" />
  //     </div>
  //   );
  // }

  // let total = [...income, ...expense];

  // Sort by year, month, and date
  // const totalIncomeAndExpense = total.sort((a, b) => {
  //   const aDate = new Date(a.year, a.month - 1, a.date);
  //   const bDate = new Date(b.year, b.month - 1, b.date);
  //   return aDate - bDate;
  // });

  if (tranLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-20">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700 whitespace-nowrap">
          Transaction History
        </h1>
        <div className="flex items-center gap-4">
          <DateRangePickers date={date} setDate={setDate} refetch={refetch} />
          {/* <CustomDatePicker date={date} setDate={setDate} refetch={refetch} /> */}
          <button
            className="text-sm bg-violet-500 rounded-lg px-6 py-2  text-white font-semibold whitespace-nowrap"
            onClick={() => handleClick(refetch)}
          >
            Update
          </button>
          <button
            className="text-sm bg-green-700 rounded-lg px-6 py-2  text-white font-semibold whitespace-nowrap"
            onClick={() => downloadToExcel(tranData?.data?.transactions)}
          >
            Export to Excel
          </button>
        </div>
      </div>
      <DataTable columns={columns} data={tranData?.data?.transactions} />
    </div>
  );
}
