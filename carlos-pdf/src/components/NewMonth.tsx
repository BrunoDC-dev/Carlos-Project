import React from "react";
import { Icon } from "@iconify/react";
interface NewMonthPorps {
    mesAccordion : boolean
  }

const NewMonth = (props:NewMonthPorps) => {

  return (
    <div className={props.mesAccordion? "w-full h-full transition-all duration-300 ease-in-out bg-[#ffffff]": "transition-all ease-in-out	duration-300 w-0 h-0"}>
    <h1 className="text-gray-800 text-3xl text-center">hi</h1>
    </div>
  );
};

export default NewMonth;
