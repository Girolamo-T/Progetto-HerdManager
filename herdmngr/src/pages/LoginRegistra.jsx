import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";

const LoginRegistra = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [ruolo, setRuolo] = useState("allevatore");
  const [info, setInfo] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "/api/register" : "/api/login";
    const payload = isRegistering ? { email, password, nome, cognome, telefono, indirizzo, ruolo, info } : { email, password };

    try {
      const { data } = await axios.post(`http://localhost:5001${endpoint}`, payload);

      if (!isRegistering) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("ruolo", data.ruolo);

        if (data.ruolo === "allevatore") {
          navigate("/allevatori");
        } else {
          navigate("/veterinari");
        }
      } else {
        alert("Registrazione completata! Ora puoi accedere.");
        setIsRegistering(false);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Errore");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Header showBack={false} />

      <div className="login-container">
        <h2>{isRegistering ? "Registrati" : "Accedi"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
              <input type="text" placeholder="Telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              <input type="text" placeholder="Indirizzo" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} required />
              <select value={ruolo} onChange={(e) => setRuolo(e.target.value)}>
                <option value="allevatore">Allevatore</option>
                <option value="veterinario">Veterinario</option>
              </select>
              {ruolo === "allevatore" && (
                <input type="text" placeholder="Allevamento" value={info} onChange={(e) => setInfo(e.target.value)} required />
              )}
              {ruolo === "veterinario" && (
                <input type="text" placeholder="Attestato" value={info} onChange={(e) => setInfo(e.target.value)} required />
              )}
            </>
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">{isRegistering ? "Registrati" : "Accedi"}</button>
        </form>
      
        <p onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
        </p>
      </div>
    </div>
  );
};

export default LoginRegistra;
