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
- **Karte:** Leaflet ist lokal gebündelt (`assets/vendor/leaflet/`), nur die
  OpenStreetMap-Kacheln werden extern geladen. Keine Cookies, keine Tracker.
- **Fotos:** aktuell SVG-Platzhalter — Anleitung zum Austausch in
  `assets/img/README.md`.

## Vor Veröffentlichung prüfen (TODO)

- [ ] **Koordinaten** in `assets/js/data.js` stimmen ungefähr, sind aber
      geschätzt — Haus- und Attraktionsmarker einmal gegen OpenStreetMap prüfen.
      Die Routenverläufe sind bewusst schematisch (offizielle GPX verlinkt).
- [ ] **E-Mail-Adresse** `info@dreifelsenblick.de` auf den Kontaktseiten ist
      angenommen — durch die echte Adresse ersetzen.
- [ ] **Check-in-Zeiten** (15:00 / 10:30 Uhr) und Ausstattungsdetails
      (WLAN, TV, Parken) auf den Wohnungsseiten bestätigen oder anpassen.
- [ ] **Impressum & Datenschutz** vervollständigen.
- [ ] Eigene **Fotos** einfügen (`assets/img/README.md`).
