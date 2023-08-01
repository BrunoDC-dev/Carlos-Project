import { useState,useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoaderLogo from "@/components/LoaderLogo";
const Cookies = require("js-cookie");
interface CarData {
  registration_number: string;
  driver_name: string;
  revenue: number;
  expenses: { [key: string]: number };
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [carsData, setCarsData] = useState<CarData[]>([]);
  const [money , setMoney]=useState(0)
  const router = useRouter();
  const dataFetching = async () => {
    const data = {
      email: Cookies.get("email"),
      sessionId: Cookies.get("remis_session_id"),
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/balance";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    try {
      const response_dirty = await fetch(endpoint, options);
      if (response_dirty.status==403){
        router.push("/login");
      }
     const response_clean = await response_dirty.json();
     console.log(response_clean)
     setCarsData(response_clean.message.cars_data)
     setMoney(response_clean.message.money)

     setLoading(false)
     
    } catch (error) {
      
    }
  }
  useEffect(() => {
    dataFetching()
  }, []);
  return loading ? (
    <LoaderLogo />
  ) : (
    <main className="bg-[#f6f6f6]  flex flex-col items-center h-screen gap-6">
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
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-xl font-bold text-gray-800">Balance de Cuenta:</h1>
        <h2 className="text-lg font-semibold text-gray-600">Caja: {money}</h2>
      </div>
      <form action="" className=" flex flex-col items-center gap-5 px-6 py-2 w-full">
        {
          carsData.map((item,index)=>{
            return(
              <div className=" flex flex-col  gap-2  bg-[#355B3E] shadow-2xl  py-5 rounded-2xl px-3">
                    <p className="text-lg text-center font-semibold text-[#fafafa]">Vehiculo:<span className="font-normal text-sm"> {item.registration_number}</span></p>
                    <p className="text-base font-semibold  pl-3 text-gray-300 ">Conductor: <span className="font-normal text-sm">{item.driver_name}</span></p>
                 
                <div className=" flex flex-col gap-1">
                  <h1 className="text-lg font-bold text-gray-100 ">Ganancias:</h1>
                  <div  className="flex flex-row flex-wrap gap-2 pl-3 justify-between pr-3">
                  <label htmlFor={"revenue"+ item.registration_number}  className="text-base font-semibold text-gray-300 ">Facturacion:</label>
                  <input type="number" name={"revenue"+ item.registration_number} className="px-1 py-[2px] text-sm font-bold w-2/6 rounded-lg text-center shadow-lg"  value={item.revenue} id="" />
                  </div>

                </div>
                <div className=" flex flex-col gap-1">
                  <h1 className="text-lg font-bold text-gray-100 ">Gastos</h1>
                  <div className=" flex flex-col gap-1">
                      {Object.keys( item.expenses).map((gasto)=>{
                        return(
                          <div className="flex flex-row flex-wrap gap-2 pl-3 justify-between pr-3">
                            <label htmlFor={item.registration_number+":"+gasto}  className="text-base font-semibold text-gray-300 ">{gasto}</label>
                            <input  className="px-1 py-[2px] w-2/6 rounded-lg text-center shadow-lg text-sm font-bold" type="number" name={item.registration_number+":"+gasto}  value={item.expenses[gasto]} id="" />
                            </div>
                        )
                      })

                      }
                  </div>
                </div>
              </div>
            )
          })
        }
        <button type="submit" className="text-xl border-solid border-4 py-2 rounded-full w-fit border-[#355B3E] font-bold px-6 text-[#121212] hover:bg-[#355b3e] hover:text-[#fafafa] transition-all ease-in-out">Enviar</button>
        </form>
    </main>
  );
}
