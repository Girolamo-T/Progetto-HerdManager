import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import "../../App.css";

const ListaClienti = () => {
  const [clienti, setClienti] = useState([]);
  const [clienteSelezionato, setClienteSelezionato] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/clienti')
      .then(response => response.json())
      .then(data => setClienti(data))
      .catch(error => console.error('Errore nel recupero dati:', error));
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Header showBack={true} />
      <h2 className="text-xl font-bold my-4">Lista Clienti</h2>
      
      <div className="flex flex-wrap justify-center gap-4">
        {clienti.map(cliente => (
          <button 
            key={cliente.id} 
            onClick={() => setClienteSelezionato(cliente)}
            className="category-button blue-button"
          >
            {cliente.cognome}
          </button>
        ))}
      </div>

      {clienteSelezionato && (
        <div className="mt-6 p-4 border rounded-lg shadow-md bg-white w-80 text-center">
          <h3 className="text-lg font-semibold">Dettagli Cliente</h3>
          <p><strong>Id:</strong> {clienteSelezionato.id}</p>
          <p><strong>Nome:</strong> {clienteSelezionato.nome}</p>
          <p><strong>Cognome:</strong> {clienteSelezionato.cognome}</p>
          <p><strong>Email:</strong> {clienteSelezionato.email}</p>
          <p><strong>Telefono:</strong> {clienteSelezionato.telefono}</p>
          <p><strong>Indirizzo:</strong> {clienteSelezionato.indirizzo}</p>
          <p><strong>Allevamento:</strong> {clienteSelezionato.allevamento}</p>
          <button 
            onClick={() => setClienteSelezionato(null)}
            className="category-button operation-button"
          >
            Chiudi
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaClienti;