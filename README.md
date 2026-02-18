# Info su EcoTn

**Versione**: 1.0.0  
**Gruppo**: G17  
**Membri**: Leonardo Essam Dei Rossi, Simone Guerra, Daniele Lacarbonara  

**Descrizione**  
Questa repository ospita un prototipo del progetto di Ingegneria del Software *EcoTn*. Il prototipo implementa parzialmente quanto definito nel documento D1, coprendo dieci delle User Stories specificate.

## Tecnologie utilizzate
### Runtime
* **Express 5** – Server HTTP e definizione degli endpoint REST
* **Mongoose** – Modellazione delle entità e accesso a MongoDB
* **Cors** – Gestione delle richieste cross-origin
* **Express-session** – Gestione delle sessioni

### Testing
* **Jest** – Framework di testing
* **Supertest** – Test delle API HTTP

### Configurazione
* **dotenv** – Gestione delle variabili d’ambiente

## Requisiti e avvio

Requisiti:
- Node.js ≥ 20
- MongoDB configurato tramite variabile `DB_URL` in un file `.env`

È disponibile nella root del progetto un file `.env.example` come modello di configurazione.

Avvio:

```bash
npm install
npm start
