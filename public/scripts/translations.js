const translations = {

    it: {
        // IMPOSTAZIONI
        titolo_impostazioni: "IMPOSTAZIONI",
        tema: "Tema Scuro",
        lingua: "Lingua",
        notifiche: "Notifiche news",
        soglia: "Soglia consumi",
        logout: "Log Out",

        home_title: "HOME",
        dashboard_title: "DASHBOARD",

        // ARTICOLO
        chiavi_articolo: "Chiavi di ricerca:",
        titolo: "Titolo",
        corpo: "Corpo dell'articolo",
        link: "Link dell'immagine",
        ins_chiave: "Inserisci chiave",
        pubblica: "Pubblica",

        // NEWS
        titolo_news: "News",
        input_chiavi: "Inserisci una chiave di ricerca",
        chiavi_card: "Chiavi:",

        // IMPIANTO
        co2: "CO2 Risparmiata:",
        selezione_periodo: "Seleziona periodo",
        oggi: "Oggi",
        settimana: "Questa settimana",
        mese: "Questo mese",
        periodo_personalizzato: "Periodo personalizzato",
        mostra: "Mostra",

        // SELEZIONE IMPIANTO
        titolo_selezione: "Selezione l'impianto"
    },


    en: {
        // SETTINGS
        titolo_impostazioni: "SETTINGS",
        tema: "Dark Theme",
        lingua: "Language",
        notifiche: "News Notifications",
        soglia: "Consumption Threshold",
        logout: "Log Out",

        home_title: "HOME",
        dashboard_title: "DASHBOARD",

        // ARTICLE
        chiavi_articolo: "Search Keys:",
        titolo: "Title",
        corpo: "Article Body",
        link: "Image Link",
        ins_chiave: "Enter Key",
        pubblica: "Publish",

        // NEWS
        titolo_news: "News",
        input_chiavi: "Enter a search key",
        chiavi_card: "Keys:",

        // PLANT / SYSTEM
        co2: "CO2 Saved:",
        selezione_periodo: "Select Period",
        oggi: "Today",
        settimana: "This Week",
        mese: "This Month",
        periodo_personalizzato: "Custom Period",
        mostra: "Show",

        // PLANT SELECTION
        titolo_selezione: "Select the Plant"
    },


    de: {
        // EINSTELLUNGEN
        titolo_impostazioni: "EINSTELLUNGEN",
        tema: "Dunkles Thema",
        lingua: "Sprache",
        notifiche: "News-Benachrichtigungen",
        soglia: "Verbrauchsschwelle",
        logout: "Abmelden",

        home_title: "STARTSEITE",
        dashboard_title: "DASHBOARD",

        // ARTIKEL
        chiavi_articolo: "Suchbegriffe:",
        titolo: "Titel",
        corpo: "Artikelinhalt",
        link: "Bildlink",
        ins_chiave: "Begriff eingeben",
        pubblica: "Veröffentlichen",


        // NEWS
        titolo_news: "Nachrichten",
        input_chiavi: "Suchbegriff eingeben",
        chiavi_card: "Begriffe:",

        // ANLAGE
        co2: "Eingespartes CO2:",
        selezione_periodo: "Zeitraum auswählen",
        oggi: "Heute",
        settimana: "Diese Woche",
        mese: "Dieser Monat",
        periodo_personalizzato: "Benutzerdefinierter Zeitraum",
        mostra: "Anzeigen",

        // ANLAGENAUSWAHL
        titolo_selezione: "Anlage auswählen"
    }

};


function cambiaLingua() {
    const lang = localStorage.getItem("lingua") || "it";
    const elements = document.querySelectorAll("[data-lingua]");

    if (!translations[lang]) {
        console.warn("Lingua non trovata:", lang);
        return;
    }

    elements.forEach(element => {
        const key = element.getAttribute("data-lingua");

        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}