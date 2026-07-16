# Drei-Felsen-Blick — Website

Statische, zweisprachige Website (DE/EN) für die Ferienwohnungen
**Drei-Felsen-Blick**, Sonnenweg 23, 54568 Gerolstein (Vulkaneifel) —
komplett ohne Build-Schritt und ohne Framework.

## Seiten

| Deutsch             | English               | Inhalt                                   |
|---------------------|-----------------------|------------------------------------------|
| `index.html`        | `en/index.html`       | Startseite mit Hero & Überblick          |
| `wohnungen.html`    | `en/apartments.html`  | Beide Wohnungen, Ausstattung, Galerie    |
| `umgebung.html`     | `en/surroundings.html`| Attraktionen mit Filter & Kartenlink     |
| `wanderkarte.html`  | `en/hiking-map.html`  | Interaktive Leaflet-Karte mit 6 Touren   |
| `kontakt.html`      | `en/contact.html`     | Kontakt, Anreise, Buchungshinweise       |
| `impressum.html` / `datenschutz.html` | —    | Rechtliche Platzhalter (bitte ausfüllen) |

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

(Direktes Öffnen der HTML-Dateien funktioniert auch; nur die Kartenkacheln
brauchen eine Internetverbindung.)

## Veröffentlichen mit GitHub Pages

Repository-Einstellungen → *Pages* → Branch `main`, Ordner `/ (root)` wählen.
Alle Pfade sind relativ, die Seite läuft daher auch unter
`https://<user>.github.io/Drei-Felsen-Blick/` oder mit eigener Domain.

## Technik

- **Design:** `assets/css/style.css` — grünes Farbsystem über CSS-Variablen.
- **Inhalte:** Attraktionen & Wanderrouten liegen zentral und zweisprachig in
  `assets/js/data.js` und werden per JavaScript gerendert — Texte, Entfernungen
  und Koordinaten also nur an einer Stelle pflegen.
- **Karte:** Leaflet ist lokal gebündelt (`assets/vendor/leaflet/`). Die **echten
  Routenverläufe** lädt der Browser des Besuchers live: OSM-Relationen über die
  Overpass-API (Eifelsteig = Relation 1176757, Felsen-/Keltenpfad per
  Namenssuche), die beiden Tourvorschläge über BRouter (Wander-Routing).
  Ergebnisse werden 7 Tage im localStorage gecacht; ohne Internet fällt die
  Karte auf schematische Linien aus `data.js` zurück (Status-Chip je Route
  zeigt „OSM ✓“ / „berechnet ✓“ / „schematisch“). Zusätzlich gibt es ein
  optionales Overlay mit allen markierten Wanderwegen (Waymarked Trails).
- **Attraktions-Fotos:** ebenfalls client-seitig — festes Wikimedia-Commons-Bild
  (`photo`-Feld in `data.js`), sonst automatische Commons-Geosearch nahe der
  Koordinaten, sonst SVG-Illustration. Bildnachweis-Chip verlinkt auf die
  Commons-Dateiseite. Ein Bild „festpinnen“: `photo.file` +
  `photo.page` beim jeweiligen Eintrag in `data.js` setzen.
- Keine Cookies, keine Tracker.

## Original-Fotos von www.dreifelsenblick.de

Konnten aus dieser Arbeitsumgebung **nicht** übernommen werden: Die
Netzwerk-Richtlinie der Claude-Umgebung blockiert hier sämtliche ausgehenden
Abrufe (getestet: direkter Abruf, Proxy, WebFetch — alles 403 am Gateway).
Zwei Wege:

1. In den Einstellungen der Claude-Code-Umgebung (claude.ai/code →
   Environment → Netzwerkzugriff) vollen Internetzugang erlauben und die
   Übernahme in einer neuen Session erneut anstoßen, **oder**
2. die Fotos selbst in `assets/img/` ablegen — Anleitung in
   `assets/img/README.md`.

## Vor Veröffentlichung prüfen (TODO)

- [ ] **Koordinaten** in `assets/js/data.js` stimmen ungefähr, sind aber
      geschätzt — Haus- und Attraktionsmarker einmal gegen OpenStreetMap prüfen.
      (Die Routenverläufe kommen live aus OSM und korrigieren sich selbst.)
- [ ] **Attraktions-Fotos** einmal im Browser ansehen: passt die automatische
      Bildwahl? Sonst per `photo.file` in `data.js` ein besseres Commons-Bild
      festlegen.
- [ ] **E-Mail-Adresse** `info@dreifelsenblick.de` auf den Kontaktseiten ist
      angenommen — durch die echte Adresse ersetzen.
- [ ] **Check-in-Zeiten** (15:00 / 10:30 Uhr) und Ausstattungsdetails
      (WLAN, TV, Parken) auf den Wohnungsseiten bestätigen oder anpassen.
- [ ] **Impressum & Datenschutz** vervollständigen.
- [ ] Eigene **Fotos** der Wohnungen einfügen (`assets/img/README.md`).
