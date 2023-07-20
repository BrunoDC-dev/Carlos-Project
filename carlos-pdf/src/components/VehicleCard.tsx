import React from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
interface VehicleCardProps {
  car_name:string
  registration_number: string;
  driver_name: string;
  img_src: string;
  generated_amount:number
  wasted_amount:number
}
const VehicleCard = (props:VehicleCardProps) => {
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
      const updateScreenWidth = () => {
        setScreenWidth(window.innerWidth);
      };
  
      // Add event listener to update screen width on resize
      window.addEventListener('resize', updateScreenWidth);
  
      // Initial screen width
      updateScreenWidth();
  
      // Clean up event listener on unmount
      return () => window.removeEventListener('resize', updateScreenWidth);
    }, []);
    let rentabilidad = Math.round(((props.generated_amount - props.wasted_amount) / props.wasted_amount) * 100);
  
    return (
    <div>
        <h4>{props.car_name}</h4>
        <Image 
                src="/MobileLogin.png"
                width={screenWidth*0.8}
                height={screenWidth*0.41}
                alt="picture for login in desktop type "/>

        <div>
            <div>
                <p>Patente:</p>
                <p>{props.registration_number}</p>
            </div>
            <div>
                <p>Conductor:</p>
                <p>{props.driver_name}</p>
            </div>
        </div>
        <div>
            <div>
                <p>Rentabilidad</p>
                <p>{rentabilidad}</p>
            </div>
            <div>
                <p>Generados</p>
                <p>{props.generated_amount}</p>
            </div>
            <div>
                <p>Gastos</p>
                <p>{props.wasted_amount}</p>
            </div>
        </div>
    </div>
  )
}

export default VehicleCard