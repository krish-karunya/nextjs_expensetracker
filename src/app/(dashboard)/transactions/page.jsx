"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./Datatable";

import axiosInstance from "@/lib/axios";
import { LoaderCircle, X } from "lucide-react";
import { downloadToExcel } from "@/lib/xlsx";
import DatePicker from "../_component/DatePicker";
import DateRangePickers from "../_component/DateRangePicker";
import { Suspense, useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import CustomDatePicker from "../_component/CustomDatePicker";

// const fetchIncomeData = () => {
//   return axiosInstance.get("income");
// };
// const fetchExpenseData = () => {
//   return axiosInstance.get("expense");
// };

const fetchTransactionData = (from, to) => {
  console.log(from, to);

  return axiosInstance.get(`transaction?startDate=${from}&endDate=${to}`);
};

const handleClick = (refetch, setIsOpen) => {
  setIsOpen(false);
  refetch();
};

export default function DemoPage() {
  const [state, setState] = useState([
    {
      startDate: addDays(new Date(), -10),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const startDate = format(state[0].startDate, "yyyy-MM-dd");
  const endDate = format(state[0].endDate, "yyyy-MM-dd");

  console.log("start ->", startDate, "end ->", endDate);

  const {
    data: tranData,
    isLoading: tranLoading,
    refetch,
  } = useQuery({
    queryKey: ["transactionData"],
    queryFn: () => fetchTransactionData(startDate, endDate),
    // suspense: true,
  });

  console.log(tranData);

  console.log("transaction data - >", tranData?.data?.transactions);

  if (tranLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin size-14" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-20 relative">
      {isOpen && (
        <div
          className=" absolute z-20 h-[90vh] w-[90%]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700 whitespace-nowrap">
          Transaction History
        </h1>
        <div className="flex items-center gap-4 ">
          {isOpen && (
            <div className="absolute top-5 z-50 left-10  rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border bg-white border-gray-100 p-6 shadow-2xl">
              <span onClick={() => setIsOpen(false)}>
                <X className="ml-auto mb-4" />
              </span>
              <CustomDatePicker
                state={state}
                setState={setState}
                refetch={refetch}
                setIsOpen={setIsOpen}
              />

              <div className="flex justify-end mt-2">
                <button
                  className="text-sm bg-blue-500 rounded-lg px-10 py-2 text-white font-semibold whitespace-nowrap"
                  title="Click the button to update Date"
                  onClick={() => handleClick(refetch, setIsOpen)}
                >
                  Update
                </button>
              </div>
            </div>
          )}
          <button
            className="text-sm bg-indigo-500 rounded-lg px-6 py-2  text-white font-semibold whitespace-nowrap"
            title="select the Date range here"
            onClick={() => setIsOpen(!isOpen)}
          >
            Select Date
          </button>

          <button
            className="text-sm bg-green-700 rounded-lg px-6 py-2  text-white font-semibold whitespace-nowrap"
            title="Download the data in excel format"
            onClick={() => downloadToExcel(tranData?.data?.transactions)}
          >
            Export to Excel
          </button>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <LoaderCircle className="animate-spin size-14" />
          </div>
        }
      >
        <DataTable columns={columns} data={tranData?.data?.transactions} />
      </Suspense>
    </div>
  );
}
