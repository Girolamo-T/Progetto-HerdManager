import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";
import dayjs from "dayjs";

const ListaAllevamenti = () => {
  const [allevamenti, setAllevamenti] = useState([]);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false); // Stato per aprire/chiudere il form
  const [formData, setFormData] = useState({
    sesso: "",
    data_nascita: "",
    azione: "", // azione: "aggiungi" o "rimuovi"
    allevamentoId: null,
  });
  const [storicoTrattamenti, setStoricoTrattamenti] = useState([]);
  const [openStorico, setOpenStorico] = useState(false);

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY"); // Formatta la data in italiano
  };

  useEffect(() => {
    const fetchAllevamenti = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token non trovato! Effettua il login.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/api/allevamenti", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllevamenti(response.data);
      } catch (error) {
        console.error("Errore nel recupero allevamenti:", error);
        setError("Errore nel caricamento degli allevamenti.");
      }
    };

    fetchAllevamenti();
  }, []);

  // Gestione del cambio di valori nel form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Funzione per inviare la richiesta di aggiunta o rimozione dell'animale
  const aggiornaAnimali = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token non trovato! Effettua il login.");
      return;
    }

    try {
      const { sesso, azione, data_nascita, allevamentoId } = formData;
      await axios.put(
        `http://localhost:5001/api/allevamento/${allevamentoId}/aggiorna_animali`,
        { sesso, azione, data_nascita },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setError("");
      // Ricarica i dati degli allevamenti dopo l'aggiornamento
      const response = await axios.get("http://localhost:5001/api/allevamenti", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllevamenti(response.data);
      setOpenForm(false); // Chiudi il form dopo l'aggiornamento
    } catch (error) {
      console.error("Errore nell'aggiornamento degli animali:", error);
      setError("Errore nell'aggiornamento degli animali.");
    }
  };

  // Funzione per recuperare lo storico dei trattamenti
  const getStoricoTrattamenti = async (allevamentoId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token non trovato! Effettua il login.");
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:5001/api/allevamento/${allevamentoId}/storico_trattamenti`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStoricoTrattamenti(response.data);
      setOpenStorico(true); // Apri lo storico trattamenti
    } catch (error) {
      console.error("Errore nel recupero storico trattamenti:", error);
  
      // Controlla se l'errore è un 404 (nessun trattamento trovato)
      if (error.response && error.response.status === 404) {
        setStoricoTrattamenti([]); // Imposta un array vuoto
        setOpenStorico(true); // Mostra comunque il popup con messaggio "Nessun trattamento"
      } else {
        setError("Errore nel recupero dello storico trattamenti.");
      }
    }
  };

  // aggiungere un nuovo trattamento
  const [openFormTrattamento, setOpenFormTrattamento] = useState(false);
  const [formTrattamento, setFormTrattamento] = useState({
    tipo_trattamento: "",
    data_trattamento: "",
    allevamentoId: null,
  });

  // cambio valori form
  const handleChangeTrattamento = (e) => {
    const { name, value } = e.target;
    setFormTrattamento((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const aggiungiTrattamento = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token non trovato! Effettua il login.");
      return;
    }
  
    try {
      const { tipo_trattamento, data_trattamento, allevamentoId } = formTrattamento;
      await axios.post(
        `http://localhost:5001/api/allevamento/${allevamentoId}/aggiungi_trattamento`,
        { tipo_trattamento, data_trattamento },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Ricarica i dati dello storico aggiornato
      getStoricoTrattamenti(allevamentoId);
      setOpenFormTrattamento(false); // Chiudi il form dopo l'aggiornamento
    } catch (error) {
      console.error("Errore nell'aggiunta del trattamento:", error);
      setError("Errore nell'aggiunta del trattamento.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Header showBack={true} />

      <h1 className="text-2xl font-bold mb-4">Lista Allevamenti</h1>

      {error && <p className="text-red-500">{error}</p>}

      {allevamenti.length === 0 && !error ? (
        <p>Nessun allevamento trovato.</p>
      ) : (
        <ul>
          {allevamenti.map((allevamento) => (
            <li key={allevamento.id}>
              <div>
                <p><strong>{allevamento.nome}</strong></p>
                <p>Totale Animali: {allevamento.totale_animali}</p>
                <p>Maschi: {allevamento.maschi}</p>
                <p>Femmine: {allevamento.femmine}</p>
              </div>

              {/* Tasto Aggiorna per aggiungere o rimuovere un animale */}
              <button 
                onClick={() => {
                  setFormData({ ...formData, allevamentoId: allevamento.id });
                  setOpenForm(true); // Apri il form quando si clicca "Aggiorna"
                }}
                className="category-button operation-button"
              >
                Aggiorna Animali
              </button>

              {/* Tasto per visualizzare lo storico dei trattamenti */}
              <button 
                onClick={() => getStoricoTrattamenti(allevamento.id)}
                className="category-button operation-button"
              >
                Storico Trattamenti
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Form per aggiungere o rimuovere un animale */}
      {openForm && (
        <div className="form-popup">
          <h2>Aggiungi/Rimuovi Animale</h2>
          <label>Sesso:</label>
          <select name="sesso" value={formData.sesso} onChange={handleChange}>
            <option value="">Seleziona sesso</option>
            <option value="maschio">Maschio</option>
            <option value="femmina">Femmina</option>
          </select>

          <label>Data di Nascita:</label>
          <input
            type="date"
            name="data_nascita"
            value={formData.data_nascita}
            onChange={handleChange}
          />

          <label>Azione:</label>
          <select name="azione" value={formData.azione} onChange={handleChange}>
            <option value="">Seleziona azione</option>
            <option value="aggiungi">Aggiungi</option>
            <option value="rimuovi">Rimuovi</option>
          </select>

          <button onClick={aggiornaAnimali}>Conferma</button>
          <button onClick={() => setOpenForm(false)}>Chiudi</button>
        </div>
      )}

      {/* Sezione per mostrare lo storico dei trattamenti */}
      {openStorico && (
        <div className="storico-trattamenti">
          <h2>Storico Trattamenti</h2>
          {storicoTrattamenti.length === 0 ? (
            <p>Nessun trattamento eseguito.</p>
          ) : (
            <ul>
              {storicoTrattamenti.map((trattamento) => (
                <li key={trattamento.id}>
                  <p><strong>Tipo Trattamento:</strong> {trattamento.tipo_trattamento}</p>
                  <p><strong>Data Trattamento:</strong> {formatDate(trattamento.data_trattamento)}</p>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => {
            setFormTrattamento({ ...formTrattamento, allevamentoId: storicoTrattamenti[0]?.allevamento_id });
            setOpenFormTrattamento(true);
          }}>
            Aggiorna Storico
          </button>
          <button onClick={() => setOpenStorico(false)}>Chiudi Storico</button>
        </div>
      )}

      {/* Form per aggiungere un trattamento */}
      {openFormTrattamento && (
        <div className="form-popup">
          <h2>Aggiungi Nuovo Trattamento</h2>
    
          <label>Tipo Trattamento:</label>
          <input
            type="text"
            name="tipo_trattamento"
            value={formTrattamento.tipo_trattamento}
            onChange={handleChangeTrattamento}
          />

          <label>Data Trattamento:</label>
          <input
            type="date"
            name="data_trattamento"
            value={formTrattamento.data_trattamento}
            onChange={handleChangeTrattamento}
          />

          <button onClick={aggiungiTrattamento}>Conferma</button>
          <button onClick={() => setOpenFormTrattamento(false)}>Chiudi</button>
        </div>
      )}
    </div>
  );
};

export default ListaAllevamenti;