import React from "react";
import Header from "../../components/header";

const RichiesteAppuntamenti = () => {
  return (
    <div className="flex flex-col items-center">
      <Header showBack={true} />
      <h2 className="text-xl my-4">Richieste Appuntamenti.</h2>
      <p>Qui dovrebbero venire visualizzate le notifiche di inserimento di un'attività nel calendario della sezione Agenda.</p>
    </div>
  );
};

export default RichiesteAppuntamenti;
