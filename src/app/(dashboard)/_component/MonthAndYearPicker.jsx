import { yearData } from "@/lib/constant";
import { months } from "@/lib/utils";
import * as React from "react";
import { ChevronDown } from "lucide-react";

export function MonthAndYearPicker({
  // dashboardMonth,
  // setDashboardMonth,
  handleYearChanges,
  dashboardYear,
  setDashboardYear,
}) {
  // console.log(dashboardYear);

  // const handleChange = (e) => {
  //   setDashboardMonth(e.target.value);
  // };
  const handleYearChange = (e) => {
    setDashboardYear(e.target.value);
  };

  // console.log(yearData);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(dashboardYear);
    handleYearChanges(dashboardYear);
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-4">
        <form
          onSubmit={handleSubmit}
          className=" relative flex items-center border  border-gray-300 rounded-lg px-2"
        >
          {/* <select
            name="month"
            value={dashboardMonth}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="">Select Month</option>
            {months.map((mn) => (
              <option value={mn} key={mn}>
                {mn}
              </option>
            ))}
          </select> */}

          <select
            name="year"
            value={dashboardYear}
            onChange={handleYearChange}
            className=" p-2 border-none outline-none rounded-lg appearance-none"
          >
            <option value="">Select Year</option>
            {yearData.map((ye) => (
              <option value={ye} key={ye}>
                {ye}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <ChevronDown size={16} />
          </span>
        </form>
      </div>
    </div>
  );
}
