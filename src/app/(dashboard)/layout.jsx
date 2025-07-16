import React from "react";
import AppSidebar from "../_components/AppSidebar";
// import { ReactQueryProvider } from "@/lib/react-query-provider";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="w-full">
        <div className="w-[100%] flex justify-between shadow-lg"></div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
