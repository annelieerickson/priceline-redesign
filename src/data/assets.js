// Image assets. Put files in /public and reference them through BASE_URL, which
// is '/' locally and '/priceline-redesign/' on GitHub Pages.
const base = import.meta.env.BASE_URL

// Airline logos keyed by IATA code. Airlines without an entry fall back to a
// colored tile showing the code.
export const airlineLogos = {
  UA: `${base}airlines/UA.svg`,
  AA: `${base}airlines/AA.svg`,
  WN: `${base}airlines/WN.svg`,
  DL: `${base}airlines/DL.svg`,
}

// Search page hero photo, e.g. `${base}images/search-hero.jpg`.
// null shows the built-in illustration instead.
export const heroImage = null
