import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
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
    <div className="flex flex-col items-center bg-[#f5f6f8] rounded-lg border-2 border-solid border-[#e2e2e2] py-4 ">
      <h4  className="text-lg font-semibold text-gray-600">{props.car_name}</h4>
      <Image
        src="/car.png"
        width={screenWidth * 0.8}
        height={screenWidth * 0.41}
        alt="picture for login in desktop type "
      />

      <div className="flex flex-row justify-around w-full">
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-gray-500">Patente:</p>
          <p className="text-sm font-medium text-gray-400">{props.registration_number}</p>
        </div>
        <div className="flex flex-col items-center">
          <p  className="text-base font-semibold text-gray-500">Conductor:</p>
          <p className="text-sm font-medium text-gray-400">{props.driver_name}</p>
        </div>
      </div>
      <div className="flex flex-row w-full justify-between px-5">
        <div className="flex flex-col items-center">
            <Icon className="text-2xl  text-[#2F70F2]" icon="material-symbols:savings-outline" />
          <p>{rentabilidad}</p>
        </div>
        <div className="flex flex-col items-center">
        <Icon className="text-2xl  text-[#876AFE]" icon="grommet-icons:money" />
          <p>{props.generated_amount}</p>
        </div>
        <div className="flex flex-col items-center">
        <Icon className="text-2xl  text-[#FFBC02]" icon="material-symbols:receipt-long" />
          <p>{props.wasted_amount}</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
