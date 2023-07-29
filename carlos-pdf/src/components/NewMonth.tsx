import React from "react";
import { Icon } from "@iconify/react";
interface NewMonthPorps {
    mesAccordion : boolean
  }

const NewMonth = (props:NewMonthPorps) => {

  return (
    <div className={props.mesAccordion? "w-full h-full transition-all duration-300 ease-in-out bg-[#ffffff]": "transition-all ease-in-out	duration-300 w-0 h-0"}>
    <form action="">
        <div>
        <label htmlFor="revenue">Facturacion</label>

        <input type="number" name="revenue" id="revenue" />
        </div>

        <div>
                <label htmlFor="expenses">gastos</label>
        <input type="number" name="expenses" id="expenses" />
        </div>
        <button type="submit">Enviar</button>
    </form>
    </div>
  );
};

export default NewMonth;
