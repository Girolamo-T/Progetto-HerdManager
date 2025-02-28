import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

const Allevatori = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <Header showLogout={true} />
      <h2 className="text-xl my-4">Seleziona una sottocategoria:</h2>
      
      {/* Pulsanti sottocategorie */}
      <div className="button-container">
        <button
          onClick={() => navigate("/allevatori/myaccountallevatori")}
          className="category-button red-button"
        >
          My Account
        </button>
        <button
          onClick={() => navigate("/allevatori/listaallevamenti")}
          className="category-button red-button"
        >
          Lista allevamenti
        </button>
        <button
          onClick={() =>navigate("/allevatori/agenda")}
          className="category-button red-button"
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default Allevatori;
