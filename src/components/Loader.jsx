import React from "react";
import { BounceLoader } from "react-spinners";
const Loader = () => {
  return (
    <div className="loader">
      <BounceLoader color="rgb(180, 83, 9)" size={40} />
    </div>
  );
};

export default Loader;
