/* ==========================================================================
   Drei-Felsen-Blick — interaktive Wanderkarte (Leaflet, lokal gebündelt)
   Erwartet: #map (Karte) und #route-list (Sidebar). Deep-Links:
   wanderkarte.html#poi-<id>  → Attraktion fokussieren
   wanderkarte.html#route-<id> → Route fokussieren
   ========================================================================== */

(function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  const MAP_STRINGS = {
    house: { de: "Ihr Feriendomizil", en: "Your holiday home" },
    moreInfo: { de: "Mehr in „Umgebung“", en: "More under “Surroundings”" },
    lengthLabel: { de: "Länge", en: "Length" },
    gpxLabel: { de: "Offizielle Tourinfo & GPX", en: "Official trail info & GPX" },
    osmAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  };
  const surroundingsPage = LANG === "en" ? "surroundings.html" : "umgebung.html";

  const map = L.map("map", { scrollWheelZoom: true });
  map.setView([SITE_DATA.house.lat, SITE_DATA.house.lng], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: MAP_STRINGS.osmAttribution
  }).addTo(map);

  /* Haus-Marker ------------------------------------------------------------ */
  const houseIcon = L.divIcon({
    className: "",
    html: '<div class="house-marker" style="width:30px;height:30px;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(-45deg);font-size:15px;line-height:1;">🏡</span></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26]
  });
  const houseMarker = L.marker([SITE_DATA.house.lat, SITE_DATA.house.lng], {
    icon: houseIcon,
    zIndexOffset: 1000
  }).addTo(map);
  houseMarker.bindPopup(
    `<h4>${SITE_DATA.house.name[LANG]}</h4>` +
    `<p>${SITE_DATA.house.address}<br><em>${MAP_STRINGS.house[LANG]}</em></p>`
  );

  /* Attraktions-Marker ------------------------------------------------------ */
  const catColors = { natur: "#2d6a4f", familie: "#b5651d", kultur: "#453a78", aktiv: "#1e5378" };
  const poiMarkers = {};

  SITE_DATA.attractions.forEach((att) => {
    const icon = L.divIcon({
      className: "",
      html: `<div class="poi-marker" style="width:18px;height:18px;background:${catColors[att.cat]};"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10]
    });
    const marker = L.marker([att.lat, att.lng], { icon }).addTo(map);
    marker.bindPopup(
      `<h4>${att.name[LANG]}</h4>` +
      `<span class="distance-tag">${att.distance[LANG]} · ${att.walk[LANG]}</span>` +
      `<p>${att.text[LANG].slice(0, 130)}…<br>` +
      `<a href="${surroundingsPage}#${att.id}">${MAP_STRINGS.moreInfo[LANG]}</a></p>`
    );
    poiMarkers[att.id] = marker;
  });

  /* Routen + Sidebar --------------------------------------------------------- */
  const routeLayers = {};
  const routeCards = {};
  const listEl = document.getElementById("route-list");

  function setActiveCard(id) {
    Object.values(routeCards).forEach((c) => c.classList.remove("active"));
    if (id && routeCards[id]) routeCards[id].classList.add("active");
  }

  function focusRoute(id) {
    const layer = routeLayers[id];
    if (!layer) return;
    if (!map.hasLayer(layer)) layer.addTo(map);
    const cb = routeCards[id] && routeCards[id].querySelector("input");
    if (cb) cb.checked = true;
    map.fitBounds(layer.getBounds(), { padding: [36, 36] });
    setActiveCard(id);
  }

  SITE_DATA.routes.forEach((route) => {
    const line = L.polyline(route.path, {
      color: route.color,
      weight: 4.5,
      opacity: 0.85,
      dashArray: route.id === "eifelsteig" ? "8 7" : null
    }).addTo(map);
    line.bindPopup(`<h4>${route.name[LANG]}</h4><p>${route.text[LANG]}</p>`);
    line.on("click", () => setActiveCard(route.id));
    routeLayers[route.id] = line;

    if (!listEl) return;
    const card = document.createElement("article");
    card.className = "route-card";
    card.id = "route-" + route.id;
    card.style.setProperty("--route-color", route.color);
    card.innerHTML = `
      <div class="route-card-head">
        <span class="route-swatch"></span>
        <h3>${route.name[LANG]}</h3>
        <input type="checkbox" checked aria-label="${route.name[LANG]}">
      </div>
      <div class="route-stats">
        <span>${MAP_STRINGS.lengthLabel[LANG]}: ${String(route.lengthKm).replace(".", LANG === "de" ? "," : ".")} km</span>
        <span>${route.duration[LANG]}</span>
        <span class="difficulty ${route.difficulty}">${DIFFICULTY_LABELS[route.difficulty][LANG]}</span>
      </div>
      <p>${route.highlights[LANG].join(" · ")}</p>
      <p style="margin-top:6px;"><a class="route-gpx" href="${route.gpx}" target="_blank" rel="noopener">${MAP_STRINGS.gpxLabel[LANG]} ↗</a></p>`;

    card.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) {
        line.addTo(map);
      } else {
        map.removeLayer(line);
        card.classList.remove("active");
      }
    });
    card.addEventListener("click", (e) => {
      if (e.target.closest("input") || e.target.closest("a")) return;
      focusRoute(route.id);
    });

    routeCards[route.id] = card;
    listEl.appendChild(card);
  });

  /* Deep-Links (#poi-…, #route-…) ------------------------------------------- */
  function handleHash() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    if (hash.startsWith("poi-")) {
      const marker = poiMarkers[hash.slice(4)];
      if (marker) {
        map.setView(marker.getLatLng(), 15);
        marker.openPopup();
      }
    } else if (hash.startsWith("route-")) {
      focusRoute(hash.slice(6));
      const card = routeCards[hash.slice(6)];
      if (card) card.scrollIntoView({ block: "nearest" });
    }
  }
  window.addEventListener("hashchange", handleHash);
  handleHash();

  /* Anfangs alles Sichtbare einpassen, außer ein Deep-Link zielt bereits. */
  if (!window.location.hash) {
    const all = L.featureGroup(Object.values(routeLayers).concat([houseMarker]));
    map.fitBounds(all.getBounds(), { padding: [30, 30] });
  }
})();
