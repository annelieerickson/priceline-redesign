# Priceline Flight Booking Redesign

A clickable prototype that reimagines Priceline's round-trip flight booking flow, from search through checkout. Built with React and Priceline's open-source design system, using mock flight data.

> **Student concept project.** This is not affiliated with or endorsed by Priceline. The Priceline name and styling, and the airline logos in `public/airlines`, belong to their respective owners and are used here for educational purposes only.

## The booking flow

1. **Search** (`/`): enter airports, dates, and travelers. Once a search has been started, a "Pick up where you left off" card appears so you can resume at the furthest step reached.
2. **Departure flights** (`/departure`): browse recommended and other flights with filters. Selecting a flight expands its fare options (Basic Economy through First) right inside the card.
3. **Confirm details**: review the flight and fare in a popup before continuing.
4. **Return flights** (`/return`): opens straight to the return flights, with a summary of the chosen departure above the list. Flights bundled with the departure are grouped in a collapsible "Bundled Flights" section (open by default) and priced as an add-on; an info icon explains how bundling works. Flights booked separately are listed below at full price. On bundled flights you can keep your current cabin class in one click or see other fare options.
5. **Checkout** (`/checkout`): expandable flight details (including each leg and layover), seat and baggage information, and a summary of charges.

Design decisions worth noting:

- **Cabin class is picked after choosing a flight**, so the price shown is the price for the cabin actually selected.
- **A step progress bar** (Departure, Fare Selection, Return, Fare Selection) and an **Edit Search** menu stay available throughout the flow.
- **Consistent buttons**: every action button uses one shared style (white with a blue outline, filling blue on hover), defined in `src/components/Button.jsx`.

## Getting started

Requires [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (developed with Node 22.14).

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the development server with hot reload |
| `npm run build`   | Build a production bundle into `dist/`   |
| `npm run preview` | Serve the production build locally        |
| `npm run lint`    | Check the code with Oxlint                |


## Data and images

- **Flights and fares** are mock data in `src/data/flights.js`: 10 departures and 8 returns between Chicago (ORD/MDW) and Sarasota (SRQ) across United, American, Delta, and Southwest, including 1-stop itineraries with layovers.
- **Airline logos** are registered in `src/data/assets.js`. To add one, put an SVG or PNG in `public/airlines/` named by the airline's two-letter code (for example `B6.svg`) and add it to `airlineLogos`. Airlines without a logo show a colored tile with their code.
- **Search page hero image**: set `heroImage` in `src/data/assets.js` to a file in `public/` (for example `'/images/search-hero.jpg'`). When it's `null`, a built-in illustration is shown.

## Project structure

```
src/
  pages/        One component per route: Search, Departure, Return, Checkout
  components/   Flight and fare cards, dialogs, filters, navigation, shared Button
  context/      BookingContext: search, selected flights and fares, UI state
  config/       Feature flags and sizing helpers
  data/         Mock flights, fares, and image asset registry
  utils/        Formatting helpers for times and prices
public/
  airlines/     Airline logo files
```

## Tech stack

- [React 18](https://react.dev/) with [React Router](https://reactrouter.com/)
- [Vite](https://vite.dev/) for development and builds
- [pcln-design-system](https://github.com/priceline/design-system) and pcln-icons, Priceline's open-source component and icon libraries
- [styled-components](https://styled-components.com/) for component styling
- [Oxlint](https://oxc.rs/) for linting

## Known limitations

- All flights, prices, and availability are mock data; nothing is booked or charged.
- Filters and sorting show their options and counts but don't change the flight list yet.
- Booking progress is kept in memory, so reloading the page starts the flow over. (Feature flag choices are saved.)
- Only the flight search flow is interactive. Tabs such as Hotels and Cars, and links like "View all recent activity", show a short message instead.
- Continue to Checkout on the final page marks the end of the prototype's scope.
