import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import LoaderLogo from "@/components/LoaderLogo";
const Cookies = require("js-cookie");
export default function Home() {
  const [loading , setLoading]=useState(true)
  const [carsData , setCarsData]=useState([])
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
    <main className="bg-[#f6f6f6] min-h-full">
      <div>
        <h1>Balance de Cuenta</h1>
        <h2>Caja: {money}</h2>
      </div>
      <form action="">
        {
          carsData.map((item,index)=>{
            return(
              <div>
                  <div>
                    <p>Vehiculo {item.registration_number}</p>
                    <p>Conductor {item.driver_name}</p>
                  </div>
                <div>
                  <h1>Ganancias</h1>
                  <label htmlFor={"revenue"+ item.registration_number}>Facturacion</label>
                  <input type="number" name={"revenue"+ item.registration_number}  value={item.revenue} id="" />

                </div>
                <div>
                  <h1>Gastos</h1>
                  <div>
                      {Object.keys( item.expenses).map((gasto)=>{
                        return(
                          <div>
                            <label htmlFor={item.registration_number+":"+gasto}>{gasto}</label>
                            <input type="number" name={item.registration_number+":"+gasto}  value={item.expenses[gasto]} id="" />
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
        </form>
    </main>
  );
}
