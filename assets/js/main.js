/* ==========================================================================
   Drei-Felsen-Blick — allgemeine Seitenlogik
   Sprache: wird aus <html lang="de|en"> gelesen.
   ========================================================================== */

const LANG = document.documentElement.lang === "en" ? "en" : "de";

const UI_STRINGS = {
  showOnMap: { de: "Auf der Karte zeigen", en: "Show on the map" },
  fromHouse: { de: "vom Haus", en: "from the house" },
  all: { de: "Alle", en: "All" },
  photoCredit: { de: "Foto", en: "Photo" }
};

/* Mobile Navigation ------------------------------------------------------- */
(function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

/* SVG-Platzhalter für Attraktionsbilder ----------------------------------- */
function attractionArt(att) {
  const palettes = {
    natur:   ["#d8f3dc", "#2d6a4f", "#95d5b2"],
    familie: ["#fdeeca", "#b5651d", "#e9c46a"],
    kultur:  ["#e6e2f5", "#453a78", "#b3a8e0"],
    aktiv:   ["#dcecf7", "#1e5378", "#8bbfdd"]
  };
  const [bg, dark, mid] = palettes[att.cat] || palettes.natur;
  return `
    <svg viewBox="0 0 320 200" role="img" aria-label="${att.name[LANG]}" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="200" fill="${bg}"/>
      <circle cx="262" cy="44" r="24" fill="${mid}" opacity="0.85"/>
      <path d="M0 200 L70 92 L120 160 L170 74 L230 200 Z" fill="${mid}"/>
      <path d="M90 200 L180 60 L250 150 L290 110 L320 200 Z" fill="${dark}"/>
      <path d="M0 176 Q80 158 160 176 T320 176 L320 200 L0 200 Z" fill="${dark}" opacity="0.55"/>
    </svg>`;
}

/* Echte Fotos von Wikimedia Commons ----------------------------------------
   Stufe 1: festes Bild aus data.js (photo.file) über Special:FilePath.
   Stufe 2: Commons-Geosearch nahe den Koordinaten (CORS-fähige API).
   Stufe 3: nichts gefunden/offline → SVG-Illustration bleibt stehen.
   Ergebnisse werden 7 Tage in localStorage gecacht. */
const IMG_CACHE_KEY = "dfb-img-v1";
const CACHE_TTL_MS = 7 * 24 * 3600 * 1000;

function readCache(key) {
  try {
    const c = JSON.parse(localStorage.getItem(key));
    if (c && Date.now() - c.ts < CACHE_TTL_MS) return c.data;
  } catch (e) { /* privater Modus o. Ä. */ }
  return null;
}
function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch (e) {}
}

function commonsFileUrl(file, width) {
  return "https://commons.wikimedia.org/wiki/Special:FilePath/" +
    encodeURIComponent(file) + "?width=" + (width || 800);
}

function stripHtml(s) {
  const d = document.createElement("div");
  d.innerHTML = s || "";
  return (d.textContent || "").trim();
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(url);
    im.onerror = reject;
    im.src = url;
  });
}

async function geosearchPhoto(att) {
  const cache = readCache(IMG_CACHE_KEY) || {};
  if (att.id in cache) return cache[att.id]; // auch negativer Treffer (null) gecacht
  let result = null;
  try {
    const api = "https://commons.wikimedia.org/w/api.php" +
      "?action=query&generator=geosearch&ggscoord=" + att.lat + "%7C" + att.lng +
      "&ggsradius=500&ggslimit=1&ggsnamespace=6" +
      "&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=800&format=json&origin=*";
    const resp = await fetch(api, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) throw new Error("commons " + resp.status);
    const json = await resp.json();
    const pages = json.query && json.query.pages ? Object.values(json.query.pages) : [];
    const info = pages.length && pages[0].imageinfo && pages[0].imageinfo[0];
    if (info && info.thumburl) {
      const meta = info.extmetadata || {};
      result = {
        url: info.thumburl,
        page: info.descriptionurl || "https://commons.wikimedia.org",
        credit: stripHtml(meta.Artist && meta.Artist.value) || "Wikimedia Commons",
        license: stripHtml(meta.LicenseShortName && meta.LicenseShortName.value)
      };
    }
  } catch (e) { /* offline / API nicht erreichbar → SVG bleibt */ }
  cache[att.id] = result;
  writeCache(IMG_CACHE_KEY, cache);
  return result;
}

