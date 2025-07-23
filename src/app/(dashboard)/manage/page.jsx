"use client";
import React, { Suspense } from "react";
import { IncomeCategory } from "./_component/IncomeCategory";
import { ExpenseCategory } from "./_component/ExpenseCategory";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { LoaderCircle } from "lucide-react";

const fetchCategoryData = () => {
  return axiosInstance.get("category");
};
const ManagePage = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: fetchCategoryData,
  });

  // console.log(data);

  if (isLoading) {
    return (
      <div className="h-screen mt-60">
        <LoaderCircle className="animate-spin size-16 mx-auto" />
      </div>
    );
  }

  const incomeCategory = data.data.category.filter(
    (data) => data.categoryType === "income"
  );
  // console.log(incomeCategory);

  const expenseCategory = data.data.category.filter(
    (data) => data.categoryType === "expense"
  );
  // console.log(expenseCategory);

  return (
    <div className="p-4 ">
      <div className="p-4 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 border shadow-lg shadow-indigo-300 border-gray-200">
        <h1 className="text-gray-700 text-4xl font-bold">Manage</h1>
        <p className="text-lg font-semibold text-gray-400 ">
          Manage Your Income and Expense category
        </p>
      </div>
      <div className="mt-8 relative">
        <div className="  p-2 rounded-lg shadow-2xl shadow-indigo-300">
          <Suspense fallback={<p>Loading lazy component...</p>}>
            <IncomeCategory incomeCategory={incomeCategory} />
          </Suspense>
        </div>

        <hr className="mt-4 bg-gray-600" />
        <div className="  p-2 rounded-lg mt-4 shadow-2xl shadow-indigo-400">
          <Suspense fallback={<p>Loading lazy component...</p>}>
            <ExpenseCategory expenseCategory={expenseCategory} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
