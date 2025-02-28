import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegistra from "./pages/LoginRegistra";
import Allevatori from "./pages/allevatori/home";
import Veterinari from "./pages/veterinari/home";
import MyAccountAllevatori from "./pages/allevatori/myaccountallevatori";
import ListaAllevamenti from "./pages/allevatori/listaallevamenti";
import AgendaAllevatori from "./pages/allevatori/agenda";
import MyAccountVeterinari from "./pages/veterinari/myaccountveterinari";
import RichiesteAppuntamenti from "./pages/veterinari/richiesteappuntamenti";
import ListaClienti from "./pages/veterinari/listaclienti";
import AgendaVeterinari from "./pages/veterinari/agenda";
import "./App.css";  

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<LoginRegistra />} />
          <Route path="/allevatori" element={<Allevatori />} />
          <Route path="/veterinari" element={<Veterinari />} />
          <Route path="/allevatori/myaccountallevatori" element={<MyAccountAllevatori />} />
          <Route path="/allevatori/listaallevamenti" element={<ListaAllevamenti />} />
          <Route path="/allevatori/agenda" element={<AgendaAllevatori />} />
          <Route path="/veterinari/myaccountveterinari" element={<MyAccountVeterinari />} />
          <Route path="/veterinari/richiesteappuntamenti" element={<RichiesteAppuntamenti />} />
          <Route path="/veterinari/listaclienti" element={<ListaClienti />} />
          <Route path="/veterinari/agenda" element={<AgendaVeterinari />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
