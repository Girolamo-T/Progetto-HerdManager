const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurazione della connessione al database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sqlripeti4",
  database: "herdmanager",
  multipleStatements: true,
});

// Connessione al database
db.connect((err) => {
  if (err) {
    console.error("Errore di connessione al database:", err);
  } else {
    console.log("Connessione al database riuscita");
  }
});

// Registrazione utente
app.post("/api/register", async (req, res) => {
  const { email, password, nome, cognome, telefono, indirizzo, ruolo, info } = req.body;

  // Verifica ruolo valido
  if (!["allevatore", "veterinario"].includes(ruolo)) {
    return res.status(400).json({ error: "Ruolo non valido" });
  }

  try {
    // Crittografare la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Query per inserire l'utente nel database
    const sql = "INSERT INTO utenti (email, password, nome, cognome, telefono, indirizzo, ruolo) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [email, hashedPassword, nome, cognome, telefono, indirizzo, ruolo], (err, result) => {
      if (err) {
        console.error("Errore SQL:", err.sqlMessage);
        return res.status(500).json({ error: "Errore nella registrazione" });
      }

      const utente_id = result.insertId;

      // Inserimento nelle tabelle specifiche
      if (ruolo === "allevatore") {
        const sqlAllevatore = "INSERT INTO allevatori (utente_id, allevamento) VALUES (?, ?)";
        db.query(sqlAllevatore, [utente_id, info], (err) => {
          if (err) {
            console.error("Errore SQL:", err.sqlMessage);
            return res.status(500).json({ error: "Errore nell'inserimento dell'allevatore" });
          }
          res.json({ message: "Registrazione completata!" });
        });
      } else if (ruolo === "veterinario") {
        const sqlVeterinario = "INSERT INTO veterinari (utente_id, attestato) VALUES (?, ?)";
        db.query(sqlVeterinario, [utente_id, info], (err) => {
          if (err) {
            console.error("Errore SQL:", err.sqlMessage);
            return res.status(500).json({ error: "Errore nell'inserimento del veterinario" });
          }
          res.json({ message: "Registrazione completata!" });
        });
      }
    });
  } catch (error) {
    console.error("Errore del server:", error);
    res.status(500).json({ error: "Errore del server" });
  }
});

// Login utente
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Verifica se l'utente esiste
  const sql = "SELECT * FROM utenti WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Email non trovata" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Password errata" });
    }

    // Genera token JWT
    const token = jwt.sign({ id: user.id, ruolo: user.ruolo }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, ruolo: user.ruolo });
  });
});

// Endpoint per ottenere dati dall'utente
app.get("/api/myaccount", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Recupera il token dalla richiesta

  if (!token) {
    return res.status(401).json({ error: "Accesso negato. Nessun token fornito." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica il token JWT
    const userId = decoded.id;
    const ruolo = decoded.ruolo;

    let sql;
    if (ruolo === "allevatore") {
      sql = `
        SELECT u.id, u.email, u.nome, u.cognome, u.telefono, u.indirizzo, u.ruolo, a.allevamento
        FROM utenti u
        JOIN allevatori a ON u.id = a.utente_id
        WHERE u.id = ?
      `;
    } else if (ruolo === "veterinario") {
      sql = `
        SELECT u.id, u.email, u.nome, u.cognome, u.telefono, u.indirizzo, u.ruolo, v.attestato
        FROM utenti u
        JOIN veterinari v ON u.id = v.utente_id
        WHERE u.id = ?
      `;
    } else {
      return res.status(400).json({ error: "Ruolo non valido" });
    }

    db.query(sql, [userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({ error: "Errore nel recupero dei dati" });
      }
      res.json(results[0]); // Restituisce i dati dell'utente
    });
  } catch (error) {
    res.status(401).json({ error: "Token non valido" });
  }
});

// Endpoint per cambio password
app.post("/api/change-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Compila tutti i campi" });
    }

    // 1. Ottenere la password attuale dal DB
    const sqlGetUser = "SELECT password FROM utenti WHERE id = ?";
    db.query(sqlGetUser, [userId], async (err, results) => {
      if (err) {
        console.error("Errore SQL:", err);
        return res.status(500).json({ error: "Errore nel server" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Utente non trovato" });
      }

      const hashedPassword = results[0].password;

      // 2. Verificare se la password attuale è corretta
      const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Password attuale errata" });
      }

      // 3. Crittografare la nuova password
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      // 4. Aggiornare la password nel DB
      const sqlUpdatePassword = "UPDATE utenti SET password = ? WHERE id = ?";
      db.query(sqlUpdatePassword, [newHashedPassword, userId], (err) => {
        if (err) {
          console.error("Errore aggiornamento password:", err);
          return res.status(500).json({ error: "Errore nel cambio password" });
        }
        res.json({ message: "Password aggiornata con successo!" });
      });
    });
  } catch (error) {
    console.error("Errore autenticazione:", error);
    return res.status(401).json({ error: "Token non valido" });
  }
});