async function enhanceCardMedia(att, mediaEl) {
  let photo = null;
  if (att.photo && att.photo.file) {
    const url = commonsFileUrl(att.photo.file, 800);
    try {
      await preloadImage(url);
      photo = { url, page: att.photo.page, credit: "Wikimedia Commons", license: "" };
    } catch (e) { /* kuratiertes Bild nicht ladbar → Geosearch versuchen */ }
  }
  if (!photo) {
    photo = await geosearchPhoto(att);
    if (photo) {
      try { await preloadImage(photo.url); } catch (e) { photo = null; }
    }
  }
  if (!photo || !mediaEl.isConnected) return;
  const img = document.createElement("img");
  img.src = photo.url;
  img.alt = att.name[LANG];
  img.loading = "lazy";
  const credit = document.createElement("a");
  credit.className = "img-credit";
  credit.href = photo.page;
  credit.target = "_blank";
  credit.rel = "noopener";
  credit.textContent = "© " + UI_STRINGS.photoCredit[LANG] + ": " +
    (photo.credit || "Wikimedia Commons") + (photo.license ? " · " + photo.license : "");
  mediaEl.replaceChildren(img, credit);
  mediaEl.classList.add("has-photo");
}

/* Attraktions-Karten (Umgebung + Startseiten-Teaser) ----------------------- */
function attractionCard(att, mapPage) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.cat = att.cat;
  card.innerHTML = `
    <div class="card-media" data-att="${att.id}">${attractionArt(att)}</div>
    <div class="card-body">
      <div class="card-meta">
        <span class="badge ${att.cat}">${SITE_DATA.categories[att.cat][LANG]}</span>
        <span class="distance-tag">${att.distance[LANG]} ${UI_STRINGS.fromHouse[LANG]}</span>
      </div>
      <h3>${att.name[LANG]}</h3>
      <p>${att.text[LANG]}</p>
      <a class="card-link" href="${mapPage}#poi-${att.id}">${UI_STRINGS.showOnMap[LANG]}</a>
    </div>`;
  enhanceCardMedia(att, card.querySelector(".card-media"));
  return card;
}

/* Karten-Grid mit Filterleiste rendern.
   containerId: Ziel-Div · mapPage: relativer Pfad zur Wanderkarte ·
   ids: optionale Teilmenge (Startseiten-Teaser) · withFilter: Filterpillen */
function renderAttractions(containerId, mapPage, ids, withFilter) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = ids
    ? SITE_DATA.attractions.filter((a) => ids.includes(a.id))
    : SITE_DATA.attractions;

  const grid = document.createElement("div");
  grid.className = "card-grid";
  list.forEach((att) => grid.appendChild(attractionCard(att, mapPage)));

  if (withFilter) {
    const bar = document.createElement("div");
    bar.className = "filter-bar";
    const cats = ["all", ...Object.keys(SITE_DATA.categories)];
    cats.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = cat === "all" ? UI_STRINGS.all[LANG] : SITE_DATA.categories[cat][LANG];
      if (cat === "all") btn.classList.add("active");
      btn.addEventListener("click", () => {
        bar.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        grid.querySelectorAll(".card").forEach((c) => {
          c.style.display = cat === "all" || c.dataset.cat === cat ? "" : "none";
        });
      });
      bar.appendChild(btn);
    });
    container.appendChild(bar);
  }

  container.appendChild(grid);
}

/* Jahr im Footer ----------------------------------------------------------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
