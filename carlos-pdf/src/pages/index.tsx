import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoaderLogo from "@/components/LoaderLogo";
import Swal from "sweetalert2";
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
  const [money, setMoney] = useState(0);
  const [ownerExpenses, setOwnerExpenses] = useState<{ [key: string]: Number }>(
    {},
  );
  const router = useRouter();

  // New local state to store user input for revenue and expenses per car
  const [carRevenues, setCarRevenues] = useState<{ [key: string]: number }>({});
  const [carExpenses, setCarExpenses] = useState<{
    [key: string]: { [key: string]: number };
  }>({});

  // Function to handle changes in revenue input fields
  const handleRevenueChange = (registrationNumber: string, value: string) => {
    // Remove leading zeros from the input value
    const trimmedValue = value.replace(/^0+/, "");

    // Set the parsedValue to 0 if it's an empty string or "0", otherwise parse it as an integer
    const parsedValue =
      trimmedValue === "" || trimmedValue === "0"
        ? 0
        : parseInt(trimmedValue, 10);

    setCarRevenues((prevRevenues) => ({
      ...prevRevenues,
      [registrationNumber]: parsedValue,
    }));
  };

  // Function to handle changes in expense input fields
  const handleExpenseChange = (
    registrationNumber: string,
    expenseKey: string,
    value: string,
  ) => {
    // Convert the input value to a number or set it to 0 if it's an empty string or NaN
    const trimmedValue = value.replace(/^0+/, "");

    // Convert the input value to a number or set it to 0 if it's an empty string or NaN
    const parsedValue =
      trimmedValue === "" || isNaN(parseInt(trimmedValue, 10))
        ? 0
        : parseInt(trimmedValue, 10);

    setCarExpenses((prevExpenses) => ({
      ...prevExpenses,
      [registrationNumber]: {
        ...prevExpenses[registrationNumber],
        [expenseKey]: parsedValue,
      },
    }));
  };

  const api_query_maker = async (
    endpoint: string,
    mehtod: string,
    data: any,
  ) => {
    const JSONdata = JSON.stringify(data);
    const options = {
      method: mehtod,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    const response = await fetch(endpoint, options);
    return response;
  };
  const dataFetching = async () => {
    const data = {
      email: Cookies.get("email"),
      sessionId: Cookies.get("remis_session_id"),
    };
    try {
      const response_dirty = await api_query_maker(
        "/api/balance",
        "POST",
        data,
      );
      if (response_dirty.status == 403) {
        console.log("hola");
        router.push("/login");
      }
      const response_clean = await response_dirty.json();
      console.log(response_clean);
      setOwnerExpenses(response_clean.message.expenses);
      setCarsData(response_clean.message.cars_data);
      setMoney(response_clean.message.money);
      const initialCarRevenues: { [key: string]: number } = {};
      const initialCarExpenses: { [key: string]: { [key: string]: number } } =
        {};

      response_clean.message.cars_data.forEach((car: CarData) => {
        initialCarRevenues[car.registration_number] = car.revenue;
        initialCarExpenses[car.registration_number] = { ...car.expenses };
      });

      setCarRevenues(initialCarRevenues);
      setCarExpenses(initialCarExpenses);
      setLoading(false);
    } catch (error) {
      // Handle error, if needed
    }
  };

  useEffect(() => {
    dataFetching();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    Swal.fire({
      title: "Por favor revisa los datos",
      text: "Ten en cuenta que esta infromacion quedara almaceneda asi que prfavor asegurese de encviar datos correctos",
      icon: "info",
      confirmButtonText: "Enviar",
      showCancelButton: true,
      cancelButtonText: "Revisar",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.close();
        Swal.fire({
          title: "Enviando datos",
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false, // Prevents the user from taking away the loader
        });
        /* const data = {
          email: Cookies.get("email"),
          sessionId: Cookies.get("remis_session_id"),
          revenue: carRevenues,
          expenses: carExpenses,
          caja: money,
        };
        console.log(data)
        const JSONdata = JSON.stringify(data);
        const endpoint = "/api/update";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSONdata,
        };*/

        try {
          const data_session = {
            email: Cookies.get("email"),
            sessionId: Cookies.get("remis_session_id"),
          };
          const session_response = await api_query_maker(
            "/api/session",
            "POST",
            data_session,
          );
          if (session_response.status == 403) {
            router.push("/login");
            return;
          }

          let total_expenses = 0;
          let total_revenues = 0;

          let owner_expenses_data: { [key: string]: number } = {}; // Use 'number' instead of 'Number'
          for (const gasto in ownerExpenses) {
            const value = event.target["owner_" + gasto].value;
            if (value !== "") {
              ownerExpenses[gasto] = parseFloat(value);
            }
            owner_expenses_data[gasto] = ownerExpenses[gasto] as number; // Cast to 'number'
            total_expenses += ownerExpenses[gasto] as number; // Cast to 'number'
          }

          for (const patente in carExpenses) {
            const car_update_response = await api_query_maker(
              "/api/update_car",
              "POST",
              {
                patente: patente,
                expenses: carExpenses[patente],
                revenue: carRevenues[patente],
              },
            );
            total_revenues += carRevenues[patente];
            let car_expenses = 0;
            for (const key in carExpenses[patente]) {
              car_expenses += carExpenses[patente][key];
              total_expenses += carExpenses[patente][key];
            }

            const insert_revenue_response = await api_query_maker(
              "/api/insert_revenue",
              "POST",
              {
                patente: patente,
                expenses: car_expenses,
                revenue: carRevenues[patente],
              },
            );
          }

          const owner_update_response = await api_query_maker(
            "/api/update_owner",
            "POST",
            {
              email: Cookies.get("email"),
              owner_expenses: owner_expenses_data,
              result: total_revenues - total_expenses,
            },
          );

          const balance_insert_response = await api_query_maker(
            "/api/insert_balance",
            "POST",
            {
              revenue_total: total_revenues,
              expense_total: total_expenses,
              caja_before: money,
              caja_after: money + total_revenues - total_expenses,
              email: Cookies.get("email"),
            },
          );

          /*
          const response_dirty = await fetch(endpoint, options);

          if (response_dirty.status === 200) {
            const response_clean = await response_dirty.json();
            console.log(response_clean);
            // Update the Swal modal content with the result message
            Swal.hideLoading();
            window.location.reload();
            Swal.update({
              title: "Exitos!",
              text: "Enviado con exito",
              icon: "success",
              allowOutsideClick: true,
            });
          } else if (response_dirty.status === 403) {
            Swal.hideLoading();
            Swal.update({
              title: "Error!",
              text: "Datos de inicio de sesión incorrectos",
              icon: "error",
              allowOutsideClick: true,
            });
          } else {
            console.log(response_dirty)
            Swal.hideLoading();
            Swal.update({
              title: "Error!",
              text: "Servidor en mantenimiento, vuelva a intentarlo más tarde",
              icon: "error",
              allowOutsideClick: true,
            });
          }*/
        } catch (error) {
          Swal.hideLoading();
          Swal.update({
            title: "Error!",
            text: "Hubo un error al procesar la solicitud",
            icon: "error",
            allowOutsideClick: true,
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  };

  return loading ? (
    <LoaderLogo />
  ) : (
    <main className="bg-[#f6f6f6] flex flex-col items-center gap-6">
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
      <form
        action=""
        className="flex flex-col items-center gap-5  px-6 py-2 w-full"
        onSubmit={handleSubmit}
      >
        <h1 className="text-lg font-semibold text-gray-600">
          Gastos generales:
        </h1>
        <div className="flex flex-row flex-wrap justify-center  bg-[#355B3E] shadow-2xl py-5 rounded-2xl">
          {Object.keys(ownerExpenses).map((gasto) => {
            return (
              <div
                className="flex justify-center gap-2 py-2
             "
              >
                <label
                  htmlFor={"owner_" + gasto}
                  className="text-base font-semibold text-gray-300"
                >
                  {gasto}:
                </label>
                <input
                  className="px-1 py-[2px] w-2/6 rounded-lg text-center shadow-lg text-sm font-bold"
                  type="number"
                  name={"owner_" + gasto}
                  placeholder={ownerExpenses[gasto].toString()}
                  step="0.01"
                  id=""
                />
              </div>
            );
          })}
        </div>
        <h1 className="text-lg font-semibold text-gray-600">
          Gastos individuales:
        </h1>
        <div className="flex flex-col items-center gap-5 py-2 w-full lg:flex-row lg:flex-wrap lg:justify-center">
          {carsData.map((item, index) => {
            return (
              <div
                className="flex flex-col gap-2 bg-[#355B3E] shadow-2xl py-5 rounded-2xl px-3"
                key={index}
              >
                <p className="text-lg text-center font-semibold text-[#fafafa]">
                  Vehiculo:
                  <span className="font-normal text-sm">
                    {" "}
                    {item.registration_number}
                  </span>
                </p>
                <p className="text-base font-semibold pl-3 text-gray-300">
                  Conductor:{" "}
                  <span className="font-normal text-sm">
                    {item.driver_name}
                  </span>
                </p>

                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-bold text-gray-100">
                    Ganancias:
                  </h1>
                  <div className="flex flex-row flex-wrap gap-2 pl-3 justify-between pr-3">
                    <label
                      htmlFor={"revenue" + item.registration_number}
                      className="text-base font-semibold text-gray-300"
                    >
                      Facturacion:
                    </label>
                    <input
                      type="number"
                      name={"revenue" + item.registration_number}
                      className="px-1 py-[2px] text-sm font-bold w-2/6 rounded-lg text-center shadow-lg"
                      placeholder={item.revenue.toString()}
                      id=""
                      onChange={(e) =>
                        handleRevenueChange(
                          item.registration_number,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-bold text-gray-100">Gastos</h1>
                  <div className="flex flex-col gap-1">
                    {Object.keys(item.expenses)
                      .sort((a, b) => {
                        if (a === "Otros") return 1;
                        if (b === "Otros") return -1;
                        return a.localeCompare(b);
                      })
                      .map((gasto) => {
                        return (
                          <div
                            className="flex flex-row flex-wrap gap-2 pl-3 justify-between pr-3"
                            key={gasto}
                          >
                            <label
                              htmlFor={item.registration_number + ":" + gasto}
                              className="text-base font-semibold text-gray-300"
                            >
                              {gasto}
                            </label>
                            <input
                              className="px-1 py-[2px] w-2/6 rounded-lg text-center shadow-lg text-sm font-bold"
                              type="number"
                              name={item.registration_number + ":" + gasto}
                              placeholder={item.expenses[gasto].toString()}
                              step="0.01"
                              id=""
                              onChange={(e) =>
                                handleExpenseChange(
                                  item.registration_number,
                                  gasto,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="text-xl border-solid border-4 py-2 rounded-full w-fit border-[#355B3E] font-bold px-6 text-[#121212] hover:bg-[#355b3e] hover:text-[#fafafa] transition-all ease-in-out"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
