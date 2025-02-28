import React from "react";
import Header from "../../components/header";
import { useState, useEffect } from "react";
import axios from "axios";

const MyAccountAllevatori = () => {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get("http://localhost:5001/api/myaccount", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(data);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return <p>Caricamento...</p>;

// Cambio password
const handleChangePassword = async (e) => {
  e.preventDefault();
  
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5001/api/change-password",
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessage(response.data.message); // Imposta il messaggio di successo
    setOldPassword("");
    setNewPassword("");

    // 🔹 Mostra il messaggio per 2 secondi prima di chiudere il modale
    setTimeout(() => {
      setMessage(""); // Pulisce il messaggio
      setShowModal(false);
    }, 2000);
    
  } catch (error) {
    setMessage(error.response?.data?.error || "Errore nel cambio password");
  }
};

  return (
    <div className="flex flex-col items-center">
      <Header showBack={true} />
      
      <h2>Il Mio Account</h2>
      <p><strong>Nome:</strong> {userData.nome} {userData.cognome}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Telefono:</strong> {userData.telefono}</p>
      <p><strong>Indirizzo:</strong> {userData.indirizzo}</p>
      <p><strong>Allevamento:</strong> {userData.allevamento}</p>

      {/* Pulsante Modifica Password */}
      <button
       onClick={() => setShowModal(true)}
       className="category-button operation-button"
       >
        Modifica Password
      </button>
      

      {/* Modale per il Cambio Password */}
      {showModal && (
        <div className="modal">
          <h3>Cambia Password</h3>
          <input
            type="password"
            placeholder="Password attuale"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nuova Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleChangePassword}>Conferma</button>
          <button onClick={() => setShowModal(false)}>Annulla</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default MyAccountAllevatori;
