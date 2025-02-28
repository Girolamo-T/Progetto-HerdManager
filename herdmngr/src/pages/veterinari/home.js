import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

const Veterinari = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <Header showLogout={true} />
      <h2 className="text-xl my-4">Seleziona una sottocategoria:</h2>
      
      {/* Pulsanti sottocategorie */}
      <div className="button-container">
        <button
          onClick={() => navigate("/veterinari/myaccountveterinari")}
          className="category-button blue-button"
        >
          My Account
        </button>
        <button
          onClick={() => navigate("/veterinari/richiesteappuntamenti")}
          className="category-button blue-button"
        >
          Richieste appuntamenti
        </button>
        <button
          onClick={() => navigate("/veterinari/listaclienti")}
          className="category-button blue-button"
        >
          Lista clienti
        </button>
        <button
          onClick={() => navigate("/veterinari/agenda")}
          className="category-button blue-button"
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default Veterinari;
