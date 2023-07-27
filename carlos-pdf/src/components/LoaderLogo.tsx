import Image from "next/image";
import { Inter } from "next/font/google";
import "swiper/css";
import { Triangle } from "react-loader-spinner";
const inter = Inter({ subsets: ["latin"] });

const LoaderLogo = () => {
  return (
    <main className="w-screen h-screen">
    <div className="h-full flex flex-col items-center bg-[#355B3E] justify-center">
       <Triangle
        height="120"
        width="120"
        color="#fafafa"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        visible={true}
       />
    <h1 className="text-[#ffff] text-xl ">Eclipse Lab</h1>
    </div>
    </main>
  );
}
export default LoaderLogo