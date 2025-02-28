import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../App.css";

const Header = ({ showBack, showLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      {showBack && (
        <button onClick={() => navigate(-1)} className="back-button">
        <span>←</span> Indietro
        </button>
      )}

      {showLogout && (
        <button onClick={() => navigate(-1)} className="logout-button">
          Esci
        </button>
      )}


      {/* Nuovo contesto per il logo e la scritta HerdManager */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        {/* Logo con dimensione specifica */}
        <img src={logo} alt="HerdManager Logo" style={{ height: '40px', marginRight: '10px' }} />
        
        {/* Scritta HerdManager */}
        <h1 style={{ color: 'green', fontSize: '2rem' }}>HerdManager</h1>
      </div>

      <div></div> {/* Spazio vuoto per centrare */}
    </div>
  );
};

export default Header;
