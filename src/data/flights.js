export const airports = {
  ORD: { code: 'ORD', city: 'Chicago, IL', name: "O'Hare Intl Airport" },
  MDW: { code: 'MDW', city: 'Chicago, IL', name: 'Midway Intl Airport' },
  SRQ: { code: 'SRQ', city: 'Sarasota, FL', name: 'Sarasota Bradenton Intl Airport' },
  ATL: { code: 'ATL', city: 'Atlanta, GA', name: 'Hartsfield-Jackson Atlanta Intl Airport' },
  CLT: { code: 'CLT', city: 'Charlotte, NC', name: 'Charlotte Douglas Intl Airport' },
  BNA: { code: 'BNA', city: 'Nashville, TN', name: 'Nashville Intl Airport' },
}

export const defaultSearch = {
  from: airports.ORD,
  to: airports.SRQ,
  departDate: 'Sun, Mar 14',
  returnDate: 'Sat, Mar 20',
  travelers: 3,
  cabinLabel: 'Economy',
  tripType: 'Round-trip',
}

// Base fare ladder shown in the right rail / fare cards for a given flight
export const fareOptions = [
  // price is per person for the cheapest flight; bundleFromPrice is the
  // round-trip total for the default 3 travelers. FareRail offsets both per flight.
  {
    id: 'basic-economy',
    name: 'Basic Economy',
    cabin: 'Economy',
    price: 406,
    bundleFromPrice: 1217,
    perks: [
      { label: 'No Carry-on Bag', included: false },
      { label: 'No Cancellation', included: false },
      { label: 'Seat Selection for a Fee', included: 'fee' },
      { label: 'Checked Bag for a Fee', included: 'fee' },
      { label: 'Changes for a Fee', included: 'fee' },
      { label: 'WiFi for a Fee', included: 'fee' },
    ],
  },
  {
    id: 'economy',
    name: 'Economy',
    cabin: 'Economy',
    price: 496,
    bundleFromPrice: 1487,
    perks: [
      { label: 'No Cancellation', included: false },
      { label: 'Checked Bag for a Fee', included: 'fee' },
      { label: 'WiFi for a Fee', included: 'fee' },
      { label: 'Seat Selection Included', included: true },
      { label: 'Carry-On Bag Included', included: true },
      { label: 'Changes Included', included: true },
    ],
  },
  {
    id: 'premium-economy',
    name: 'Premium Economy',
    cabin: 'Premium Economy',
    price: 689,
    bundleFromPrice: 2066,
    perks: [
      { label: 'Cancellation for a Fee', included: 'fee' },
      { label: 'WiFi for a Fee', included: 'fee' },
      { label: 'Extra-Legroom Seat Included', included: true },
      { label: 'Carry-On Bag Included', included: true },
      { label: '1 Checked Bag Included', included: true },
      { label: 'Changes Included', included: true },
      { label: 'Priority Boarding', included: true },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    cabin: 'Business',
    price: 1142,
    bundleFromPrice: 3425,
    perks: [
      { label: 'WiFi for a Fee', included: 'fee' },
      { label: 'Recliner Seat Included', included: true },
      { label: '2 Checked Bags Included', included: true },
      { label: 'Free Cancellation', included: true },
      { label: 'Changes Included', included: true },
      { label: 'Priority Boarding', included: true },
      { label: 'Lounge Access', included: true },
    ],
  },
  {
    id: 'first',
    name: 'First',
    cabin: 'First',
    price: 1586,
    bundleFromPrice: 4757,
    perks: [
      { label: 'Lie-Flat Seat Included', included: true },
      { label: '3 Checked Bags Included', included: true },
      { label: 'Free Cancellation', included: true },
      { label: 'Changes Included', included: true },
      { label: 'Free WiFi', included: true },
      { label: 'Lounge Access', included: true },
      { label: 'Chef-Curated Dining', included: true },
    ],
  },
]

const { ORD, MDW, SRQ, ATL, CLT, BNA } = airports

// One flight leg. Times are local to each airport (Chicago/Nashville are an hour
// behind Sarasota/Atlanta/Charlotte). layoverAfter is the connection time after this leg.
const leg = (flightNumber, plane, from, departTime, to, arriveTime, duration, layoverAfter) => ({
  flightNumber,
  plane,
  from,
  departTime,
  to,
  arriveTime,
  duration,
  layoverAfter,
})

// Builds a list-ready flight from its legs; top-level times, airports, and
// flight number summarize the whole trip.
function makeFlight({ segments, ...details }) {
  const first = segments[0]
  const last = segments[segments.length - 1]
  const stopCount = segments.length - 1
  return {
    flightNumber: first.flightNumber,
    plane: first.plane,
    from: first.from,
    to: last.to,
    departTime: first.departTime,
    arriveTime: last.arriveTime,
    stops: stopCount === 0 ? 'Nonstop' : `${stopCount} Stop`,
    segments,
    ...details,
  }
}

// Mock round-trip bundle total for the default 3 travelers
const bundleTotalFor3 = (perPersonPrice) => perPersonPrice * 3 - 1

const RECOMMENDED_DEPARTURE = 'Bundled Flights to Sarasota'
const OTHER_DEPARTURE = 'Other Flights to Sarasota'

export const departureFlights = [
  makeFlight({
    id: 'dep-1',
    airline: 'United Airlines',
    segments: [leg('UA 1911', 'Boeing 737-700', ORD, '8:40a', SRQ, '12:37p', '2h 57m')],
    duration: '2h 57m',
    startingPrice: 406,
    bundledRoundTrip: true,
    bundleFromPrice: bundleTotalFor3(406),
    tags: ['Recommended'],
    group: RECOMMENDED_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-2',
    airline: 'United Airlines',
    segments: [leg('UA 2004', 'Airbus A320', ORD, '1:15p', SRQ, '5:08p', '2h 53m')],
    duration: '2h 53m',
    startingPrice: 431,
    bundledRoundTrip: true,
    bundleFromPrice: bundleTotalFor3(431),
    tags: ['Recommended'],
    group: RECOMMENDED_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-3',
    airline: 'Delta Air Lines',
    segments: [
      leg('DL 1422', 'Airbus A321', ORD, '6:00a', ATL, '8:52a', '1h 52m', '1h 08m'),
      leg('DL 1422', 'Airbus A321', ATL, '10:00a', SRQ, '11:24a', '1h 24m'),
    ],
    duration: '4h 24m',
    startingPrice: 368,
    bundledRoundTrip: true,
    bundleFromPrice: bundleTotalFor3(368),
    tags: ['Recommended'],
    group: RECOMMENDED_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-4',
    airline: 'American Airlines',
    segments: [leg('AA 588', 'Airbus A321', ORD, '7:05a', SRQ, '10:59a', '2h 54m')],
    duration: '2h 54m',
    startingPrice: 452,
    bundledRoundTrip: false,
    group: OTHER_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-5',
    airline: 'Southwest Airlines',
    segments: [
      leg('WN 2231', 'Boeing 737-800', MDW, '9:25a', BNA, '10:50a', '1h 25m', '1h 10m'),
      leg('WN 2231', 'Boeing 737-800', BNA, '12:00p', SRQ, '2:35p', '1h 35m'),
    ],
    duration: '4h 10m',
    startingPrice: 329,
    bundledRoundTrip: false,
    group: OTHER_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-6',
    airline: 'American Airlines',
    segments: [
      leg('AA 712', 'Embraer 175', ORD, '3:30p', CLT, '6:22p', '1h 52m', '53m'),
      leg('AA 1964', 'Airbus A319', CLT, '7:15p', SRQ, '8:58p', '1h 43m'),
    ],
    duration: '4h 28m',
    startingPrice: 389,
    bundledRoundTrip: false,
    group: OTHER_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-7',
    airline: 'Delta Air Lines',
    segments: [
      leg('DL 2873', 'Boeing 757-200', ORD, '11:45a', ATL, '2:40p', '1h 55m', '1h 20m'),
      leg('DL 1180', 'Airbus A220-300', ATL, '4:00p', SRQ, '5:26p', '1h 26m'),
    ],
    duration: '4h 41m',
    startingPrice: 397,
    bundledRoundTrip: false,
    group: OTHER_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-8',
    airline: 'United Airlines',
    segments: [leg('UA 1587', 'Boeing 737 MAX 8', ORD, '5:50p', SRQ, '9:41p', '2h 51m')],
    duration: '2h 51m',
    startingPrice: 478,
    bundledRoundTrip: false,
    group: OTHER_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-9',
    airline: 'Southwest Airlines',
    segments: [
      leg('WN 1046', 'Boeing 737 MAX 8', MDW, '2:10p', BNA, '3:35p', '1h 25m', '55m'),
      leg('WN 1046', 'Boeing 737 MAX 8', BNA, '4:30p', SRQ, '7:05p', '1h 35m'),
    ],
    duration: '3h 55m',
    startingPrice: 341,
    bundledRoundTrip: false,
    group: OTHER_DEPARTURE,
  }),
  makeFlight({
    id: 'dep-10',
    airline: 'American Airlines',
    segments: [leg('AA 1290', 'Boeing 737-800', ORD, '10:20a', SRQ, '2:16p', '2h 56m')],
    duration: '2h 56m',
    startingPrice: 509,
    bundledRoundTrip: false,
    group: OTHER_DEPARTURE,
  }),
]

const RECOMMENDED_RETURN = 'Bundled Flights to Chicago'
const OTHER_RETURN = 'Other Flights to Chicago'
// Bundle total when paired with the cheapest bundled departure
const RETURN_BUNDLE_BASE = bundleTotalFor3(406)

export const returnFlights = [
  makeFlight({
    id: 'ret-1',
    airline: 'United Airlines',
    segments: [leg('UA 1912', 'Boeing 737-700', SRQ, '1:25p', ORD, '3:22p', '2h 57m')],
    duration: '2h 57m',
    bundleDelta: 0,
    separatePrice: 460,
    bundledRoundTrip: true,
    bundleFromPrice: RETURN_BUNDLE_BASE,
    tags: ['Recommended'],
    group: RECOMMENDED_RETURN,
  }),
  makeFlight({
    id: 'ret-2',
    airline: 'United Airlines',
    segments: [leg('UA 2091', 'Airbus A320', SRQ, '6:05p', ORD, '7:58p', '2h 53m')],
    duration: '2h 53m',
    bundleDelta: 61,
    separatePrice: 489,
    bundledRoundTrip: true,
    bundleFromPrice: RETURN_BUNDLE_BASE + 61 * 3,
    tags: ['Recommended'],
    group: RECOMMENDED_RETURN,
  }),
  makeFlight({
    id: 'ret-3',
    airline: 'Delta Air Lines',
    segments: [
      leg('DL 1509', 'Airbus A220-300', SRQ, '7:10a', ATL, '8:35a', '1h 25m', '1h 15m'),
      leg('DL 2214', 'Airbus A321', ATL, '9:50a', ORD, '10:55a', '2h 05m'),
    ],
    duration: '4h 45m',
    bundleDelta: 24,
    separatePrice: 402,
    bundledRoundTrip: true,
    bundleFromPrice: RETURN_BUNDLE_BASE + 24 * 3,
    tags: ['Recommended'],
    group: RECOMMENDED_RETURN,
  }),
  makeFlight({
    id: 'ret-4',
    airline: 'American Airlines',
    segments: [leg('AA 415', 'Airbus A321', SRQ, '11:30a', ORD, '1:27p', '2h 57m')],
    duration: '2h 57m',
    bundleDelta: null,
    separatePrice: 406,
    bundledRoundTrip: false,
    group: OTHER_RETURN,
  }),
  makeFlight({
    id: 'ret-5',
    airline: 'Southwest Airlines',
    segments: [
      leg('WN 3318', 'Boeing 737-800', SRQ, '10:15a', BNA, '10:55a', '1h 40m', '1h 05m'),
      leg('WN 3318', 'Boeing 737-800', BNA, '12:00p', MDW, '1:35p', '1h 35m'),
    ],
    duration: '4h 20m',
    bundleDelta: null,
    separatePrice: 318,
    bundledRoundTrip: false,
    group: OTHER_RETURN,
  }),
  makeFlight({
    id: 'ret-6',
    airline: 'American Airlines',
    segments: [
      leg('AA 1877', 'Airbus A319', SRQ, '4:40p', CLT, '6:20p', '1h 40m', '1h 10m'),
      leg('AA 2045', 'Embraer 175', CLT, '7:30p', ORD, '8:32p', '2h 02m'),
    ],
    duration: '4h 52m',
    bundleDelta: null,
    separatePrice: 377,
    bundledRoundTrip: false,
    group: OTHER_RETURN,
  }),
  makeFlight({
    id: 'ret-7',
    airline: 'Delta Air Lines',
    segments: [
      leg('DL 2230', 'Boeing 757-200', SRQ, '2:30p', ATL, '3:58p', '1h 28m', '57m'),
      leg('DL 876', 'Airbus A321', ATL, '4:55p', ORD, '5:59p', '2h 04m'),
    ],
    duration: '4h 29m',
    bundleDelta: null,
    separatePrice: 391,
    bundledRoundTrip: false,
    group: OTHER_RETURN,
  }),
  makeFlight({
    id: 'ret-8',
    airline: 'United Airlines',
    segments: [leg('UA 1744', 'Boeing 737 MAX 8', SRQ, '8:15a', ORD, '10:09a', '2h 54m')],
    duration: '2h 54m',
    bundleDelta: null,
    separatePrice: 512,
    bundledRoundTrip: false,
    group: OTHER_RETURN,
  }),
]

export function findFlight(list, id) {
  return list.find((f) => f.id === id)
}
