"use client";

import { addDays } from "date-fns";
import { useState } from "react";

import React from "react";
import { DateRangePicker } from "react-date-range";

const CustomDatePicker = ({ date, setDate, refetch }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  return (
    <div>
      <DateRangePicker
        onChange={(item) => setState([item.selection])}
        showSelectionPreview={true}
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        className="calenderElement border border-gray-400"
      />
    </div>
  );
};

export default CustomDatePicker;
