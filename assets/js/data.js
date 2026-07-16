/* ==========================================================================
   Drei-Felsen-Blick — zentrale Daten (DE/EN)
   --------------------------------------------------------------------------
   HINWEIS ZU KOORDINATEN: Alle Koordinaten sind sorgfältig geschätzt, aber
   NICHT vermessen. Bitte vor Veröffentlichung einmal gegen OpenStreetMap /
   Google Maps prüfen und hier korrigieren — jede Zahl steht nur an dieser
   einen Stelle. Die Routenverläufe sind bewusst schematisch (Luftlinien-
   Polygone zwischen den Highlights), keine GPS-Tracks; offizielle
   GPX-Downloads sind je Route verlinkt.
   ========================================================================== */

const SITE_DATA = {
  house: {
    lat: 50.2245,
    lng: 6.665,
    name: {
      de: "Ferienwohnungen Drei-Felsen-Blick",
      en: "Drei-Felsen-Blick Holiday Apartments"
    },
    address: "Sonnenweg 23, 54568 Gerolstein"
  },

  categories: {
    natur:   { de: "Natur",   en: "Nature" },
    familie: { de: "Familie", en: "Family" },
    kultur:  { de: "Kultur",  en: "Culture" },
    aktiv:   { de: "Aktiv",   en: "Active" }
  },

  attractions: [
    {
      id: "dolomiten",
      cat: "natur",
      lat: 50.2258, lng: 6.669,
      distance: { de: "200 m", en: "200 m" },
      walk: { de: "ca. 5 Min. zu Fuß", en: "approx. 5 min on foot" },
      name: { de: "Gerolsteiner Dolomiten & Munterley", en: "Gerolstein Dolomites & Munterley" },
      text: {
        de: "Die Namensgeber unseres Hauses: Die mächtigen Dolomitfelsen — Munterley (482 m), Hustley und Auberg — ragen direkt hinter dem Haus auf. Vom Munterley-Plateau blickt man weit über Gerolstein und das Kylltal. Seit 1990 Naturschutzgebiet.",
        en: "Our house is named after them: the mighty dolomite rocks — Munterley (482 m), Hustley and Auberg — rise directly behind the house. From the Munterley plateau you look far across Gerolstein and the Kyll valley. A nature reserve since 1990."
      }
    },
    {
      id: "buchenloch",
      cat: "natur",
      lat: 50.227, lng: 6.6705,
      distance: { de: "1 km", en: "1 km" },
      walk: { de: "ca. 20 Min. zu Fuß", en: "approx. 20 min on foot" },
      name: { de: "Buchenlochhöhle", en: "Buchenloch Cave" },
      text: {
        de: "Eine frei begehbare Karsthöhle mitten im Naturschutzgebiet — rund 30 Meter tief, einst Unterschlupf für Neandertaler und Rentierjäger. Taschenlampe nicht vergessen!",
        en: "A freely accessible karst cave in the middle of the nature reserve — around 30 metres deep, once a shelter for Neanderthals and reindeer hunters. Don't forget a torch!"
      }
    },
    {
      id: "papenkaule",
      cat: "natur",
      lat: 50.231, lng: 6.674,
      distance: { de: "1,5 km", en: "1.5 km" },
      walk: { de: "ca. 30 Min. zu Fuß", en: "approx. 30 min on foot" },
      name: { de: "Papenkaule (Vulkankrater)", en: "Papenkaule (volcanic crater)" },
      text: {
        de: "Der Trichter eines vor rund 10.000 Jahren aktiven Vulkans: ca. 80 Meter breit, 20 Meter tief — Vulkaneifel zum Anfassen, direkt oberhalb der Dolomiten.",
        en: "The funnel of a volcano active around 10,000 years ago: roughly 80 metres wide and 20 metres deep — the Volcanic Eifel up close, just above the Dolomites."
      }
    },
    {
      id: "kletterfelsen",
      cat: "aktiv",
      lat: 50.225, lng: 6.668,
      distance: { de: "200 m", en: "200 m" },
      walk: { de: "ca. 5 Min. zu Fuß", en: "approx. 5 min on foot" },
      name: { de: "Kletterfelsen Gerolstein", en: "Gerolstein climbing rocks" },
      text: {
        de: "Die Dolomitwände bieten gesicherte Kletterrouten verschiedener Schwierigkeitsgrade — eines der bekanntesten Klettergebiete der Eifel, praktisch vor der Haustür.",
        en: "The dolomite walls offer bolted climbing routes of various grades — one of the best-known climbing areas in the Eifel, practically on our doorstep."
      }
    },
    {
      id: "kasselburg",
      cat: "familie",
      lat: 50.2352, lng: 6.6893,
      distance: { de: "4 km", en: "4 km" },
      walk: { de: "ca. 1 Std. zu Fuß / 8 Min. Auto", en: "approx. 1 h on foot / 8 min by car" },
      name: { de: "Adler- & Wolfspark Kasselburg", en: "Kasselburg Eagle & Wolf Park" },
      text: {
        de: "In den Mauern der Kasselburg aus dem 12. Jahrhundert lebt Westeuropas größtes Wolfsrudel. Täglich Flugvorführungen der Greifvögel und Wolfsfütterung — das Highlight für Familien.",
        en: "Within the walls of the 12th-century Kasselburg castle lives Western Europe's largest wolf pack. Daily birds-of-prey flight shows and wolf feedings — the highlight for families."
      }
    },
    {
      id: "naturkundemuseum",
      cat: "kultur",
      lat: 50.2228, lng: 6.657,
      distance: { de: "900 m", en: "900 m" },
      walk: { de: "ca. 12 Min. zu Fuß", en: "approx. 12 min on foot" },
      name: { de: "Naturkundemuseum Gerolstein", en: "Gerolstein Natural History Museum" },
      text: {
        de: "Im barocken alten Rathaus von 1710: Fossilien, Vulkanismus, Mineralien und Ur- und Frühgeschichte der Eifel auf drei Etagen — perfekt für Regentage.",
        en: "In the baroque old town hall of 1710: fossils, volcanism, minerals and the Eifel's early history on three floors — perfect for rainy days."
      }
    },
    {
      id: "erloeserkirche",
      cat: "kultur",
      lat: 50.2232, lng: 6.6588,
      distance: { de: "800 m", en: "800 m" },
      walk: { de: "ca. 10 Min. zu Fuß", en: "approx. 10 min on foot" },
      name: { de: "Erlöserkirche & Villa Sarabodis", en: "Church of the Redeemer & Villa Sarabodis" },
      text: {
        de: "Die neoromanische Erlöserkirche (1913) mit prachtvollen Mosaiken ist das Wahrzeichen der Stadt. Daneben: die Ausgrabungen der römischen Villa Sarabodis.",
        en: "The neo-Romanesque Church of the Redeemer (1913) with its magnificent mosaics is the town's landmark. Right next to it: the excavated Roman Villa Sarabodis."
      }
    },
    {
      id: "wasserspielplatz",
      cat: "familie",
      lat: 50.2222, lng: 6.66,
      distance: { de: "800 m", en: "800 m" },
      walk: { de: "ca. 10 Min. zu Fuß", en: "approx. 10 min on foot" },
      name: { de: "Wasserspielplatz an der Kyll", en: "Water playground on the Kyll" },
      text: {
        de: "Mitten im Zentrum plantschen die Kleinen am Kyllufer, während die Großen im Café nebenan sitzen — im Sommer der Treffpunkt für Familien.",
        en: "Right in the town centre, little ones splash on the banks of the Kyll while the grown-ups sit in the café next door — the summer meeting point for families."
      }
    },
    {
      id: "freibad",
      cat: "familie",
      lat: 50.218, lng: 6.652,
      distance: { de: "1 km", en: "1 km" },
      walk: { de: "ca. 15 Min. zu Fuß", en: "approx. 15 min on foot" },
      name: { de: "Schwimmbad Gerolstein", en: "Gerolstein swimming pool" },
      text: {
        de: "Das Gerolsteiner Bad mit großzügigem Außenbereich liegt nur einen Kilometer vom Haus entfernt — Abkühlung nach der Wanderung inklusive.",
        en: "Gerolstein's pool with its generous outdoor area is just one kilometre from the house — a refreshing dip after your hike included."
      }
    },
    {
      id: "brunnen",
      cat: "kultur",
      lat: 50.217, lng: 6.648,
      distance: { de: "1,5 km", en: "1.5 km" },
      walk: { de: "ca. 20 Min. zu Fuß", en: "approx. 20 min on foot" },
      name: { de: "Gerolsteiner Brunnen", en: "Gerolsteiner mineral springs" },
      text: {
        de: "Hier sprudelt Deutschlands bekanntestes Mineralwasser aus vulkanischem Untergrund. Der Brunnenplatz und die Historie des Wassers gehören zu jedem Gerolstein-Besuch.",
        en: "Germany's most famous mineral water rises here from volcanic ground. The spring square and the story of the water are part of every visit to Gerolstein."
      }
    },
    {
      id: "kylltalradweg",
      cat: "aktiv",
      lat: 50.221, lng: 6.6585,
      distance: { de: "600 m", en: "600 m" },
      walk: { de: "Einstieg am Bahnhof", en: "start at the station" },
      name: { de: "Kylltal-Radweg", en: "Kyll Valley cycle path" },
      text: {
        de: "Von der Quelle bis nach Trier folgt der Radweg dem Flüsschen Kyll — ab Gerolstein rollt es gemütlich talabwärts, zurück geht's bequem mit der Bahn.",
        en: "From its source down to Trier the cycle path follows the little river Kyll — from Gerolstein it rolls gently downhill, and the train brings you comfortably back."
      }
    },
    {
      id: "maare",
      cat: "natur",
      lat: 50.1775, lng: 6.848,
      distance: { de: "20 km", en: "20 km" },
      walk: { de: "ca. 25 Min. Auto", en: "approx. 25 min by car" },
      name: { de: "Dauner Maare (Tagesausflug)", en: "Daun maars (day trip)" },
      text: {
        de: "Die „Augen der Eifel“: Weinfelder, Schalkenmehrener und Gemündener Maar. Baden, wandern, staunen — ein perfekter Tagesausflug in die Vulkaneifel.",
        en: "The “eyes of the Eifel”: the Weinfeld, Schalkenmehren and Gemünden maars. Swim, hike, marvel — a perfect day trip into the Volcanic Eifel."
      }
    }
  ],

  /* ------------------------------------------------------------------------
     Wanderrouten ab Haus. path = schematischer Verlauf (siehe Hinweis oben).
     ------------------------------------------------------------------------ */
  routes: [
    {
      id: "felsenpfad",
      color: "#2d6a4f",
      lengthKm: 9,
      duration: { de: "ca. 3,5–4 Std.", en: "approx. 3.5–4 h" },
      difficulty: "mittel",
      gpx: "https://www.eifelsteig.de/de/touren/gerolsteiner-felsenpfad",
      name: { de: "Gerolsteiner Felsenpfad", en: "Gerolstein Rock Trail (Felsenpfad)" },
      text: {
        de: "Der Klassiker direkt ab Haustür: über das Munterley-Plateau zur Buchenlochhöhle, weiter zum Vulkankrater Papenkaule und über die Hustley zurück ins Kylltal. Ausgezeichneter Vulkaneifel-Pfad.",
        en: "The classic straight from our door: across the Munterley plateau to Buchenloch Cave, on to the Papenkaule volcanic crater and back into the Kyll valley via the Hustley. A certified Vulkaneifel trail."
      },
      highlights: {
        de: ["Munterley-Aussicht", "Buchenlochhöhle", "Papenkaule", "Hustley"],
        en: ["Munterley viewpoint", "Buchenloch Cave", "Papenkaule", "Hustley"]
      },
      path: [
        [50.2245, 6.665], [50.225, 6.668], [50.2258, 6.669], [50.227, 6.6705],
        [50.2285, 6.672], [50.231, 6.674], [50.2318, 6.678], [50.2295, 6.681],
        [50.2272, 6.6795], [50.2255, 6.6765], [50.2238, 6.672], [50.2232, 6.668],
        [50.2245, 6.665]
      ]
    },
    {
      id: "keltenpfad",
      color: "#b5651d",
      lengthKm: 8,
      duration: { de: "ca. 3 Std.", en: "approx. 3 h" },
      difficulty: "mittel",
      gpx: "https://www.geopark-vulkaneifel.de/eifel/wandern/vulkaneifelpfade/davon-zusaetzlich-musse-pfade/gerolsteiner-dolomitenacht-felsenpfad.html",
      name: { de: "Gerolsteiner Keltenpfad", en: "Gerolstein Celtic Trail (Keltenpfad)" },
      text: {
        de: "Hinauf zur Dietzenley (617 m), dem Hausberg Gerolsteins: Aussichtsturm, keltischer Ringwall und stille Waldpfade im Gerolsteiner Wald südlich des Hauses.",
        en: "Up to the Dietzenley (617 m), Gerolstein's local peak: lookout tower, a Celtic ring wall and quiet forest paths in the woods south of the house."
      },
      highlights: {
        de: ["Dietzenley mit Aussichtsturm", "Keltischer Ringwall", "Gerolsteiner Wald"],
        en: ["Dietzenley with lookout tower", "Celtic ring wall", "Gerolstein forest"]
      },
      path: [
        [50.2245, 6.665], [50.2232, 6.668], [50.2205, 6.671], [50.2165, 6.6735],
        [50.2115, 6.675], [50.2075, 6.676], [50.2085, 6.6705], [50.213, 6.667],
        [50.218, 6.6645], [50.2215, 6.6635], [50.2245, 6.665]
      ]
    },
    {
      id: "dolomitenacht",
      color: "#453a78",
      lengthKm: 16,
      duration: { de: "ca. 6 Std.", en: "approx. 6 h" },
      difficulty: "mittel",
      gpx: "https://www.geopark-vulkaneifel.de/eifel/wandern/vulkaneifelpfade/davon-zusaetzlich-musse-pfade/gerolsteiner-dolomitenacht-felsenpfad.html",
      name: { de: "Gerolsteiner Dolomiten-Acht", en: "Gerolstein Dolomites Figure-of-Eight" },
      text: {
        de: "Die große Runde für einen ganzen Wandertag: Felsenpfad und Keltenpfad zusammen ergeben eine Acht — mit dem Haus fast genau am Kreuzungspunkt der beiden Schleifen.",
        en: "The big loop for a full day of hiking: the Rock Trail and Celtic Trail combine into a figure of eight — with our house almost exactly at the crossing point of the two loops."
      },
      highlights: {
        de: ["Beide Schleifen an einem Tag", "Munterley & Dietzenley", "Start und Ziel am Haus"],
        en: ["Both loops in one day", "Munterley & Dietzenley", "starts and ends at the house"]
      },
      path: [
        [50.2245, 6.665], [50.2258, 6.669], [50.231, 6.674], [50.2295, 6.681],
        [50.2255, 6.6765], [50.2232, 6.668], [50.2165, 6.6735], [50.2075, 6.676],
        [50.213, 6.667], [50.2215, 6.6635], [50.2245, 6.665]
      ]
    },
    {
      id: "kasselburgrunde",
      color: "#1e5378",
      lengthKm: 9,
      duration: { de: "ca. 3 Std. (einfach 1 Std.)", en: "approx. 3 h (one way 1 h)" },
      difficulty: "leicht",
      gpx: "https://www.gerolsteiner-land.de/pois/gerolsteiner-dolomiten",
      name: { de: "Kasselburg-Runde", en: "Kasselburg Loop" },
      text: {
        de: "Durch den Pelmer Wald zur Kasselburg mit Adler- & Wolfspark — Wolfsfütterung ansehen, auf der Burg picknicken und über Pelm zurück nach Gerolstein wandern.",
        en: "Through the Pelm forest to Kasselburg castle with its Eagle & Wolf Park — watch the wolf feeding, picnic at the castle and hike back to Gerolstein via Pelm."
      },
      highlights: {
        de: ["Adler- & Wolfspark", "Burgruine Kasselburg", "Pelmer Wald"],
        en: ["Eagle & Wolf Park", "Kasselburg castle ruins", "Pelm forest"]
      },
      path: [
        [50.2245, 6.665], [50.2258, 6.669], [50.2285, 6.6745], [50.2315, 6.681],
        [50.2352, 6.6893], [50.2318, 6.6855], [50.2285, 6.6805], [50.2262, 6.6745],
        [50.2245, 6.665]
      ]
    },
    {
      id: "eifelsteig",
      color: "#7a5a12",
      lengthKm: 25,
      duration: { de: "Tagesetappe", en: "full-day stage" },
      difficulty: "mittel",
      gpx: "https://www.eifelsteig.de/",
      name: { de: "Eifelsteig (Etappe ab Gerolstein)", en: "Eifelsteig (stage from Gerolstein)" },
      text: {
        de: "Der Premium-Fernwanderweg von Aachen nach Trier führt nur 200 m am Haus vorbei. Ab Gerolstein Richtung Süden nach Daun oder Richtung Norden nach Hillesheim — und abends mit der Bahn zurück.",
        en: "The premium long-distance trail from Aachen to Trier passes just 200 m from the house. From Gerolstein head south towards Daun or north towards Hillesheim — and take the train back in the evening."
      },
      highlights: {
        de: ["Fernwanderweg Aachen–Trier", "Einstieg 200 m vom Haus", "Rückfahrt mit der Bahn"],
        en: ["Aachen–Trier long-distance trail", "trailhead 200 m from the house", "return by train"]
      },
      path: [
        [50.245, 6.638], [50.238, 6.6485], [50.2305, 6.6575], [50.2262, 6.6635],
        [50.2245, 6.665], [50.2232, 6.668], [50.2205, 6.6745], [50.2135, 6.6845],
        [50.206, 6.696], [50.198, 6.71]
      ]
    },
    {
      id: "familienrunde",
      color: "#52b788",
      lengthKm: 3,
      duration: { de: "ca. 1–1,5 Std.", en: "approx. 1–1.5 h" },
      difficulty: "leicht",
      gpx: "https://www.gerolsteiner-land.de/en/hiking",
      name: { de: "Kleine Familienrunde", en: "Short family walk" },
      text: {
        de: "Unsere Empfehlung für den Ankunftstag: gemütlich hinauf zur Buchenlochhöhle, mit der Taschenlampe hinein, danach den Sonnenuntergang vom Munterley-Kreuz aus genießen.",
        en: "Our tip for arrival day: stroll up to Buchenloch Cave, explore it by torchlight, then enjoy the sunset from the Munterley summit cross."
      },
      highlights: {
        de: ["Buchenlochhöhle", "Munterley-Kreuz", "auch für kleine Kinder machbar"],
        en: ["Buchenloch Cave", "Munterley summit cross", "doable with small children"]
      },
      path: [
        [50.2245, 6.665], [50.225, 6.668], [50.2262, 6.6695], [50.227, 6.6705],
        [50.2258, 6.669], [50.2245, 6.665]
      ]
    }
  ]
};

/* Schwierigkeits-Labels */
const DIFFICULTY_LABELS = {
  leicht: { de: "leicht", en: "easy" },
  mittel: { de: "mittel", en: "moderate" }
};
