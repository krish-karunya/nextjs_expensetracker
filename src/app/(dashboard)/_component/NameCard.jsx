"use client";
import { useUser } from "@/lib/userContext";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuRadioGroupDemo } from "./DropdownMenuRadioGroupDemo";
import DatePicker from "./DatePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const createIncome = (obj) => {
  return axiosInstance.post("/income", obj);
};

const createExpense = (obj) => {
  return axiosInstance.post("/expense", obj);
};

const NameCard = () => {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [categoryId, setCategoryId] = useState({});
  const queryClient = useQueryClient();

  const { user } = useUser();

  // console.log(amount, description, selectedDate, categoryId._id);

  const { mutate, isPending } = useMutation({
    mutationFn: createIncome,
    onSuccess: (data) => {
      // console.log(data);
      queryClient.invalidateQueries("income");
      queryClient.invalidateQueries("totalExpenseAndIncome");
      toast.success("New Income create successfully");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // expense category :
  const { mutate: expenseFn } = useMutation({
    mutationFn: createExpense,
    onSuccess: (data) => {
      // console.log(data);
      queryClient.invalidateQueries("expense");
      queryClient.invalidateQueries("totalExpenseAndIncome");
      toast.success("New Expense create successfully");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(categoryId).length === 0) {
      toast.error("category field is required");
      return;
    }

    if (amount < 0) {
      toast.error("Please enter the valid income amount");
      return;
    }

    const date = selectedDate?.getDate();
    const month = selectedDate?.getMonth() + 1; // Months are 0-based
    const year = selectedDate?.getFullYear();
    const formatted = `${year}-${month}-${date}`;
    if (!categoryId || !formatted || !amount || !description) {
      toast.error("Missing required fields");
      return;
    }
    mutate({
      amount: Number(amount),
      description,
      categoryId: categoryId._id,
      date: formatted,
    });

    setAmount("");
    setCategoryId("");
    setSelectedDate("");
    setDescription("");
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(categoryId).length === 0) {
      toast.error("category field is required");
      return;
    }
    if (amount < 0) {
      toast.error("Please enter the valid expense amount");
      return;
    }

    if (selectedDate == "") {
      toast.error("Date field is required");
      return;
    }

    const date = selectedDate?.getDate();
    const month = selectedDate?.getMonth() + 1; // Months are 0-based
    const year = selectedDate?.getFullYear();
    const formatted = `${year}-${month}-${date}`;
    if (!categoryId || !formatted || !amount || !description) {
      toast.error("Missing required fields");
      return;
    }
    expenseFn({
      amount: Number(amount),
      description,
      categoryId: categoryId._id,
      date: formatted,
    });

    setAmount("");
    setCategoryId("");
    setSelectedDate("");
    setDescription("");
  };
  return (
    <div>
      <div className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 shadow-lg">
        <div className="flex items-center gap-4 text-3xl font-bold ">
          <SidebarTrigger />
          <h1>Hello , {user?.name}!</h1>
          <motion.div
            animate={{ y: [0, -5, 0], x: [0, -5, 0] }} // Bounce: up and down
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            👋
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-white bg-green-700 px-4 py-2 rounded-lg opacity-75 hover:bg-green-500"
              >
                New Income 😁
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    Create a new{" "}
                    <span className="text-green-700 font-bold">Income</span>{" "}
                    transaction💹
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <div>
                      <Input
                        required
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <p className="text-sm text-gray-600 font-semibold mt-1">
                        Transaction description (required)
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="amount">Amount</Label>
                    <div>
                      <Input
                        id="amount"
                        type="number"
                        name="amount"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <p className="text-sm text-gray-600 font-semibold mt-1">
                        Transaction amount (required)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col justify-center gap-1">
                    <h1 className="text-sm font-bold text-gray-700">
                      Category
                    </h1>
                    <DropdownMenuRadioGroupDemo
                      categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      type={"income"}
                    />
                    <p className="text-sm text-gray-600 font-semibold">
                      Select Category for this transaction
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <h1 className="text-sm font-bold text-gray-700">
                      Transaction date
                    </h1>
                    <DatePicker
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                    <p className="text-sm text-gray-600 font-semibold">
                      Select Date for this
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-white bg-red-700 px-4 py-2 rounded-lg opacity-75 hover:bg-red-500"
              >
                New Expense 😤
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleExpenseSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    Create a new{" "}
                    <span className="text-red-700 font-bold">expense</span>{" "}
                    transaction📉
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <div>
                      <Input
                        id="description"
                        name="description"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <p className="text-sm text-gray-600 font-semibold mt-1">
                        Transaction description (required)
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="amount">Amount</Label>
                    <div>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <p className="text-sm text-gray-600 font-semibold mt-1">
                        Transaction amount (required)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col justify-center gap-1">
                    <h1 className="text-sm font-bold text-gray-700">
                      Category
                    </h1>
                    <DropdownMenuRadioGroupDemo
                      categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      type={"expense"}
                    />
                    <p className="text-sm text-gray-600 font-semibold">
                      Select Category for this transaction
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <h1 className="text-sm font-bold text-gray-700">
                      Transaction date
                    </h1>
                    <DatePicker
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                    <p className="text-sm text-gray-600 font-semibold">
                      Select Date for this
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default NameCard;
