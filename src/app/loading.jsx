import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div>
      <Image src={"/saving"} width={100} height={100} alt="loading" />
    </div>
  );
};

export default loading;
