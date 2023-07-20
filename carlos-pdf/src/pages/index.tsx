import Image from 'next/image'
import { Inter } from 'next/font/google'
import MonthCard from '@/components/MonthCard'
import VehicleCard from '@/components/VehicleCard'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className='bg-[#ffff] min-h-full'>
      <h1>Bienvenido de vuelta !!!</h1>
      <div>
        <h2>Novedades</h2>
        <div>
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
        <h2>Tus Camionetas:</h2>
        <div>
          <VehicleCard
          car_name='Kangoo'
          registration_number="acffaa"
          driver_name='Omar'
          img_src='ds'
          generated_amount={100}
          wasted_amount={50}
          />
        </div>
      </div>
    </main>
  );
}





