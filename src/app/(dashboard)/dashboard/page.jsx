"use client";

import React, { useState } from "react";
import NameCard from "../_component/NameCard";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ChartBarMultiple, SalesChart } from "../_component/Dashboard";
import AnimatedCounter from "../_component/AnimatedCounter";
import DatePicker from "../_component/DatePicker";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { SkeletonCard } from "../_component/SkeletonCard";
import { MonthAndYearPicker } from "../_component/MonthAndYearPicker";
import { months } from "@/lib/utils";
import { motion } from "framer-motion";

const FetchExpenseData = (formatted) => {
  return axiosInstance.get(`expense/month/${formatted}`);
};
const FetchIncomeData = (formatted) => {
  return axiosInstance.get(`income/month/${formatted}`);
};

const fetchTotalIncomeAndExpense = (formatted) => {
  return axiosInstance.get(`/month-history/${formatted}`);
};

// current Date:
const today = new Date();

const page = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [dashboardMonth, setDashboardMonth] = useState(
    months[new Date().getMonth()]
  );
  const [dashboardYear, setDashboardYear] = useState(new Date().getFullYear());
  const month = selectedDate?.getMonth() + 1;
  const year = selectedDate?.getFullYear();
  let formatted = `${month}/${year}`;
  // console.log(formatted);

  const handleChange = (date) => {
    setSelectedDate(date);
    // Use the date passed in, NOT the state
    const month = date?.getMonth() + 1;
    const year = date?.getFullYear();
    formatted = `${month}/${year}`;

    // Trigger refetches using the newly formatted date
    refetch(); // Expense
    incomeRefetch(); // Income
    monthHistoryRefetch(); // TotalExpenseAndIncome
  };
  // fetching the TotalExpense and TotalIncome :
  const {
    data: TotalExpenseAndIncome,
    isLoading: monthHistoryLoading,
    refetch: monthHistoryRefetch,
  } = useQuery({
    queryKey: ["totalExpenseAndIncome"],
    queryFn: () => fetchTotalIncomeAndExpense(formatted),
  });

  console.log(
    "TotalExpenseAndIncome",
    TotalExpenseAndIncome?.data.monthHistoryData[0]
  );
  const cardData = TotalExpenseAndIncome?.data.monthHistoryData[0];

  // Expense Data Fetching :
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["expense"],
    queryFn: () => FetchExpenseData(formatted),
  });

  // Income Data Fetching :
  const { data: IncomeData, refetch: incomeRefetch } = useQuery({
    queryKey: ["income"],
    queryFn: () => FetchIncomeData(formatted),
  });
  console.log("income Data -", IncomeData);
  const IncomeList = IncomeData?.data;
  console.log(IncomeList);

  const expenseList = data?.data.expenses;
  console.log("Expense List from dashboard", expenseList);
  if (monthHistoryLoading)
    return (
      <div>
        <SkeletonCard />
      </div>
    );

  if (isLoading) {
    return (
      <div>
        <SkeletonCard />
      </div>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  const handleYearChanges = (year) => {
    setDashboardYear(year);
  };

  const dashBoardRefetch = (refetchData) => {
    console.log("-------------------------------------------");

    refetchData();
  };
  return (
    <div className="h-screen">
      <div className="w-full">
        <NameCard />
      </div>
      <div className="p-12 w-full">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-gray-600">Overview</h1>
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
          <div className="border border-gray-100 rounded-lg p-4 flex gap-6 bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 col-span-1 shadow-lg">
            <div className="flex items-center bg-green-300 opacity-45 rounded-lg p-6">
              <TrendingUp className="text-green-700" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-gray-500 text-xl font-medium">Income</p>

              <div className="font-medium text-gray-700 text-2xl md:text-3xl flex items-center gap-2">
                <span className="text-green-500">$</span>
                <AnimatedCounter
                  end={cardData?.totalIncome}
                  color={"text-green-500"}
                />
              </div>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-4 flex gap-6 bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 col-span-1 shadow-lg">
            <div className=" p-6 flex items-center bg-red-300 opacity-45 rounded-lg">
              <TrendingDown className="text-red-700" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-gray-500 text-xl font-medium">Expense</p>
              <div className="font-medium text-gray-700 text-2xl md:text-3xl flex items-center gap-2">
                <span className="text-red-500">$</span>
                <AnimatedCounter
                  end={cardData?.totalExpense}
                  color={"text-red-500"}
                />
              </div>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-4 flex gap-6 bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 col-span-1 shadow-lg">
            <div className=" p-6 flex items-center bg-indigo-300 opacity-45 rounded-lg">
              <Wallet className="text-indigo-700" />
            </div>
            <div>
              <p className="text-gray-500 text-xl font-medium">Balance</p>
              <div className="font-medium text-gray-700 text-2xl md:text-3xl flex items-center gap-2">
                <span className="text-indigo-500">$</span>
                <AnimatedCounter
                  end={cardData?.totalBalance}
                  color={"text-indigo-500"}
                />{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 p-4 w-full">
          {/* income */}

          <div className="flex-1 mb-1 ml-1">
            <h1 className="text-xl font-semibold text-green-500">
              Income by category
            </h1>
            <div className="flex-1 bg-gray-100 p-5 rounded-lg shadow-lg w-full h-56 max-h-52 overflow-scroll overflow-x-hidden">
              <div>
                {IncomeList?.length == 0 && (
                  <div className="mt-6 ml-6 font-semibold text-gray-800">
                    No income data for this month
                  </div>
                )}
                {IncomeList?.map((data) => (
                  <div className="mt-2" key={data._id}>
                    <div className="flex justify-between font-semibold text-gray-200 bg-gray-500 py-2 rounded px-4">
                      {" "}
                      <span>{data?.description}</span>
                      <span>${data?.amount}</span>
                    </div>
                    {/* <Progress value={80} bgcolor={"bg-green-800"} /> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-red-500 mb-1 ml-1">
              Expense by category
            </h1>
            {/* expense */}
            <div className="flex-1 bg-gray-100 p-5 rounded-lg shadow-lg w-full h-56 max-h-52 overflow-scroll overflow-x-hidden">
              <div>
                {" "}
                {expenseList?.length == 0 && (
                  <div className="mt-6 ml-6 font-semibold text-gray-800">
                    No expense data for this month
                  </div>
                )}
                {expenseList?.map((data) => (
                  <div className="mt-2 " key={data._id}>
                    <div className="flex justify-between font-semibold text-gray-200 bg-gray-500 py-2 rounded px-4  max-h-52 ">
                      <span>{data.description}</span>
                      <span>${data.amount}</span>
                    </div>
                    {/* <Progress value={80} bgcolor={"bg-red-800"} /> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* dashboard */}
        <div>
          <div className="mb-4 flex items-center justify-end gap-4 text-xl text-gray-700 font-semibold">
            <div className="flex items-center gap-2">
              <span className="mt-2">
                Select here to view the yearly report {`-`}
              </span>
              <MonthAndYearPicker
                dashboardYear={dashboardYear}
                setDashboardYear={setDashboardYear}
                handleYearChanges={handleYearChanges}
              />
            </div>
          </div>
          <ChartBarMultiple
            // dashboardMonth={dashboardMonth}
            dashboardYear={dashboardYear}
            dashBoardRefetch={dashBoardRefetch}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
