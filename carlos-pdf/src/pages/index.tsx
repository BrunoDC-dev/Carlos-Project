import Image from "next/image";
import { Inter } from "next/font/google";
import MonthCard from "@/components/MonthCard";
import VehicleCard from "@/components/VehicleCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  let cars = ["id"];
  return (
    <main className="bg-[#f6f6f6] min-h-full">
      <div className="py-1 flex flex-row justify-center items-center w-full text-[#ffff] bg-[#355B3E]">
        <div className="max-w-[40px]">
          <Image
            src="/Logo.png"
            width={40}
            height={36}
            alt="Picture of login for the web"
          />
        </div>
        <p className="w-fit">Eclipse Lab</p>
      </div>
      <div className="px-2 py-5">
        <h1 className="text-2xl font-bold text-[#2f3d4c]">
          Bienvenido de vuelta !!!
        </h1>
        <div className="py-2">
          <h2 className="text-xl font-semibold text-gray-600">Novedades:</h2>
          <div className="flex flex-col items-center gap-8  py-8">
            <MonthCard
              current_amount={100}
              previous_amount={50}
              topic="Rentabilidad"
            />
            <MonthCard
              current_amount={100}
              previous_amount={50}
              topic="Facturacion"
            />
            <MonthCard
              current_amount={100}
              previous_amount={50}
              topic="Gastos"
            />
          </div>
        </div>
    <div>
    <h2 className="text-xl font-semibold text-gray-600 pb-8">Tus Camionetas:</h2>
      <Swiper>
        {cars.map((id,index)=>{
          return (
            <SwiperSlide key={index}>
               <VehicleCard
              car_name="Kangoo"
              registration_number="acffaa"
              driver_name="Omar"
              img_src="ds"
              generated_amount={100}
              wasted_amount={50}
            />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
      </div>

    </main>
  );
}
