"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@/lib/userContext";

const SignUpForm = ({ setIsOpen }) => {
  const [isSignUpForm, setIsSignUpForm] = useState(true);
  const { register, handleSubmit, formState, unregister } = useForm();
  const { errors, isSubmitting } = formState;
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleInput = async (data) => {
    // console.log(data);

    try {
      if (isSignUpForm) {
        const res = await axiosInstance.post("/auth/signup", data);
        // console.log(res?.data?.user);
        setUser(res?.data?.user);
        toast.success(res.data?.message);

        // store the user in to local storage :
        localStorage.setItem("user", JSON.stringify(res?.data?.user));
      } else {
        const res = await axiosInstance.post("/auth/login", data);
        // console.log("signup component", res?.data);
        setUser(res?.data?.user);
        toast.success(res.data?.message);

        localStorage.setItem("user", JSON.stringify(res?.data?.user));
      }
      setIsOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  // if the login form mean we need to unregister the userName
  useEffect(() => {
    if (!isSignUpForm) {
      unregister("name");
    }
  }, [isSignUpForm, unregister]);

  return (
    <div
      className="fixed top-1/2 left-1/2 w-full md:w-[40%]
             -translate-x-1/2 -translate-y-1/2 
 z-200 bg-gray-0 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-90 border border-gray-800 p-4 my-8"
    >
      {/* <Image
        src={"/saving.gif"}
        width={100}
        height={100}
        className="bg-indigo-200 rounded-full"
        alt="customer-support-image"
      /> */}
      <form
        onSubmit={handleSubmit(handleInput)}
        className="flex flex-col gap-4 justify-center"
      >
        <div className="relative">
          <h1 className="text-center mt-2 text-2xl font-bold text-indigo-500">
            {isSignUpForm ? " Sign Up Form" : "Log In"}{" "}
          </h1>
          <X
            className="absolute right-0 top-0 text-gray-500 hover:text-black"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {isSignUpForm && (
          <div>
            <div className="flex items-center justify-center gap-4">
              <label
                htmlFor="name"
                className="text-indigo-500 font-bold mr-2 hidden md:block"
              >
                Name :
              </label>

              <input
                type="text"
                className=" w-full md:w-[50%] border border-gray-500 px-4 py-2 rounded-lg"
                id="name"
                placeholder="Please Enter your name"
                {...register("name", {
                  required: {
                    value: true,
                    message: "name is required",
                  },
                })}
              />
            </div>

            <p className="text-sm text-red-500 text-center">
              {errors.name?.message}
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-center gap-4">
            <label
              htmlFor="email"
              className="text-indigo-500 font-bold mr-2 hidden md:block"
            >
              Email :
            </label>
            <input
              type="email"
              className="w-full md:w-[50%] border border-gray-500 px-4 py-2 rounded-lg"
              id="email"
              placeholder="Please Enter your email"
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "please Enter the valid email",
                },
                required: {
                  value: true,
                  message: "email is required",
                },
              })}
            />
          </div>
          <p className="text-sm text-red-500 text-center">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-center">
            <label
              htmlFor="password"
              className="text-indigo-500 font-bold mr-1 hidden md:block"
            >
              Password :
            </label>
            <input
              type="password"
              className="w-full md:w-[50%] border border-gray-500 px-4 py-2 rounded-lg"
              id="password"
              placeholder="Please Enter your password"
              {...register("password", {
                required: {
                  value: true,
                  message: "password is required",
                },
              })}
            />
          </div>
          <p className="text-sm text-red-500 text-center">
            {errors.password?.message}
          </p>
        </div>
        <button className="bg-indigo-500 text-gray-200 flex items-center justify-center font-semibold mx-auto w-[50%] border-2 border-indigo-300  px-4 py-2 rounded-full">
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : "Submit"}
        </button>
      </form>
      {/* <DevTool control={control} /> */}
      {isSignUpForm && (
        <p
          className="text-center text-sm mt-1 text-white md:text-gray-500"
          onClick={() => setIsSignUpForm(!isSignUpForm)}
        >
          Already have a Account ?
          <span className="ml-2 text-indigo-500 font-semibold hover:underline">
            Log in
          </span>
        </p>
      )}
      {!isSignUpForm && (
        <p
          className="text-center text-sm mt-1 text-white md:text-gray-500"
          onClick={() => setIsSignUpForm(!isSignUpForm)}
        >
          New User ?
          <span className="ml-2 text-indigo-500 font-semibold hover:underline ">
            Sign Up
          </span>
        </p>
      )}
    </div>
  );
};

export default SignUpForm;
