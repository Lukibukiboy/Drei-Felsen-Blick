# Eigene Fotos einbinden

Die Website nutzt aktuell farbige SVG-Platzhalter, weil die Original-Fotos von
www.dreifelsenblick.de nicht automatisch übernommen werden konnten. So tauschen
Sie die Platzhalter gegen echte Fotos aus:

1. **Fotos in diesen Ordner legen** (`assets/img/`), am besten als JPG,
   ca. 1600 px Breite, Querformat 4:3 oder 16:10. Empfohlene Dateinamen:

   | Datei                  | Motiv                                  |
   |------------------------|----------------------------------------|
   | `hero.jpg`             | Haus oder Felsenblick (Startseite)     |
   | `eg-wohnzimmer.jpg`    | Erdgeschoss: Wohnzimmer                |
   | `eg-kueche.jpg`        | Erdgeschoss: Wohnküche                 |
   | `eg-terrasse.jpg`      | Terrasse & Garten                      |
   | `dg-wohnzimmer.jpg`    | Dachgeschoss: Wohnzimmer               |
   | `dg-balkonblick.jpg`   | Balkonblick auf die Felsen             |
   | `schlafzimmer.jpg`     | Schlafzimmer                           |
   | `bad.jpg`              | Badezimmer                             |

2. **Platzhalter ersetzen:** In `wohnungen.html` und `en/apartments.html`
   (Galerie-Abschnitt, `<div class="gallery-grid">`) das jeweilige
   `<svg>…</svg>` durch ein `<img>` ersetzen, z. B.:

   ```html
   <figure>
     <img src="assets/img/eg-wohnzimmer.jpg" alt="Wohnzimmer der Erdgeschosswohnung" loading="lazy">
     <figcaption>Wohnzimmer Erdgeschoss</figcaption>
   </figure>
   ```

   (Auf den englischen Seiten `../assets/img/…` als Pfad verwenden.)

3. Genauso können die Illustrationen in den Wohnungs-Abschnitten
   (`<div class="apartment-media">`) und die Attraktions-Illustrationen
   (Funktion `attractionArt()` in `assets/js/main.js`) durch Fotos ersetzt
   werden. Danach den Hinweiskasten (`class="placeholder-note"`) auf beiden
   Galerie-Seiten löschen.
