import Image from "next/image";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import MonthCard from "@/components/MonthCard";
import VehicleCard from "@/components/VehicleCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";
import LoaderLogo from "@/components/LoaderLogo";
const Cookies = require("js-cookie");
import "swiper/css/pagination";
import "swiper/css";
import { it } from "node:test";
const inter = Inter({ subsets: ["latin"] });

interface VehicleData {
  car_name: string;
  registration_number: string;
  driver_name: string;
  img_src: string;
  recent_revenue: number;
  recent_expenses: number;
}

export default function Home() {
  const [screenWidth, setScreenWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentRevenue, setRecentRevenue] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState(0);
  const [previousRevenue, setPreviousRevenue] = useState(0);
  const [previousExpenses, setPreviousExpenses] = useState(0);
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
        console.log(response_clean);
        setData(response_clean);
        let recentExpensesSum = 0;
        let recentRevenueSum = 0;
        let previousExpensesSum = 0;
        let previousRevenueSum = 0;

        // Loop through the response data and calculate the sums
        for (let index = 0; index < response_clean.length; index++) {
          recentExpensesSum += response_clean[index].recent_expenses;
          recentRevenueSum += response_clean[index].recent_revenue;
          previousExpensesSum += response_clean[index].previous_expenses;
          previousRevenueSum += response_clean[index].previous_revenue;
        }

        // Update the state with the calculated sums
        setRecentExpenses(recentExpensesSum);
        setRecentRevenue(recentRevenueSum);
        setPreviousExpenses(previousExpensesSum);
        setPreviousRevenue(previousRevenueSum);
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
  return loading ? (
    <LoaderLogo />
  ) : (
    <main className="bg-[#f6f6f6] min-h-full">
      <div className="py-1 flex flex-row  items-center w-full text-[#ffff] bg-[#355B3E] justify-between px-12">
        <div className="flex flex-row items-center">
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
        <nav className="flex flex-row gap-12">
          <li className="list-none text-lg"><a href="/">Inicio</a></li>
          <li className="list-none text-lg"><a href="/newMonth">Nuevo Mes</a></li>
        </nav>
      </div>
      <div className="px-4 py-5">
        <h1 className="text-2xl font-bold text-[#2f3d4c] lg:text-4xl">
          Bienvenido de vuelta !!!
        </h1>
        <div className="py-2">
          <h2 className="text-xl font-semibold text-gray-600 lg:text-center lg:text-2xl">
            Novedades:
          </h2>
          <div className="flex flex-col items-center gap-8 py-8 lg:flex-row lg:justify-around ">
            <MonthCard
              current_amount={recentRevenue - recentExpenses}
              previous_amount={previousRevenue - previousExpenses}
              topic="Rentabilidad"
            />
            <MonthCard
              current_amount={recentRevenue}
              previous_amount={previousRevenue}
              topic="Facturacion"
            />
            <MonthCard
              current_amount={recentExpenses}
              previous_amount={previousExpenses}
              topic="Gastos"
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-600 pb-8 lg:text-center lg:text-2xl">
            Tus Camionetas:
          </h2>
          {screenWidth > 700 ? (
            <div className="flex flex-row  flex-wrap justify-around ">
              {data.map((item, index) => {
                return (
                  <VehicleCard
                    car_name={item.car_name}
                    registration_number={item.registration_number}
                    driver_name={item.driver_name}
                    img_src="ds"
                    generated_amount={item.recent_revenue}
                    wasted_amount={item.recent_expenses}
                  />
                );
              })}
            </div>
          ) : (
            <Swiper pagination={true} modules={[Pagination]}>
              {data.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <VehicleCard
                      car_name={item.car_name}
                      registration_number={item.registration_number}
                      driver_name={item.driver_name}
                      img_src="ds"
                      generated_amount={item.recent_revenue}
                      wasted_amount={item.recent_expenses}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </div>
    </main>
  );
}
