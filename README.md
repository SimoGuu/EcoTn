# Info su EcoTn

**Versione**: 0.0.1  
**Gruppo**: G17  
**Membri**: Leonardo Essam Dei Rossi, Simone Guerra, Daniele Lacarbonara  

**Descrizione**  
Questa repository ospita un prototipo del progetto di Ingegneria del Software *EcoTn*. Il prototipo implementa parzialmente quanto definito nel documento D1, coprendo dieci delle User Stories specificate.

## Dipendenze principali

Runtime:
- **Express**: server HTTP e definizione degli endpoint REST.
- **Mongoose**: modellazione delle entità e accesso a MongoDB.

Sviluppo:
- **dotenv**: gestione delle variabili d’ambiente tramite file `.env`.
- **Jest**: esecuzione dei test automatici.

## Requisiti e avvio

Requisiti:
- Node.js ≥ 18
- MongoDB accessibile tramite `DB_URL` nel file `.env`.

Avvio:

```bash
npm install
npm start
