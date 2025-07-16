"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

const fetchCategoryData = () => {
  return axiosInstance.get("/category");
};

export function DropdownMenuRadioGroupDemo({
  categoryId,
  setCategoryId,
  type,
}) {
  console.log("category-id", categoryId);
  console.log("tye -", type);

  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: fetchCategoryData,
  });

  const categories = data?.data?.category || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {Object.keys(categoryId).length === 0
            ? "Select Category"
            : categoryId.name}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Category</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Button variant={"outline"} className="w-full justify-start">
          <Link
            href={"/manage"}
            className="flex items-center justify-center gap-2 ml-4"
          >
            Create Category <CirclePlus className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup
          value={categoryId}
          onValueChange={(value) => setCategoryId(value)}
        >
          {categories.map((data) => {
            return (
              <div key={data._id}>
                {data.categoryType === type && (
                  <DropdownMenuRadioItem value={data}>
                    {data.name}
                  </DropdownMenuRadioItem>
                )}
              </div>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
