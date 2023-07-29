import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import NewMonth from "./NewMonth";
interface VehicleCardProps {
  car_name: string;
  registration_number: string;
  driver_name: string;
  img_src: string;
  generated_amount: number;
  wasted_amount: number;
}
const VehicleCard = (props: VehicleCardProps) => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [mesAccordion, setMesAccordion] = useState(false);
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener to update screen width on resize
    window.addEventListener("resize", updateScreenWidth);

    // Initial screen width
    updateScreenWidth();

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);
  let rentabilidad = Math.round(
    ((props.generated_amount - props.wasted_amount) / props.wasted_amount) *
      100,
  );

  return (
    <div className="flex flex-col items-center bg-[#ffffff] rounded-2xl border-2 border-solid border-[#e2e2e2] pt-4 drop-shadow-lg	">
      <h4 className="text-lg font-semibold text-gray-600">{props.car_name}</h4>
      <Image
        src="/car.png"
        width={screenWidth * 0.8}
        height={screenWidth * 0.41}
        alt="picture for login in desktop type "
      />

      <div className="flex flex-row justify-around w-full py-3">
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-gray-500">Patente:</p>
          <p className="text-sm font-medium text-gray-400">
            {props.registration_number}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-gray-500">Conductor:</p>
          <p className="text-sm font-medium text-gray-400">
            {props.driver_name}
          </p>
        </div>
      </div>
      <div className="flex flex-row w-full justify-around px-5 pt-3 bg-[#EAECF0] border-2 border-solid border-[#E2E2E2]">
        <div className="flex flex-col items-center">
          <Icon
            className="text-3xl  text-[#2F70F2]"
            icon="material-symbols:savings-outline"
          />
          <p className="pb-1 font-semibold text-lg">{Number.isNaN(rentabilidad)?0:rentabilidad}%</p>
        </div>
        <div className="flex flex-col items-center">
          <Icon
            className="text-3xl  text-[#876AFE]"
            icon="grommet-icons:money"
          />
          <p className="pb-1 font-semibold text-lg">
            ${props.generated_amount}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Icon
            className="text-3xl  text-[#FFBC02]"
            icon="material-symbols:receipt-long"
          />
          <p className="pb-1 font-semibold text-lg">${props.wasted_amount}</p>
        </div>
      </div>
      <div  className="bg-[#355B3E] w-full text-[#fafafa] rounded-b-lg  hover:bg-[#fafafa] hover:text-[#355B3E] " onClick={()=>setMesAccordion(!mesAccordion)}>
      <p  className=" text-center py-1 font-normal  "
      >
        Nuevo Mes
      </p>
      <NewMonth mesAccordion={mesAccordion}/>
      </div>

    </div>
  );
};

export default VehicleCard;
