import Image from "next/image";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import MonthCard from "@/components/MonthCard";
import VehicleCard from "@/components/VehicleCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/navigation";
import LoaderLogo from "@/components/LoaderLogo";
const Cookies = require("js-cookie");
import "swiper/css";
import { it } from "node:test";
const inter = Inter({ subsets: ["latin"] });

interface VehicleData {
  car_name: string;
  registration_number: string;
  driver_name: string;
  img_src: string;
  revenue: number;
  expenses: number;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [data, setData] = useState<VehicleData[]>([]);
  const router = useRouter();
  const dataFetching = async () => {
    const data = {
      email: Cookies.get("email"),
      sessionId: Cookies.get("remis_session_id"),
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/revenueExpenses";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    try {
      const response_dirty = await fetch(endpoint, options);
      if (response_dirty.status === 200) {
        const response_clean = await response_dirty.json();
        setData(response_clean);
        for (let index = 0; index < response_clean.length; index++) {
          setExpenses(response_clean[index].expenses + expenses);
          setRevenue(response_clean[index].revenue + revenue);
        }
        setLoading(false);
      }
    } catch (error) {}
  };
  const loginChecker = async () => {
    const data = {
      email: Cookies.get("email"),
      sessionId: Cookies.get("remis_session_id"),
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/session";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    try {
      const response_dirty = await fetch(endpoint, options);
      if (response_dirty.status === 200) {
        dataFetching();
      } else {
        router.push("/login");
      }
    } catch (error) {}
  };
  useEffect(() => {
    loginChecker();
  }, []);
  return loading ? (
    <LoaderLogo />
  ) : (
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
              current_amount={revenue - expenses}
              previous_amount={50}
              topic="Rentabilidad"
            />
            <MonthCard
              current_amount={revenue}
              previous_amount={50}
              topic="Facturacion"
            />
            <MonthCard
              current_amount={expenses}
              previous_amount={50}
              topic="Gastos"
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-600 pb-8">
            Tus Camionetas:
          </h2>
          <Swiper>
            {data.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <VehicleCard
                    car_name={item.car_name}
                    registration_number={item.registration_number}
                    driver_name={item.driver_name}
                    img_src="ds"
                    generated_amount={item.revenue}
                    wasted_amount={item.expenses}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </main>
  );
}
