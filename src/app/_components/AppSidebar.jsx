"use client";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  Sidebar,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";
import {
  ChartColumnIncreasing,
  BadgeDollarSign,
  SquareChartGantt,
  User2,
  ChevronUp,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { useUser } from "@/lib/userContext";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: BadgeDollarSign,
  },
  {
    title: "Manage",
    url: "/manage",
    icon: SquareChartGantt,
  },
];

const handleLogOut = () => {
  return axiosInstance.post("auth/logout");
};
const AppSidebar = () => {
  const path = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useUser();
  // console.log(user);

  const { mutate } = useMutation({
    mutationFn: handleLogOut,
    onSuccess: () => {
      queryClient.invalidateQueries("expense");
      router.push("/");
      toast.success("Logged out Successfully");
    },
    onError: () => {
      console.log(error);
    },
  });

  return (
    <div>
      <Sidebar collapsible="icon">
        <SidebarHeader className={"font-bold text-gray-700 "}>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className={"mb-[20px] flex items-center justify-start"}
              >
                <div className="flex items-center mt-4">
                  <Link href={"/dashboard"}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 30 30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide  lucide-piggy-bank stroke h-11 w-8 stroke-indigo-700 stroke-[1.5]"
                    >
                      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"></path>
                      <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
                      <path d="M16 11h0"></path>
                    </svg>
                  </Link>
                  <p className="text-indigo-500 text-xl font-bold leading-tight tracking-tighter mb-2">
                    BudgetTracker
                  </p>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <Link className="w-full" key={item.title} href={item.url}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={`p-2  ${
                        path === item.url &&
                        "bg-indigo-400 text-white hover:bg-indigo-400 hover:text-white"
                      }`}
                    >
                      <item.icon /> {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu className={"bg-red-300"}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {user?.user?.name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="bg-indigo-400  rounded-lg text-sm text-white px-2 py-2 flex flex-col gap-2"
                >
                  <DropdownMenuItem>
                    <span className="py-4 px-6">About</span>
                  </DropdownMenuItem>

                  <hr />
                  <DropdownMenuItem>
                    <span className="py-4 px-6">Profile</span>
                  </DropdownMenuItem>
                  <hr />
                  <DropdownMenuItem onClick={() => mutate()}>
                    <span className="py-4 px-6">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
