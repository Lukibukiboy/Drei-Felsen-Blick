/* ==========================================================================
   Drei-Felsen-Blick — interaktive Wanderkarte (Leaflet, lokal gebündelt)

   Erwartet: #map (Karte) und #route-list (Sidebar). Deep-Links:
   wanderkarte.html#poi-<id>   → Attraktion fokussieren
   wanderkarte.html#route-<id> → Route fokussieren

   ECHTE ROUTENVERLÄUFE: Beim Laden holt der Browser die realen Verläufe —
   OSM-Relationen über die Overpass-API, Tourvorschläge über BRouter
   (Wander-Routing). Ergebnisse werden 7 Tage in localStorage gecacht.
   Ohne Internet / bei API-Fehlern bleibt der schematische Verlauf aus
   data.js stehen und die Karte funktioniert wie zuvor.
   ========================================================================== */

(function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  const MAP_STRINGS = {
    house: { de: "Ihr Feriendomizil", en: "Your holiday home" },
    moreInfo: { de: "Mehr in „Umgebung“", en: "More under “Surroundings”" },
    lengthLabel: { de: "Länge", en: "Length" },
    gpxLabel: { de: "Offizielle Tourinfo & GPX", en: "Official trail info & GPX" },
    geoLive: { de: "Verlauf: OSM ✓", en: "Course: OSM ✓" },
    geoCalc: { de: "Route berechnet ✓", en: "Route calculated ✓" },
    geoSchematic: { de: "Verlauf schematisch", en: "Schematic course" },
    suggestion: { de: "Tourvorschlag", en: "Suggested tour" },
    noteFallback: {
      de: "⚠️ Routenverläufe derzeit schematisch dargestellt (kein Netz zu OpenStreetMap) — für die Navigation bitte die verlinkten offiziellen GPX-Tracks nutzen. Kartendaten: © OpenStreetMap-Mitwirkende.",
      en: "⚠️ Route courses currently shown schematically (no connection to OpenStreetMap) — please use the linked official GPX tracks for navigation. Map data: © OpenStreetMap contributors."
    },
    noteLive: {
      de: "✓ Routenverläufe live aus OpenStreetMap geladen; Tourvorschläge per BRouter berechnet. Für unterwegs empfehlen wir die verlinkten offiziellen GPX-Tracks. Kartendaten: © OpenStreetMap-Mitwirkende.",
      en: "✓ Route courses loaded live from OpenStreetMap; suggested tours calculated via BRouter. For the trail itself we recommend the linked official GPX tracks. Map data: © OpenStreetMap contributors."
    },
    osmAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    wmtAttribution: 'Wanderwege: <a href="https://hiking.waymarkedtrails.org">Waymarked Trails</a> (CC-BY-SA)'
  };
  const surroundingsPage = LANG === "en" ? "surroundings.html" : "umgebung.html";

  const map = L.map("map", { scrollWheelZoom: true });
  map.setView([SITE_DATA.house.lat, SITE_DATA.house.lng], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: MAP_STRINGS.osmAttribution
  }).addTo(map);

  /* Overlay: alle markierten Wanderwege (Waymarked Trails) ------------------ */
  const wmtLayer = L.tileLayer("https://hiking.waymarkedtrails.org/hiking/{z}/{x}/{y}.png", {
    maxZoom: 18,
    opacity: 0.85,
    attribution: MAP_STRINGS.wmtAttribution
  });
  const wmtToggle = document.getElementById("wmt-toggle");
  if (wmtToggle) {
    wmtToggle.addEventListener("change", () => {
      if (wmtToggle.checked) wmtLayer.addTo(map); else map.removeLayer(wmtLayer);
    });
  }

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
  const routeLayers = {};   // id → L.featureGroup
  const routeVisible = {};  // id → checkbox-Zustand
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
    routeVisible[id] = true;
    const cb = routeCards[id] && routeCards[id].querySelector("input");
    if (cb) cb.checked = true;
    map.fitBounds(layer.getBounds(), { padding: [36, 36] });
    setActiveCard(id);
  }

  /* Ein Routen-Layer aus 1..n Segmenten bauen */
  function buildRouteLayer(route, segments) {
    const group = L.featureGroup(
      segments.map((seg) => L.polyline(seg, {
        color: route.color,
        weight: 4.5,
        opacity: 0.85,
        dashArray: route.id === "eifelsteig" ? "8 7" : null
      }))
    );
    group.bindPopup(`<h4>${route.name[LANG]}</h4><p>${route.text[LANG]}</p>`);
    group.on("click", () => setActiveCard(route.id));
    return group;
  }

  function setGeoStatus(routeId, state) {
    const el = document.querySelector(`[data-geo="${routeId}"]`);
    if (!el) return;
    el.classList.toggle("live", state !== "schematic");
    el.textContent = state === "osm" ? MAP_STRINGS.geoLive[LANG]
      : state === "calc" ? MAP_STRINGS.geoCalc[LANG]
      : MAP_STRINGS.geoSchematic[LANG];
  }

  SITE_DATA.routes.forEach((route) => {
    const group = buildRouteLayer(route, [route.path]).addTo(map);
    routeLayers[route.id] = group;
    routeVisible[route.id] = true;

    if (!listEl) return;
    const card = document.createElement("article");
    card.className = "route-card";
    card.id = "route-" + route.id;
    card.style.setProperty("--route-color", route.color);
    const suggestionBadge = route.suggestion
      ? `<span class="badge familie">${MAP_STRINGS.suggestion[LANG]}</span>` : "";
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
        ${suggestionBadge}
        <span class="geo-status" data-geo="${route.id}">${MAP_STRINGS.geoSchematic[LANG]}</span>
      </div>
      <p>${route.highlights[LANG].join(" · ")}</p>
      <p style="margin-top:6px;"><a class="route-gpx" href="${route.gpx}" target="_blank" rel="noopener">${MAP_STRINGS.gpxLabel[LANG]} ↗</a></p>`;

    card.querySelector("input").addEventListener("change", (e) => {
      routeVisible[route.id] = e.target.checked;
      if (e.target.checked) {
        routeLayers[route.id].addTo(map);
      } else {
        map.removeLayer(routeLayers[route.id]);
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

  /* ==========================================================================
     Echte Routenverläufe nachladen (Overpass + BRouter, mit Cache & Fallback)
     ========================================================================== */
  const GEO_CACHE_KEY = "dfb-geo-v1";
  const GEO_TTL_MS = 7 * 24 * 3600 * 1000;

  function readGeoCache() {
    try {
      const c = JSON.parse(localStorage.getItem(GEO_CACHE_KEY));
      if (c && Date.now() - c.ts < GEO_TTL_MS) return c.data;
    } catch (e) {}
    return null;
  }

  function clipSegments(segments, bbox) {
    if (!bbox) return segments;
    const [s, w, n, e] = bbox;
    const inside = (p) => p[0] >= s && p[0] <= n && p[1] >= w && p[1] <= e;
    const out = [];
    segments.forEach((seg) => {
      let cur = [];
      seg.forEach((p) => {
        if (inside(p)) {
          cur.push(p);
        } else if (cur.length > 1) {
          out.push(cur);
          cur = [];
        } else {
          cur = [];
        }
      });
      if (cur.length > 1) out.push(cur);
    });
    return out;
  }

  async function fetchOverpass(routes) {
    const parts = [];
    routes.forEach((r) => {
      if (r.geo.rel) parts.push(`relation(${r.geo.rel});`);
      if (r.geo.name) parts.push(`relation["route"="hiking"]["name"~"${r.geo.name}"](50.16,6.55,50.3,6.8);`);
    });
    if (!parts.length) return {};
    const query = `[out:json][timeout:25];(${parts.join("")});out geom;`;
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(20000)
    });
    if (!resp.ok) throw new Error("overpass " + resp.status);
    const json = await resp.json();
    const result = {};
    (json.elements || []).forEach((el) => {
      if (el.type !== "relation") return;
      const segments = (el.members || [])
        .filter((m) => m.type === "way" && Array.isArray(m.geometry))
        .map((m) => m.geometry.map((g) => [g.lat, g.lon]))
        .filter((seg) => seg.length > 1);
      if (!segments.length) return;
      const route = routes.find((r) =>
        (r.geo.rel && r.geo.rel === el.id) ||
        (r.geo.name && el.tags && (el.tags.name || "").includes(r.geo.name))
      );
      if (route) result[route.id] = clipSegments(segments, route.geo.clip);
    });
    return result;
  }

  async function fetchBrouter(route) {
    const lonlats = route.geo.waypoints.map((p) => p.join(",")).join("|");
    const url = "https://brouter.de/brouter?lonlats=" + encodeURIComponent(lonlats) +
      "&profile=hiking-mountain&alternativeidx=0&format=geojson";
    const resp = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!resp.ok) throw new Error("brouter " + resp.status);
    const json = await resp.json();
    const coords = json.features && json.features[0] &&
      json.features[0].geometry && json.features[0].geometry.coordinates;
    if (!coords || coords.length < 2) throw new Error("brouter empty");
    return [coords.map((c) => [c[1], c[0]])];
  }

  function applyRealGeometry(routeId, segments, state) {
    const route = SITE_DATA.routes.find((r) => r.id === routeId);
    if (!route || !segments || !segments.length) return;
    const old = routeLayers[routeId];
    const fresh = buildRouteLayer(route, segments);
    if (map.hasLayer(old)) map.removeLayer(old);
    if (routeVisible[routeId]) fresh.addTo(map);
    routeLayers[routeId] = fresh;
    setGeoStatus(routeId, state);
  }

  async function loadRealGeometry() {
    let geo = readGeoCache();
    if (!geo) {
      geo = {};
      const overpassRoutes = SITE_DATA.routes.filter((r) => r.geo && r.geo.type === "overpass");
      const brouterRoutes = SITE_DATA.routes.filter((r) => r.geo && r.geo.type === "brouter");
      const [overpassRes, ...brouterRes] = await Promise.allSettled([
        fetchOverpass(overpassRoutes),
        ...brouterRoutes.map((r) => fetchBrouter(r))
      ]);
      if (overpassRes.status === "fulfilled") Object.assign(geo, overpassRes.value);
      brouterRoutes.forEach((r, i) => {
        if (brouterRes[i].status === "fulfilled") geo[r.id] = brouterRes[i].value;
      });
      // Kombinationsrouten aus bereits geladenen Verläufen zusammensetzen
      SITE_DATA.routes.filter((r) => r.geo && r.geo.type === "combine").forEach((r) => {
        const pieces = r.geo.of.map((id) => geo[id]).filter(Boolean);
        if (pieces.length === r.geo.of.length) geo[r.id] = [].concat(...pieces);
      });
      if (Object.keys(geo).length) {
        try { localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: geo })); } catch (e) {}
      }
    }

    let anyLive = false;
    SITE_DATA.routes.forEach((r) => {
      if (geo[r.id]) {
        applyRealGeometry(r.id, geo[r.id], r.geo && r.geo.type === "brouter" ? "calc" : "osm");
        anyLive = true;
      }
    });
    const note = document.getElementById("map-note-text");
    if (note && anyLive) note.textContent = MAP_STRINGS.noteLive[LANG];
  }

  const note = document.getElementById("map-note-text");
  if (note) note.textContent = MAP_STRINGS.noteFallback[LANG];
  loadRealGeometry().catch(() => { /* Fallback: schematische Linien bleiben */ });
})();
