"use client";
import CountUp from "react-countup";

const AnimatedCounter = ({ end, color = "" }) => {
  return (
    <h1 className={`${color ? color : ""} text-4xl font-bold text-green-600`}>
      <CountUp start={0} end={end} duration={2.5} separator="," />
    </h1>
  );
};

export default AnimatedCounter;
