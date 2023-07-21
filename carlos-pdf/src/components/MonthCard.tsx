import React from 'react';
import { Icon } from '@iconify/react';

interface MonthCardProps {
  current_amount: number;
  previous_amount: number;
  topic: string;
}

const MonthCard = (props: MonthCardProps) => {
  let icon = '';
  let color_title = '';
  switch (props.topic) {
    case 'Gastos':
      icon = 'material-symbols:receipt-long';
      color_title='#FFBC02'
      break;
    case 'Facturacion':
      icon = 'grommet-icons:money';
      color_title='#876AFE'
      break;
    case 'Rentabilidad':
      icon = 'material-symbols:savings-outline';
      color_title='#2F70F2'
      break;
    default:
      icon = 'mdi:alert-circle';
      break;
  }

  let porcentaje = Math.round(((props.current_amount - props.previous_amount) / props.previous_amount) * 100);

  return (
    <div className='bg-[#ffff] rounded-xl w-4/5 shadow-lg px-4 py-3 flex flex-col items-center gap-3'>
      <p className='text-[#2F70F2] text-[#876AFE] text-[#FFBC02]'></p>
      <div className='flex flex-row items-center w-full gap-2 text-base font-semibold'>
        <Icon className={`text-2xl  text-[${color_title}]`} icon={icon} />
        <h3 className={`  text-[${color_title}]`}>{props.topic}</h3>
      </div>
      <div className='flex flex-row w-full gap-2'>
        <h2 className='text-2xl font-semibold text-[#121212]'>$ {props.current_amount}</h2>
        <div className='flex flex-row  items-center'>
        {porcentaje>=0? <Icon icon="codicon:triangle-up"  className='text-lg font-bold text-[#4eea7a]'  /> :<Icon icon="codicon:triangle-down" className='text-lg font-bold text-[#d62c2c]' />} 
        <p className={"text-base font-normal " + (porcentaje>=0? "text-[#4eea7a]": "text-[#d62c2c]")} >{porcentaje}%</p> 
        </div>
      </div>
    </div>
  );
};

export default MonthCard;
