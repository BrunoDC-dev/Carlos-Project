import React from 'react';
import { Icon } from '@iconify/react';

interface MonthCardProps {
  current_amount: number;
  previous_amount: number;
  topic: string;
}

const MonthCard = (props: MonthCardProps) => {
  let icon = '';

  switch (props.topic) {
    case 'Gastos':
      icon = 'material-symbols:receipt-long';
      break;
    case 'Facturacion':
      icon = 'grommet-icons:money';
      break;
    case 'Rentabilidad':
      icon = 'material-symbols:savings-outline';
      break;
    default:
      icon = 'mdi:alert-circle';
      break;
  }

  let porcentaje = Math.round(((props.current_amount - props.previous_amount) / props.previous_amount) * 100);

  return (
    <div>
      <div>
        <Icon icon={icon} />
        <h3>{props.topic}</h3>
      </div>
      <div>
        <h2>{props.current_amount}</h2>
        <p>{porcentaje}%</p>
      </div>
    </div>
  );
};

export default MonthCard;
