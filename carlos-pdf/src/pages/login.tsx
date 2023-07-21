import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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

  return (
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
          <p className="w-fit">Eclipse Lab</p>
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
            <form action="" className="flex flex-col px-5 items-center">
              <div className="flex flex-col py-2 w-full">
                <label
                  htmlFor="email"
                  className="pb-1 text-[#2f3d4c] text-base font-semibold leading-4"
                >
                  Email
                </label>
                <input
                  type="email"
                  name=""
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
                  name="\"
                  id="contrasena"
                  className="text-base rounded-lg border-solid border-2 border-[#a0bba6] leading-6 text-[#355b3e] py-1 px-1"
                />
              </div>
              <div className="flex flex-row justify-between pt-5 w-full pb-8">
                <div className="flex flex-row items-center gap-1">
                  <input type="checkbox" name="\" id="recordarme" />
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
                className=" w-3/5 py-5 rounded-lg bg-[#029664] text-base font-semibold leading-4"
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
