// Importa le dipendenze
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Inizializza l'app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per interpretare JSON e dati URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura la connessione al database SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Errore nella connessione al database:', err.message);
  } else {
    console.log('Connesso al database SQLite.');
  }
});

// Crea la tabella se non esiste
db.run(`CREATE TABLE IF NOT EXISTS punteggi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  squadra1 TEXT,
  punteggio1 INTEGER,
  squadra2 TEXT,
  punteggio2 INTEGER
)`);

// Crea l'endpoint POST per inserire i punteggi
app.post('/inserisci-punteggio', (req, res) => {
  const { squadra1, punteggio1, squadra2, punteggio2 } = req.body;

  // Prepara la query SQL per inserire i dati
  const query = `INSERT INTO punteggi (squadra1, punteggio1, squadra2, punteggio2) VALUES (?, ?, ?, ?)`;

  // Esegui la query
  db.run(query, [squadra1, punteggio1, squadra2, punteggio2], function (err) {
    if (err) {
      console.error('Errore durante l\'inserimento dei dati:', err.message);
      return res.status(500).json({ error: 'Errore nell\'inserimento dei dati' });
    }
    // Invia una risposta con successo
    res.status(200).json({ success: 'Punteggio inserito con successo', id: this.lastID });
  });
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
