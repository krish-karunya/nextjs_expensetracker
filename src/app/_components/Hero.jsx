"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import CarouselCard from "./CarouselCard";
import Footer from "./Footer";
import { imageData } from "@/lib/utils";
import Marquee from "react-fast-marquee";

const Hero = () => {
  return (
    <div>
      <motion.div
        className="fixed w-16 md:w-24 right-0  bottom-4 md:right-6 md:bottom-8 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 5,
        }}
      >
        <Image
          src={"/cus-sup.png"}
          width={100}
          height={100}
          className="bg-indigo-200 rounded-full"
          alt="customer-support-image"
        />
      </motion.div>
      <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
        <div className="flex items-center mb-20 justify-between gap-48 w-full">
          <motion.div
            className="max-w-prose  text-left p-10 bg-indigo-50 rounded-2xl "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 5,
            }}
          >
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Take Control of Your{" "}
              <strong className="text-indigo-600"> Finances </strong> with Ease
            </h1>
            <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
              Easily track expenses, analyze spending, and manage your budget -
              all in one smart, stress-free app
            </p>

            <div className="mt-4 flex gap-4 sm:mt-6">
              <Link
                className="inline-block rounded border border-indigo-600 bg-indigo-600 px-16 py-3 font-medium text-white shadow-sm  hover:bg-indigo-700 transition-transform duration-300 hover:scale-110"
                href="#"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, -20, 0] }} // Bounce: up and down
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="hidden md:block"
          >
            <Image
              src="/landingimage.jpg" // Replace with your image path
              alt="Bouncing image"
              width={300}
              height={300}
              className="rounded-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Maequee section */}
      <h1 className="text-center text-3xl text-indigo-400 font-bold">
        {" "}
        Our Technology partners
      </h1>
      <Marquee className="mb-10" pauseOnHover>
        {imageData.map((img, index) => (
          <div key={index} className="flex items-center">
            <Image
              src={img.src}
              alt={img.alt}
              width={100}
              height={100}
              className="my-4 mx-8"
            />
          </div>
        ))}
      </Marquee>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 3 }}
      >
        {/*we can directly mention the path here  */}
        <Image
          src={"/chart.jpg"}
          alt="dashboard"
          width={1200} // Set a base width
          height={600} // Maintain aspect ratio
          className="w-full h-auto"
        />
      </motion.section>
      <section className="h-full mt-20">
        <h1 className="text-center text-3xl font-bold text-indigo-500">
          Testimonial Section
        </h1>
        <CarouselCard />
      </section>
      <Footer />
    </div>
  );
};

export default Hero;
