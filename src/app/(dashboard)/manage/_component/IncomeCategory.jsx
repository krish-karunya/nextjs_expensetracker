import { Button } from "@/components/ui/button";
import { Delete, Plus, Trash, TrendingUp } from "lucide-react";
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
import React, { useState } from "react";
import EmojiInput from "./EmojiInput";
import { ca } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/lib/userContext";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
// import EmojiPicker from "emoji-picker-react";

const createIncomeCategory = (obj) => {
  // console.log(obj);

  return axiosInstance.post("/category", obj);
};
const deleteCategory = (id) => {
  // console.log("delete category fn", id);

  return axiosInstance.delete(`/category/${id}`);
};
export const IncomeCategory = ({ incomeCategory }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  // mutation logic :
  const { mutate } = useMutation({
    mutationFn: createIncomeCategory,
    onSuccess: (data) => {
      // console.log(data);
      queryClient.invalidateQueries("category");
      toast.success("New category is created");
      setName("");
      setEmoji("");
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // delete mutation logic :
  const { mutate: deleteMutate, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries("category");
      toast.success(`${data.data.message} `);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !emoji) {
      toast.error("Please provide both name and emoji");
      return;
    }
    mutate({ name, emoji, categoryType: "income", userId: user.id });
  };
  return (
    <div>
      <header>
        <div className="flex items-center flex-col gap-2 md:gap-0 md:flex-row justify-between  border border-gray-400 p-4 rounded-lg bg-green-100">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-300 rounded-lg text-green-900 w-14">
              <TrendingUp />
            </div>
            <div className=" flex flex-col justify-center">
              <h1 className="text-xl font-bold text-gray-600">
                Income Categories
              </h1>
              <p className="text-sm text-gray-500 font-semibold hidden md:block">
                Income Categories list
              </p>
            </div>
          </div>
          <div className="flex item-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className={"text-gray-700"}>
                  <span className="p-1 hidden md:block rounded-full border border-gray-400 bg-gray-800 text-white font-semibold">
                    <Plus />
                  </span>
                  Create Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      Create <span className="text-green-700">Income</span>{" "}
                      Category
                    </DialogTitle>
                    <DialogDescription>
                      Categories are used to group your transactions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">Name</Label>
                      <div>
                        <Input
                          id="name-1"
                          name="name"
                          placeholder="category"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <p className="text-sm text-gray-500 font-semibold ml-4">
                          This is how your category will appear in the app
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">Icon</Label>
                      <EmojiInput emoji={emoji} setEmoji={setEmoji} />
                    </div>
                  </div>
                  <DialogFooter className={"mt-4"}>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main>
        <div className="grid  grid-cols-1   md:grid-cols-2  lg:grid-cols-4 gap-4 mt-8">
          {incomeCategory.map((data) => (
            <div
              className="flex flex-col rounded-lg h-36 border   hover:scale-95 duration-150 border-gray-300"
              key={data._id}
            >
              <div className="flex flex-col justify-center mt-6 mx-auto">
                <span className="text-center text-xl">{data.emoji}</span>
                <span className="font-semibold">{data.name}</span>
              </div>
              <button
                className="flex items-center mt-auto justify-center gap-2 rounded-b-lg  bg-gray-200  py-5 px-6 h-8 hover:bg-red-300 "
                onClick={() => deleteMutate(data._id)}
              >
                <Trash /> <span className="font-semibold">Remove</span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
