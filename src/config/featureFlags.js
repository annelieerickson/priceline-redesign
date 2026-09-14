// Feature flags. Change a default here, or override one in the browser by adding
// it to the URL: ?fareOptionsView=rail  (use =default to clear an override).
// Overrides are saved to localStorage so they survive navigation and reloads.

const FLAGS = {
  // How fare options appear after picking a flight:
  //   'inline' - expands inside the flight card as a horizontally scrolling row
  //   'rail'   - opens in a panel along the right edge of the page
  fareOptionsView: { default: 'inline', allowed: ['inline', 'rail'] },
  // Size of flight cards (and the fare options inside them), the departure summary
  // on the return page, the Edit Search menu, and the checkout page content below its trip bar:
  //   'standard' - full size
  //   'compact'  - scaled to 80%
  uiScale: { default: 'compact', allowed: ['standard', 'compact'] },
}

const STORAGE_KEY = 'featureFlags'

function readStoredOverrides() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function resolveFlags() {
  const overrides = readStoredOverrides()
  const params = new URLSearchParams(window.location.search)

  for (const name of Object.keys(FLAGS)) {
    const value = params.get(name)
    if (value === 'default') delete overrides[name]
    else if (FLAGS[name].allowed.includes(value)) overrides[name] = value
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Storage can be unavailable (private mode, blocked site data); URL overrides still apply
  }

  return Object.fromEntries(
    Object.entries(FLAGS).map(([name, { default: fallback, allowed }]) => [
      name,
      allowed.includes(overrides[name]) ? overrides[name] : fallback,
    ]),
  )
}

export const featureFlags = resolveFlags()

// CSS zoom factor for components that honor uiScale; zoom shrinks text, spacing, and borders together
export const uiZoom = featureFlags.uiScale === 'compact' ? 0.8 : 1

// Smallest text size, in on-screen px, allowed inside zoomed components
const MIN_TEXT_PX = 12

// Font size (px) for small text inside zoomed components: raises it just enough
// that it never renders below MIN_TEXT_PX on screen. No change at standard size.
export const textSize = (px) => Math.max(px, Math.ceil(MIN_TEXT_PX / uiZoom))