// Endpoint per ottenere la lista clienti
app.get("/api/clienti", (req,res) => {
  const sql = "SELECT * FROM clienti";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Errore SQL:", err.sqlMessage);
      return res.status(500).json({ error: "Errore nel recupero dati", details: err.sqlMessage });
    }
    console.log("Dati recuperati con successo:", results);
    res.json(results);
  });
});

// Endpoint lista allevamenti
app.get("/api/allevamenti", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("Errore: Token non fornito");
    return res.status(401).json({ error: "Token non fornito" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Query per ottenere gli allevamenti e il conteggio degli animali (maschi, femmine e totale)
    const sql = `
      SELECT a.*, 
        (SELECT COUNT(*) FROM animali WHERE allevamento_id = a.id) AS totale_animali,
        (SELECT COUNT(*) FROM animali WHERE allevamento_id = a.id AND sesso = 'maschio') AS maschi,
        (SELECT COUNT(*) FROM animali WHERE allevamento_id = a.id AND sesso = 'femmina') AS femmine
      FROM allevamenti a 
      WHERE allevatore_id = ?
    `;
    
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error("Errore SQL:", err);
        return res.status(500).json({ error: "Errore nel recupero degli allevamenti" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Errore JWT:", error);
    res.status(401).json({ error: "Token non valido" });
  }
});

// Endpoint per aggiungere o rimuovere un animale (con sesso e data di nascita)
app.put("/api/allevamento/:id/aggiorna_animali", (req, res) => {
  const { id } = req.params;
  const { sesso, azione, data_nascita } = req.body; // sesso, azione (aggiungi o rimuovi), data_nascita
  
  if (!sesso || !azione || !data_nascita) {
    return res.status(400).json({ error: "Sesso, azione e data di nascita sono richiesti." });
  }

  // Verifica che il sesso sia valido
  if (sesso !== 'maschio' && sesso !== 'femmina') {
    return res.status(400).json({ error: "Sesso deve essere 'maschio' o 'femmina'." });
  }

  // Verifica che l'azione sia valida
  if (azione !== 'aggiungi' && azione !== 'rimuovi') {
    return res.status(400).json({ error: "Azione deve essere 'aggiungi' o 'rimuovi'." });
  }

  // Aggiungi o rimuovi l'animale dalla tabella `animali`
  if (azione === 'aggiungi') {
    const sqlInsert = "INSERT INTO animali (allevamento_id, sesso, data_nascita) VALUES (?, ?, ?)";
    db.query(sqlInsert, [id, sesso, data_nascita], (err, results) => {
      if (err) {
        console.error("Errore nell'inserimento dell'animale:", err);
        return res.status(500).json({ error: "Errore nell'inserimento dell'animale" });
      }
      res.status(200).json({ message: "Animale aggiunto con successo." });
    });
  } else if (azione === 'rimuovi') {
    const sqlDelete = "DELETE FROM animali WHERE allevamento_id = ? AND sesso = ? AND data_nascita = ? LIMIT 1";
    db.query(sqlDelete, [id, sesso, data_nascita], (err, results) => {
      if (err) {
        console.error("Errore nella rimozione dell'animale:", err);
        return res.status(500).json({ error: "Errore nella rimozione dell'animale" });
      }
      res.status(200).json({ message: "Animale rimosso con successo." });
    });
  }
});

// Endpoin storico trattamenti
app.get('/api/allevamento/:id/storico_trattamenti', (req, res) => {
  const allevamentoId = req.params.id; // Ottieni l'ID dell'allevamento dalla route
  
  // Esegui la query per recuperare i trattamenti
  db.query(
    'SELECT * FROM trattamenti WHERE allevamento_id = ?',
    [allevamentoId],  // Parametro per evitare iniezioni SQL
    (err, results) => {
      if (err) {
        console.error('Errore nella query:', err);
        return res.status(500).json({ message: 'Errore nel recupero dello storico trattamenti.' });
      }

      // Verifica se la tabella trattamenti è vuota
      if (results.length === 0) {
        return res.status(404).json({ message: 'Storico trattamenti vuoto per questo allevamento.' });
      }

      // Convertiamo la data in formato YYYY-MM-DD prima di restituirla al client
      const formattedResults = results.map(trattamento => ({
        ...trattamento,
        data_trattamento: new Date(trattamento.data_trattamento).toISOString().split('T')[0] // YYYY-MM-DD
      }));

      return res.json(formattedResults);
    }
  );
});

// Endpoint per aggiornare lo storico trattamenti
app.post('/api/allevamento/:id/aggiungi_trattamento', (req, res) => {
  const allevamentoId = req.params.id;
  const { tipo_trattamento, data_trattamento } = req.body;

  if (!tipo_trattamento || !data_trattamento) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori." });
  }

  db.query(
    'INSERT INTO trattamenti (allevamento_id, tipo_trattamento, data_trattamento) VALUES (?, ?, ?)',
    [allevamentoId, tipo_trattamento, data_trattamento],
    (err, result) => {
      if (err) {
        console.error('Errore nell’inserimento del trattamento:', err);
        return res.status(500).json({ message: 'Errore nell’aggiunta del trattamento.' });
      }
      return res.json({ message: 'Trattamento aggiunto con successo.' });
    }
  );
});









// Avvio del server
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
