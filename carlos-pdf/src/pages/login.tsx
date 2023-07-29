import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import LoaderLogo from "@/components/LoaderLogo";
const Cookies = require("js-cookie");
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [screenWidth, setScreenWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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
        router.push("/");
      } else {
        setLoading(false);
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    Swal.fire({
      title: "Verificando usuario",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false, // Prevents the user from taking away the loader
    });

    const data = {
      email: event.target.email.value,
      password: event.target.password.value,
      session: event.target.session.checked,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/login";
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
        // Update the Swal modal content with the result message
        Swal.hideLoading();
        if (response_clean.remember) {
          Cookies.set("remis_session_id", response_clean.sessionId, {
            expires: 365,
          });
          Cookies.set("email", data.email, { expires: 365 });
        } else {
          Cookies.set("remis_session_id", response_clean.sessionId);
          Cookies.set("email", data.email);
        }
        router.push("/");
      } else if (response_dirty.status === 403) {
        Swal.hideLoading();
        Swal.update({
          title: "Error!",
          text: "Datos de inicio de sesión incorrectos",
          icon: "error",
          allowOutsideClick: true,
        });
      } else {
        Swal.update({
          title: "Error!",
          text: "Servidor en mantenimiento, vuelva a intentarlo más tarde",
          icon: "error",
          allowOutsideClick: true,
        });
      }
    } catch (error) {
      Swal.hideLoading();
      Swal.update({
        title: "Error!",
        text: "Hubo un error al procesar la solicitud",
        icon: "error",
        allowOutsideClick: true,
      });
    }
  };

  return loading ? (
    <LoaderLogo />
  ) : (
    <main className="h-screen bg-[#ffff]">
      <div className=" h-screen">
        <div className="flex flex-row justify-center text-[#fffff] items-center w-full bg-[#355B3E]">
          <div className="max-w-[40px]">
            <Image
              src="/Logo.png"
              width={40}
              height={36}
              alt="Picture of login for the web"
            />
          </div>
          <p className="w-fit text-[#ffff]">Eclipse Lab</p>
        </div>
        <div>
          <Image
            src="/MobileLogin.png"
            width={screenWidth}
            height={screenWidth * 0.51}
            alt="picture for login in desktop type "
          />
          <div>
            <div className="px-5 py-5">
              <h3 className="text-[#355B3E] text-xl font-semibold leading-7 pb-3">
                El mejor sistema de gestion de Remises
              </h3>
              <p className="text-[#58745e] text-base font-normal leading-4">
                Bienvendio de vuelta, por favor loguese a su cuenta
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col px-5 items-center"
            >
              <div className="flex flex-col py-2 w-full">
                <label
                  htmlFor="email"
                  className="pb-1 text-[#2f3d4c] text-base font-semibold leading-4"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  id="email"
                  className="text-base rounded-lg border-solid border-2 border-[#a0bba6] leading-6 text-[#355b3e] py-1 px-1"
                />
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="contrasena"
                  className="pb-1 text-[#2f3d4c] text-base font-semibold leading-4"
                >
                  Contrasena
                </label>
                <input
                  type="password"
                  required
                  name="password"
                  id="contrasena"
                  className="text-base rounded-lg border-solid border-2 border-[#a0bba6] leading-6 text-[#355b3e] py-1 px-1"
                />
              </div>
              <div className="flex flex-row justify-between pt-5 w-full pb-8">
                <div className="flex flex-row items-center gap-1">
                  <input
                    type="checkbox"
                    name="session"
                    id="recordarme"
                    defaultChecked={false}
                  />
                  <label
                    htmlFor="recordarme"
                    className="text-[#355b3e] text-base leading-4"
                  >
                    Recordarme
                  </label>
                </div>
                <a
                  href=""
                  className="text-[#355b3e] text-[13px] leading-4 underline"
                >
                  Has olvidado la contrasena?
                </a>
              </div>
              <button
                type="submit"
                className=" w-3/5 py-5 rounded-lg bg-[#029664] text-base font-semibold leading-4 text-[#ffff]"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
