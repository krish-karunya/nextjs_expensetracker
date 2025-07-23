"use client";

import { addDays } from "date-fns";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import React from "react";
import { DateRangePicker } from "react-date-range";

const CustomDatePicker = ({ state, setState, refetch, setIsOpen }) => {
  console.log(state);

  // useEffect(() => {
  //   refetch();
  // }, [state]);

  return (
    <div className="relative">
      <DateRangePicker
        onChange={(item) => setState([item.selection])}
        showSelectionPreview={true}
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        className="calenderElement"
      />
    </div>
  );
};

export default CustomDatePicker;
