/* ============================================
   VIETNAM · FIELD JOURNAL — app.js
   All trip data + rendering logic
   ============================================ */

'use strict';

const APP_VERSION = '3';

// ── Supabase · Collaborative editing ─────────────────────────
const SUPABASE_URL  = 'https://pzpswmbfqftnoyoxlrzq.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cHN3bWJmcWZ0bm95b3hscnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzE4NjgsImV4cCI6MjA4ODAwNzg2OH0.EKD-TnCP7oBcIBUBo2Gjik3-vrtAbef2I3BYnUA_50w';

let _sb          = null;    // Supabase client
let _editMode    = false;   // edit mode active?
let _currentUser = localStorage.getItem('vn_user') || '';
let _userPlaces  = [];      // local cache from DB
let _stars       = [];      // [{item_key, user_name}]
let _itemMeta    = {};      // {itemKey: {maps_url}}
let _dayPlans    = [];      // [{id, date, item_key, item_name, city, section, done}]

// ── Trip Data ────────────────────────────────
const TRIP = {
  itinerary: [
    {
      date: '2026-03-06', title: 'Depart LAX — 10:50 AM',
      from: 'Los Angeles', to: 'In the air',
      travel: '20 hours, 1 stop — Korean Air', type: 'flight',
      notes: 'Stef e-visa: E260212USA59547149160. Check evisa.gov.vn 4 days out.',
      hotel: null, hotel_address: null,
      refs: ['E9WTAF', 'E260212USA59547149160']
    },
    {
      date: '2026-03-07', title: 'Arrive Ho Chi Minh City',
      from: 'In the air', to: 'Ho Chi Minh City',
      travel: 'Arrive 10:20 PM', type: 'flight',
      notes: 'Store luggage at hotel, get train food for later.',
      hotel: 'Liberty Central Saigon Riverside Hotel',
      hotel_address: '17 Ton Duc Thang, District 1, Ho Chi Minh City',
      refs: ['966228062']
    },
    {
      date: '2026-03-08', title: 'Ho Chi Minh City',
      from: 'Ho Chi Minh City', to: 'Ho Chi Minh City',
      travel: '', type: 'day',
      notes: 'Full day to explore.',
      hotel: 'Liberty Central Saigon Riverside Hotel',
      hotel_address: '17 Ton Duc Thang, District 1, Ho Chi Minh City',
      refs: []
    },
    {
      date: '2026-03-09', title: 'Ho Chi Minh City — Night Train',
      from: 'Ho Chi Minh City', to: 'Overnight train',
      travel: '8:30 PM · SE2 · 15–17 hrs · Coach 9, Seats 1–4', type: 'train',
      notes: 'Be 30 min early. E-ticket in email/drive.',
      hotel: null, hotel_address: null,
      refs: ['3B1CAD']
    },
    {
      date: '2026-03-10', title: 'Hoi An',
      from: 'Overnight train', to: 'Hoi An',
      travel: 'Arrive ~1 PM via Da Nang', type: 'train',
      notes: 'Zen Boutique Eco will pick you up on the arrivals platform at Da Nang.',
      hotel: 'Zen Boutique Eco',
      hotel_address: '87 Ly Thuong Kiet, Cam Chau, Hoi An',
      refs: ['5331628842']
    },
    {
      date: '2026-03-11', title: 'Hoi An',
      from: 'Hoi An', to: 'Hoi An',
      travel: '', type: 'day',
      notes: 'Cooking class? Old town lantern walk at night.',
      hotel: 'Zen Boutique Eco',
      hotel_address: '87 Ly Thuong Kiet, Cam Chau, Hoi An',
      refs: []
    },
    {
      date: '2026-03-12', title: 'Scooter to Hue via Hai Van Pass',
      from: 'Hoi An', to: 'Hue',
      travel: 'Pickup at hotel 9 AM · Easy Rider with Mister T', type: 'scooter',
      notes: 'Dramatic ocean cliffs. Arrive Hue around 4–5 PM.',
      hotel: 'Pisces Hotel Hue',
      hotel_address: '6/4 kiet 7 Nguyễn Công Trứ, Phú Hội, Hue',
      refs: ['1365980523', '6038803088']
    },
    {
      date: '2026-03-13', title: 'Hue → Phong Nha',
      from: 'Hue', to: 'Phong Nha',
      travel: '4-hour bus · HK Buslines · 9 AM, be 30 min early', type: 'bus',
      notes: 'From 35 Nguyen Cong Tru (2 blocks from hotel). E-ticket in folder.',
      hotel: 'Phong Nha Coco Riverside',
      hotel_address: 'Phong Nha, Quảng Bình Province',
      refs: ['12GO27634922']
    },
    {
      date: '2026-03-14', title: 'Phong Nha',
      from: 'Phong Nha', to: 'Phong Nha',
      travel: '', type: 'day',
      notes: 'Adventure day — caves, hiking, national park.',
      hotel: 'Phong Nha Coco Riverside',
      hotel_address: 'Phong Nha, Quảng Bình Province',
      refs: []
    },
    {
      date: '2026-03-15', title: 'Phong Nha — Overnight Train',
      from: 'Phong Nha', to: 'Overnight train',
      travel: 'Departs midnight from Dong Hoi · Coach 8, Seats 1 & 2', type: 'train',
      notes: 'Be at Dong Hoi station 12:10 AM (30 min early). 10-hour ride.',
      hotel: null, hotel_address: null,
      refs: ['F745F4']
    },
    {
      date: '2026-03-16', title: 'Ninh Binh',
      from: 'Overnight train', to: 'Ninh Binh',
      travel: 'Arrives 9:04 AM', type: 'train',
      notes: 'Check into ecolodge. Rest day after the train.',
      hotel: 'Tam Cốc area ecolodge',
      hotel_address: 'Ninh Binh, Vietnam',
      refs: []
    },
    {
      date: '2026-03-17', title: 'Ninh Binh',
      from: 'Ninh Binh', to: 'Ninh Binh',
      travel: '', type: 'day',
      notes: 'Row to Trang An early (7–9 AM is ideal). Sunset at Mua Cave.',
      hotel: 'Tam Cốc area ecolodge',
      hotel_address: 'Ninh Binh, Vietnam',
      refs: []
    },
    {
      date: '2026-03-18', title: 'Ninh Binh → Hanoi',
      from: 'Ninh Binh', to: 'Hanoi',
      travel: '2-hour train', type: 'train',
      notes: 'Potential to spend another night in Ninh Binh if you want.',
      hotel: 'Hanoi hotel TBD',
      hotel_address: null,
      refs: []
    },
    {
      date: '2026-03-19', title: 'Hanoi',
      from: 'Hanoi', to: 'Hanoi',
      travel: '', type: 'day',
      notes: 'Old Quarter, Hoan Kiem Lake. Cooking class?',
      hotel: 'Hanoi hotel TBD',
      hotel_address: null,
      refs: []
    },
    {
      date: '2026-03-20', title: 'Hanoi',
      from: 'Hanoi', to: 'Hanoi',
      travel: '', type: 'day',
      notes: 'Thang Long Water Puppet Theatre — book ahead! Train Street egg coffee.',
      hotel: 'Hanoi hotel TBD',
      hotel_address: null,
      refs: []
    },
    {
      date: '2026-03-21', title: 'Fly Home — 12:20 PM',
      from: 'Hanoi', to: 'Homeward',
      travel: '16.5 hours, 1 stop', type: 'flight',
      notes: '',
      hotel: null, hotel_address: null,
      refs: []
    }
  ],

  cities: {
    'Ho Chi Minh': {
      image: 'resources/images/ho-chi-minh.jpg',
      overview: "Vietnam's largest city and economic engine, Ho Chi Minh City (still widely called Saigon) mixes French boulevards, Chinese pagodas, glass towers, and a nonstop motorbike buzz. Once a Khmer fishing village, it became a major French colonial port and the capital of South Vietnam until reunification in 1975, so recent history is very present in the streets.\n\nPeople come for energy as much as for sights: slurp noodles at **Ben Thanh Market**, wander past the red-brick **Notre Dame Cathedral** and **Central Post Office**, and dive into the sobering exhibits of the **War Remnants Museum**. Evenings spill onto sidewalks and rooftop bars; food runs from tiny plastic-stool stalls to polished new-school Vietnamese, and neighborhoods like **Chinatown (Cho Lon)** add Chinese temples and markets to the mix.",
      stay: {
        name: 'Liberty Central Saigon Riverside Hotel',
        address: '17 Ton Duc Thang, District 1, Ho Chi Minh City',
        booking: 'Agoda #966228062'
      },
      do: [
        'Walk District 1 — War Remnants Museum, Reunification Palace, Notre Dame Cathedral, Saigon Central Post Office, Ben Thanh Market, Café Apartments',
        'Book Street (Nguyen Van Binh)',
        'Chinatown (District 5) — Thien Hau Temple, Binh Tay Market, herbal medicine street',
        'Mekong Delta eco day trip — sampan rowing through canals & orchard bike ride',
        'Cu Chi Tunnels (half day)',
        'Ho Chi Minh City Museum of Fine Arts',
        'Tan Dinh Pink Church',
        'District 7 — Crescent Lake & Park, Korean influences'
      ],
      eat: [
        'Hum | District 1 — high end, refined',
        'Pi | District 1',
        'Shamballa | District 1',
        'Prem Bistro & Café | District 3',
        'Chay Bia | Craft Beer + Vegetarian Food',
        'Nang Tam | brunch, traditional Vietnamese vegetarian'
      ],
      drink: [
        'Hotel des Arts rooftop',
        'Chill Skybar',
        'Pasteur Street Brewery',
        'Chay Bia'
      ]
    },
    'Hoi An': {
      image: 'resources/images/hoi_an.jpg',
      overview: "Hoi An is a low-rise riverside town where yellow shop-houses, wooden merchants' homes, and assembly halls recall its past life as a major trading port between the 15th and 19th centuries. Merchants from China, Japan, and Europe left a blend of influences you still see in the **Japanese Covered Bridge**, Chinese temples, and French balconies.\n\nThe Old Town is a UNESCO World Heritage Site, famous for its lantern-lit evenings, bikes weaving past old facades, and tailors who can turn around custom clothes in a day. Typical days: coffee by the **Thu Bon River**, exploring historic houses and temples, a bike ride through rice paddies to the countryside or beach, then sunset cocktails and street food under hanging lanterns.",
      stay: {
        name: 'Zen Boutique Eco',
        address: '87 Ly Thuong Kiet, Cam Chau, Hoi An',
        booking: 'Booking.com #5331628842 · PIN 6633 · +84 90 673 71 45'
      },
      do: [
        'Scooter ride — countryside loop: rice paddies, water buffalo, tiny lanes',
        'Countryside bicycle ride at sunrise or late afternoon — Tra Que Village',
        'Vegetarian cooking class with boat ride and market visit',
        'An Bang Beach at sunset',
        'Buy linen clothes',
        'Hidden alley coffee shops',
        'Old Town at night — Lantern Walk: Japanese Bridge to riverfront',
        'History of Hoi An evening show'
      ],
      eat: [
        'Chay Dam | Farm to table, garden setting in Tra Que Vegetable Village',
        'Annen Vegetarian & Yoga | Zen aesthetic, yoga classes + café',
        'Nourish Eatery | International + Vietnamese fusion, brunch/lunch',
        'CHAY – Hoi An Vegan | Most fine dining in town, beautifully plated'
      ],
      drink: []
    },
    'Hue': {
      image: 'resources/images/hue.jpg',
      overview: "Hue is Vietnam's old royal capital, straddling the Perfume River with misty hills behind it. From 1802 to 1945 it was the seat of the Nguyễn emperors, and its walled **Imperial City**—with palaces, temples, and the former **Forbidden Purple City**—is now a UNESCO World Heritage complex.\n\nTravelers pair citadel wandering with boat trips to riverside pagodas and elaborate royal tombs scattered in the countryside. Hue also has a reputation for refined, slightly more delicate cuisine, so things like imperial-style small dishes and local noodle specialties are worth seeking out after a day of palaces and pagodas.",
      stay: {
        name: 'Pisces Hotel Hue',
        address: '6/4 kiet 7 Nguyễn Công Trứ, Phú Hội, Hue',
        booking: 'Booking #6038803088 · WhatsApp +84 7623 55 999'
      },
      do: [
        'Arrive via scooter ~4–5 PM over Hai Van Pass',
        'Explore the Imperial Citadel and royal tombs',
        'Dong Ba Market',
        'Thien Mu Pagoda on the Perfume River'
      ],
      eat: [
        'Bún bò Huế — the city\'s signature spicy beef noodle soup',
        'Bánh mì at local street stalls',
        'Com Hen — minced clam rice, a Hue specialty'
      ],
      drink: []
    },
    'Phong Nha': {
      image: 'resources/images/phong-nha.jpg',
      overview: "Phong Nha is a small town at the edge of Phong Nha–Kẻ Bàng National Park, a jungle-covered karst region riddled with caves and underground rivers. The park holds hundreds of caves, including **Phong Nha Cave** itself and record-breakers like **Son Doong**, one of the largest cave systems in the world.\n\nThis is an adventure base: boat rides into vast river caves, boardwalks through glittering **Paradise Cave**, ziplining and swimming at **Dark Cave**, and cycling along quiet country roads past buffalo and villages. War history is also nearby, with sites like the **Ho Chi Minh Trail** and DMZ area reachable on tours from the region.",
      stay: {
        name: 'Phong Nha Coco Riverside',
        address: 'Phong Nha, Quảng Bình Province',
        booking: 'WhatsApp +84 365023363 / +84 886686982 · phongnhacocoriverside@gmail.com'
      },
      do: [
        'Paradise Cave — vast cathedral chambers, 31 km long',
        'Dark Cave — zip line, kayak, mud bath',
        'Phong Nha Cave by boat — the original, underground river',
        'Phong Nha-Kẻ Bàng National Park hiking',
        'Best for: caves, silence, nature photographers'
      ],
      eat: [
        'The Pub with Cold Beer — a whole experience. Swim + float in the river. Allow 4 hours.',
        'Pit stop at local roadside pho after a cave day'
      ],
      drink: []
    },
    'Ninh Binh': {
      image: 'resources/images/ninh-binh.jpg',
      overview: "Often nicknamed \"Halong Bay on land,\" Ninh Binh is all about dramatic limestone karsts rising straight out of rice paddies and slow green rivers. The core UNESCO-listed Trang An Landscape Complex weaves together caves, waterways, and temples, with boat trips that slip under low cave ceilings and between cliffs.\n\nVisitors typically base in **Tam Coc** or **Trang An**, climb **Mua Cave** steps for a sweeping viewpoint over river and paddies, and visit **Hoa Lu**, an ancient Vietnamese capital from the 10th century. The vibe is slower and rural: think rowing boats, bikes along dikes, and quiet evenings watching the limestone peaks fade into dusk.",
      stay: {
        name: 'Tam Cốc Garden-style Ecolodge',
        address: 'Ninh Binh (Tam Cốc / Trang An area)',
        booking: 'TBD'
      },
      do: [
        'Row to Trang An — UNESCO-protected, dramatic caves | 7–9 AM is ideal. Buy ticket at Trang An wharf. ~3 hours. Route 3 (Dot Cave + steps) is the best, Route 2 is balanced.',
        'Sunset at Mua Cave viewpoint — 500 steps, panoramic views over the valley',
        'Bike ride through rice paddies and village lanes',
        'Hoa Lu Ancient Capital — Vietnam\'s 10th-century former capital'
      ],
      eat: [
        'Goat and mountain snail — local specialties in Ninh Binh',
        'Com chay — crispy scorched rice cake, a regional dish'
      ],
      drink: []
    },
    'Hanoi': {
      image: 'resources/images/hanoi.jpg',
      overview: "Hanoi, Vietnam's capital, layers a thousand years of history with lakes, tree-lined streets, and dense markets. Once called Thang Long (\"Rising Dragon\"), it's been the political and cultural center of Vietnam for most of the last millennium, with brief interludes when power shifted to Hue.\n\nIn the **Old Quarter**, narrow streets are still loosely organized by traditional trades, with scooters, tiny stools, and street food everywhere. Classic stops include **Hoan Kiem Lake**, the 11th-century **Temple of Literature** (Vietnam's first university), the **Imperial Citadel of Thang Long**, **Hoa Lo Prison**, and the **Vietnam Museum of Ethnology**, which showcases the country's 54 ethnic groups. Evenings are for bia hơi (fresh beer) corners, bun cha and pho, and, if you like, rooftop views over the lake or the tangle of the Old Quarter.",
      stay: {
        name: 'Hotel TBD',
        address: 'Old Quarter area recommended',
        booking: 'TBD'
      },
      do: [
        'Old Quarter — Sword Lake, Bach Ma Temple, Memorial House, food tour',
        'Hoan Kiem Lake — walk the causeway to Ngoc Son Temple',
        'Thang Long Water Puppet Theatre — BOOK AHEAD',
        'Hanoi Train Street — egg coffee while the train rolls through',
        'Ho Chi Minh Memorial Complex — mausoleum, house on stilts, One Pillar Pagoda, Temple of Literature',
        'West Lake — Tran Quoc Pagoda, Quan Thanh Temple',
        'Long Bien Bridge',
        'St. Joseph\'s Cathedral',
        'Imperial Citadel',
        'Women\'s Museum',
        'Buy baskets, silk, and lacquerware at markets',
        'Sit at a bia hơi corner with a cold beer (Ta Hien & Luong Ngoc Quyen)'
      ],
      eat: [
        'Egg coffee at Giang Cafe — supposed to be the best',
        'Bia hơi corner | Ta Hien & Luong Ngoc Quyen intersection — street food vendors',
        'Banh Mi 25 | near Dong Xuan Market'
      ],
      drink: []
    }
  },

  money: [
    { category: 'Trains',      amount: 313.50 },
    { category: 'Bus',         amount:  15.53 },
    { category: 'Hotels',      amount: 156.36 },
    { category: 'John Flight', amount: 798.53 },
    { category: 'Scooter',     amount:  58.00 }
  ]
};

// ── Flight Data (from e-Ticket.pdf) ─────────
const FLIGHTS = [
  {
    leg: 'Outbound · Leg 1 of 2',
    flight: 'KE 018',
    aircraft: 'Airbus A380-800',
    from: { code: 'LAX', city: 'Los Angeles', terminal: 'B — Tom Bradley Int\'l' },
    to:   { code: 'ICN', city: 'Seoul (Incheon)', terminal: '2' },
    departs: 'Fri Mar 6 · 10:50 AM',
    arrives: 'Sat Mar 7 · 5:35 PM',
    duration: '13h 45m',
    seat: '37K',
    baggage: '1 checked free (up to 23 kg) · carry-on up to 10 kg',
    date: '2026-03-06'
  },
  {
    leg: 'Outbound · Leg 2 of 2',
    flight: 'KE 475',
    aircraft: 'Boeing 777-300ER',
    from: { code: 'ICN', city: 'Seoul (Incheon)', terminal: '2' },
    to:   { code: 'SGN', city: 'Ho Chi Minh City', terminal: '2 — Tan Son Nhat' },
    departs: 'Sat Mar 7 · 6:50 PM',
    arrives: 'Sat Mar 7 · 10:25 PM',
    duration: '5h 35m',
    seat: '34J',
    baggage: '1 checked free (up to 23 kg) · carry-on up to 10 kg',
    date: '2026-03-06'
  },
  {
    leg: 'Return · Leg 1 of 2',
    flight: 'KE 442',
    aircraft: 'Airbus A321neo',
    from: { code: 'HAN', city: 'Hanoi (Noi Bai)', terminal: '2' },
    to:   { code: 'ICN', city: 'Seoul (Incheon)', terminal: '2' },
    departs: 'Sat Mar 21 · 12:20 PM',
    arrives: 'Sat Mar 21 · 6:25 PM',
    duration: '4h 05m',
    seat: '42F',
    baggage: '1 checked free (up to 23 kg) · carry-on up to 10 kg',
    date: '2026-03-21'
  },
  {
    leg: 'Return · Leg 2 of 2',
    flight: 'KE 011',
    aircraft: 'Boeing 747-8I',
    from: { code: 'ICN', city: 'Seoul (Incheon)', terminal: '2' },
    to:   { code: 'LAX', city: 'Los Angeles', terminal: 'B — Tom Bradley Int\'l' },
    departs: 'Sat Mar 21 · 7:40 PM',
    arrives: 'Sat Mar 21 · 2:40 PM',
    duration: '11h 00m',
    seat: '41K',
    baggage: '1 checked free (up to 23 kg) · carry-on up to 10 kg',
    date: '2026-03-21'
  }
];

// ── Date Utils ───────────────────────────────
const TRIP_START = new Date('2026-03-06T00:00:00');
const TRIP_END   = new Date('2026-03-21T23:59:59');
const TOTAL_DAYS = 16;

function today0() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayOf(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setHours(0, 0, 0, 0);
  return d;
}

function getTripPhase() {
  const now = today0();
  const start = new Date(TRIP_START); start.setHours(0,0,0,0);
  const end   = new Date(TRIP_END);   end.setHours(23,59,59,999);

  if (now < start) {
    return { phase: 'before', daysUntil: Math.ceil((start - now) / 86400000) };
  }
  if (now > end) {
    return { phase: 'after' };
  }
  const dayNum = Math.floor((now - start) / 86400000) + 1;
  return { phase: 'during', dayNum, entry: TRIP.itinerary[dayNum - 1] };
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function fmtLong(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function fmtShort(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return { mon: MONTHS[d.getMonth()].toUpperCase(), day: d.getDate() };
}

const BADGE_LABELS = { flight: 'Flight', train: 'Train', bus: 'Bus', scooter: 'Scooter', day: '' };

// ── City navigation helpers ───────────────────
const CITY_KEYS = ['Ho Chi Minh', 'Hoi An', 'Hue', 'Phong Nha', 'Ninh Binh', 'Hanoi'];

// Map itinerary "to"/"from" values → Places city index
const CITY_MAP = {
  'Ho Chi Minh City': 0,
  'Hoi An':           1,
  'Hue':              2,
  'Phong Nha':        3,
  'Ninh Binh':        4,
  'Hanoi':            5
};

function cityIdxForEntry(e) {
  if (CITY_MAP[e.to]   !== undefined) return CITY_MAP[e.to];
  if (CITY_MAP[e.from] !== undefined) return CITY_MAP[e.from];
  return -1;
}

function navigateToCity(cityIdx) {
  navigate('places');
  requestAnimationFrame(() => {
    const btn = document.querySelector(`.city-tab-btn[data-city="${cityIdx}"]`);
    if (btn) btn.click();
  });
}

// Renders overview text: HTML-safe, then applies **bold** markers
function markupOverview(str) {
  return escape(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// ── Live countdown to departure ───────────────
// 10:50 AM PST (UTC-8) on Fri Mar 6 2026 = 18:50:00 UTC
const DEPARTURE_UTC = new Date('2026-03-06T18:50:00Z');
let _cdInterval = null;

function startCountdown() {
  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = DEPARTURE_UTC - Date.now();
    const ids = ['cd-days', 'cd-hrs', 'cd-min', 'cd-sec'];

    if (diff <= 0) {
      clearInterval(_cdInterval);
      ids.forEach(id => { const e = document.getElementById(id); if (e) e.textContent = '00'; });
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    const min  = Math.floor((diff % 3600000)  / 60000);
    const sec  = Math.floor((diff % 60000)    / 1000);

    [days, hrs, min, sec].forEach((val, i) => {
      const e = document.getElementById(ids[i]);
      if (e) e.textContent = pad(val);
    });
  }

  clearInterval(_cdInterval);
  tick();
  _cdInterval = setInterval(tick, 1000);
}

function escape(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ── DB helpers ────────────────────────────────────────────────
function citySlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function hardcodedKey(cityName, section, index) {
  return `${citySlug(cityName)}-${section}-${index}`;
}

async function initDB() {
  if (typeof supabase === 'undefined') return;
  _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  await fetchAllData();
  subscribeRealtime();
  checkFirstVisit();
}

async function fetchAllData() {
  if (!_sb) return;
  const [placesRes, starsRes, metaRes, plansRes] = await Promise.all([
    _sb.from('user_places').select('*').order('created_at'),
    _sb.from('stars').select('*'),
    _sb.from('item_meta').select('*'),
    _sb.from('day_plans').select('*').order('created_at')
  ]);
  if (placesRes.data) _userPlaces = placesRes.data;
  if (starsRes.data)  _stars      = starsRes.data;
  if (metaRes.data)   _itemMeta   = Object.fromEntries(metaRes.data.map(r => [r.item_key, r]));
  if (plansRes.data)  _dayPlans   = plansRes.data;
  refreshAllUserPlaceSections();
  refreshAllStars();
  refreshAllMapIndicators();
  refreshAllPlanButtons();
  refreshJourneyPlans();
  updateEditUI();
  updateUserChip();
}

function subscribeRealtime() {
  _sb.channel('vn_places')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_places' }, (payload) => {
      if (payload.eventType === 'INSERT') {
        if (!_userPlaces.find(p => p.id === payload.new.id)) _userPlaces.push(payload.new);
      } else if (payload.eventType === 'UPDATE') {
        const i = _userPlaces.findIndex(p => p.id === payload.new.id);
        if (i > -1) _userPlaces[i] = payload.new;
      } else if (payload.eventType === 'DELETE') {
        _userPlaces = _userPlaces.filter(p => p.id !== payload.old.id);
      }
      refreshAllUserPlaceSections();
    })
    .subscribe();

  _sb.channel('vn_stars')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stars' }, (payload) => {
      if (payload.eventType === 'INSERT') {
        if (!_stars.find(s => s.item_key === payload.new.item_key && s.user_name === payload.new.user_name)) {
          _stars.push(payload.new);
        }
      } else if (payload.eventType === 'DELETE') {
        _stars = _stars.filter(s => !(s.item_key === payload.old.item_key && s.user_name === payload.old.user_name));
      }
      refreshAllStars();
    })
    .subscribe();

  _sb.channel('vn_meta')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'item_meta' }, (payload) => {
      if (payload.new) _itemMeta[payload.new.item_key] = payload.new;
      refreshAllMapIndicators();
    })
    .subscribe();

  _sb.channel('vn_plans')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'day_plans' }, (payload) => {
      if (payload.eventType === 'INSERT') {
        if (!_dayPlans.find(p => p.id === payload.new.id)) {
          _dayPlans.push(payload.new);
          refreshAllPlanButtons();
          refreshJourneyPlans();
        }
      } else if (payload.eventType === 'UPDATE') {
        const i = _dayPlans.findIndex(p => p.id === payload.new.id);
        if (i > -1) { _dayPlans[i] = payload.new; refreshJourneyPlans(); }
      } else if (payload.eventType === 'DELETE') {
        const before = _dayPlans.length;
        _dayPlans = _dayPlans.filter(p => p.id !== payload.old.id);
        if (_dayPlans.length !== before) { refreshAllPlanButtons(); refreshJourneyPlans(); }
      }
    })
    .subscribe();
}

async function addUserPlace(city, name, section, notes, mapsUrl) {
  if (!_sb) return;
  const { error } = await _sb.from('user_places')
    .insert({ city, name, category: section, notes, maps_url: mapsUrl, added_by: _currentUser });
  if (error) console.error('Add failed:', error);
}

async function deleteUserPlace(id) {
  if (!_sb) return;
  const { error } = await _sb.from('user_places').delete().eq('id', id);
  if (error) console.error('Delete failed:', error);
}

async function addDayPlan(date, itemKey, itemName, city, section) {
  if (!_sb || !_currentUser) return;
  const { data, error } = await _sb.from('day_plans')
    .insert({ date, item_key: itemKey, item_name: itemName, city, section, added_by: _currentUser, done: false })
    .select().single();
  if (!error && data) {
    if (!_dayPlans.find(p => p.id === data.id)) _dayPlans.push(data);
    refreshAllPlanButtons();
    refreshJourneyPlans();
  } else if (error) {
    console.error('Plan add failed:', error);
  }
}

async function removeDayPlan(id) {
  if (!_sb) return;
  const { error } = await _sb.from('day_plans').delete().eq('id', id);
  if (!error) {
    _dayPlans = _dayPlans.filter(p => p.id !== id);
    refreshAllPlanButtons();
    refreshJourneyPlans();
  } else {
    console.error('Plan delete failed:', error);
  }
}

async function toggleDayPlanDone(id, done) {
  if (!_sb) return;
  const { error } = await _sb.from('day_plans').update({ done }).eq('id', id);
  if (!error) {
    const plan = _dayPlans.find(p => p.id === id);
    if (plan) plan.done = done;
    refreshJourneyPlans();
  }
}

async function toggleStar(itemKey) {
  if (!_sb || !_currentUser) return;
  const exists = _stars.find(s => s.item_key === itemKey && s.user_name === _currentUser);
  if (exists) {
    const { error } = await _sb.from('stars').delete()
      .eq('item_key', itemKey).eq('user_name', _currentUser);
    if (!error) _stars = _stars.filter(s => !(s.item_key === itemKey && s.user_name === _currentUser));
  } else {
    const { error } = await _sb.from('stars').insert({ item_key: itemKey, user_name: _currentUser });
    if (!error) _stars.push({ item_key: itemKey, user_name: _currentUser });
  }
  refreshAllStars();
}

async function setMapsUrl(itemKey, url, isUserPlace) {
  if (!_sb) return;
  if (isUserPlace) {
    const { error } = await _sb.from('user_places').update({ maps_url: url }).eq('id', itemKey);
    if (!error) {
      const place = _userPlaces.find(p => p.id === itemKey);
      if (place) place.maps_url = url;
      refreshAllUserPlaceSections();
    }
  } else {
    const { error } = await _sb.from('item_meta')
      .upsert({ item_key: itemKey, maps_url: url, updated_at: new Date().toISOString() },
               { onConflict: 'item_key' });
    if (!error) _itemMeta[itemKey] = { item_key: itemKey, maps_url: url };
  }
  refreshAllMapIndicators();
}

function refreshAllStars() {
  document.querySelectorAll('.star-btn[data-item-key]').forEach(btn => {
    const key    = btn.dataset.itemKey;
    const user   = btn.dataset.user;
    const active = _stars.some(s => s.item_key === key && s.user_name === user);
    btn.classList.toggle('starred', active);
  });
}

function refreshAllMapIndicators() {
  document.querySelectorAll('.pi-map[data-item-key]').forEach(btn => {
    const key    = btn.dataset.itemKey;
    const isUser = btn.dataset.isUser === '1';
    const meta   = _itemMeta[key];
    const place  = isUser ? _userPlaces.find(p => p.id === key) : null;
    const url    = (meta && meta.maps_url) || (place && place.maps_url) || '';
    btn.classList.toggle('has-link', !!url);
    btn.dataset.mapsUrl = url;
  });
}

function refreshAllUserPlaceSections() {
  CITY_KEYS.forEach(name => {
    const slug = citySlug(name);
    ['do', 'eat'].forEach(section => {
      const el = document.getElementById(`up-${slug}-${section}`);
      if (el) renderUserPlacesInto(el, name, section);
    });
  });
  refreshAllStars();
  refreshAllMapIndicators();
}

function renderUserPlacesInto(container, cityName, section) {
  const places = _userPlaces.filter(p => p.city === cityName && p.category === section);
  container.innerHTML = places.map(p =>
    renderPlaceItemHTML(p.name, p.id, p.maps_url || '', true, p.notes || '', cityName, section)
  ).join('');
}

function refreshAllPlanButtons() {
  document.querySelectorAll('.pi-cal[data-item-key]').forEach(btn => {
    btn.classList.toggle('is-planned', _dayPlans.some(p => p.item_key === btn.dataset.itemKey));
  });
}

function refreshJourneyPlans() {
  TRIP.itinerary.forEach(e => {
    const container = document.getElementById(`j-plan-${e.date}`);
    if (!container) return;
    const plans = _dayPlans.filter(p => p.date === e.date);
    if (!plans.length) { container.innerHTML = ''; return; }
    container.innerHTML = plans.map(p => `
      <div class="j-plan-item${p.done ? ' done' : ''}" data-plan-id="${escape(p.id)}">
        <button class="j-plan-check" data-plan-id="${escape(p.id)}" aria-label="${p.done ? 'Mark undone' : 'Mark done'}">&#10003;</button>
        <span class="j-plan-name">${escape(p.item_name)}</span>
        <button class="j-plan-remove" data-plan-id="${escape(p.id)}" aria-label="Remove from plan">&#215;</button>
      </div>
    `).join('');
  });
}

// ── Edit mode ─────────────────────────────────────────────────
function toggleEditMode() {
  _editMode = !_editMode;
  updateEditUI();
}

function updateEditUI() {
  const btn    = document.getElementById('edit-toggle-btn');
  const screen = document.getElementById('screen-places');
  if (!btn || !screen) return;
  btn.classList.toggle('unlocked', _editMode);
  screen.classList.toggle('edit-mode', _editMode);
}

function updateUserChip() {
  const chip = document.getElementById('user-chip');
  if (!chip) return;
  if (_currentUser === 'john') {
    chip.textContent = 'J';
    chip.className = 'user-chip user-chip--john';
  } else if (_currentUser === 'stef') {
    chip.textContent = 'S';
    chip.className = 'user-chip user-chip--stef';
  } else {
    chip.textContent = '?';
    chip.className = 'user-chip user-chip--unknown';
  }
}

// ── First visit / name picker ─────────────────────────────────
function checkFirstVisit() {
  if (!_currentUser) showNamePickerSheet(true);
  else updateUserChip();
}

function showNamePickerSheet(isFirstTime) {
  showSheet(`
    <div class="sheet-title">${isFirstTime ? 'Who are you?' : 'Switch user'}</div>
    ${isFirstTime ? '<div class="sheet-hint">You only need to pick once &mdash; we\'ll remember you.</div>' : ''}
    <div class="sheet-field">
      <div class="pill-row">
        <button class="name-pill${_currentUser === 'john' ? ' active' : ''}" data-name="john">John</button>
        <button class="name-pill${_currentUser === 'stef' ? ' active' : ''}" data-name="stef">Stef</button>
      </div>
    </div>
  `);
  document.querySelectorAll('.name-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      _currentUser = pill.dataset.name;
      localStorage.setItem('vn_user', _currentUser);
      hideSheet();
      updateUserChip();
      refreshAllStars();
    });
  });
}

// ── Sheet ──────────────────────────────────────────────────────
function showSheet(html) {
  const overlay = document.getElementById('sheet-overlay');
  document.getElementById('sheet-content').innerHTML = html;
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));
}

function hideSheet() {
  const overlay = document.getElementById('sheet-overlay');
  overlay.classList.remove('visible');
  setTimeout(() => overlay.classList.add('hidden'), 320);
}

function showAddPlaceSheet(cityName, section) {
  const sectionLabel = section === 'do' ? 'Things to Do' : 'Eat & Drink';
  showSheet(`
    <div class="sheet-title">Add to ${escape(cityName)}</div>
    <div class="sheet-hint">${sectionLabel}</div>
    <div class="sheet-field">
      <label class="sheet-label">Name <span class="sheet-required">*</span></label>
      <input id="place-name" type="text" class="sheet-input" placeholder="e.g. Bánh Mì 25" autocapitalize="words">
    </div>
    <div class="sheet-field">
      <label class="sheet-label">Notes <span class="sheet-optional">(optional)</span></label>
      <textarea id="place-notes" class="sheet-textarea" placeholder="Address, tips, why you want to go…" rows="2"></textarea>
    </div>
    <div class="sheet-field">
      <label class="sheet-label">Maps link <span class="sheet-optional">(optional)</span></label>
      <input id="place-maps" type="url" class="sheet-input" placeholder="https://maps.app.goo.gl/…">
    </div>
    <div id="sheet-error" class="sheet-error hidden">Enter a name first</div>
    <button id="add-place-btn" class="sheet-submit">Add</button>
  `);

  document.getElementById('add-place-btn').addEventListener('click', async () => {
    const name = document.getElementById('place-name').value.trim();
    if (!name) {
      document.getElementById('sheet-error').classList.remove('hidden');
      document.getElementById('place-name').focus();
      return;
    }
    const notes   = document.getElementById('place-notes').value.trim();
    const mapsUrl = document.getElementById('place-maps').value.trim();
    hideSheet();
    await addUserPlace(cityName, name, section, notes, mapsUrl);
  });

  setTimeout(() => document.getElementById('place-name')?.focus(), 350);
}

function showDayPickerSheet(itemKey, itemName, city, section) {
  const days = TRIP.itinerary.map(e => {
    const isPlanned = _dayPlans.some(p => p.item_key === itemKey && p.date === e.date);
    const dt = fmtShort(e.date);
    const d  = new Date(e.date + 'T12:00:00');
    const wd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
    return { e, isPlanned, label: `${wd} ${dt.mon} ${dt.day}` };
  });

  showSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-title">Plan this</div>
    <div class="sheet-hint">${escape(itemName)}</div>
    <div class="day-pick-list">
      ${days.map(({ e, isPlanned, label }) => `
        <button class="day-pick-row${isPlanned ? ' is-planned' : ''}" data-date="${escape(e.date)}">
          <span class="day-pick-date">${label}</span>
          <span class="day-pick-city">${escape(e.title.split('\n')[0])}</span>
          <span class="day-pick-check">&#10003;</span>
        </button>
      `).join('')}
    </div>
  `);

  document.querySelectorAll('.day-pick-row').forEach(row => {
    row.addEventListener('click', async () => {
      const date = row.dataset.date;
      const isPlanned = row.classList.contains('is-planned');
      if (isPlanned) {
        const plan = _dayPlans.find(p => p.item_key === itemKey && p.date === date);
        if (plan) {
          row.classList.remove('is-planned');
          await removeDayPlan(plan.id);
        }
      } else {
        row.classList.add('is-planned');
        await addDayPlan(date, itemKey, itemName, city, section);
      }
    });
  });
}

function showMapsSheet(itemKey, currentUrl, isUserPlace) {
  showSheet(`
    <div class="sheet-title">Maps link</div>
    <div class="sheet-field">
      <label class="sheet-label">Google Maps URL</label>
      <input id="maps-url-input" type="url" class="sheet-input" value="${escape(currentUrl)}" placeholder="https://maps.app.goo.gl/…">
    </div>
    <button id="save-maps-btn" class="sheet-submit">Save</button>
  `);
  document.getElementById('save-maps-btn').addEventListener('click', async () => {
    const url = document.getElementById('maps-url-input').value.trim();
    hideSheet();
    await setMapsUrl(itemKey, url, isUserPlace);
  });
  setTimeout(() => document.getElementById('maps-url-input')?.focus(), 350);
}

// ── Place item HTML helper ─────────────────────────────────────
const MAP_SVG  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-8-6.5-8-12a8 8 0 0 1 16 0c0 5.5-8 12-8 12z"/><circle cx="12" cy="9" r="2.5"/></svg>`;
const PLAN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><line x1="8" y1="15" x2="16" y2="15"/></svg>`;

function renderPlaceItemHTML(name, itemKey, mapsUrl, isUserAdded, notes, city, section) {
  const notesPart = notes ? `<em class="pi-notes">&nbsp;&mdash;&nbsp;${escape(notes)}</em>` : '';
  const delBtn    = isUserAdded
    ? `<button class="pi-del" data-id="${escape(itemKey)}" aria-label="Delete">&#215;</button>`
    : '';
  const isPlanned = _dayPlans.some(p => p.item_key === itemKey);
  return `<div class="places-item" data-item-key="${escape(itemKey)}">
    <span class="pi-text"><span>${escape(name)}</span>${notesPart}</span>
    <span class="pi-actions">
      <button class="star-btn star-btn--john" data-item-key="${escape(itemKey)}" data-user="john" aria-label="John starred">★<span>J</span></button>
      <button class="star-btn star-btn--stef" data-item-key="${escape(itemKey)}" data-user="stef" aria-label="Stef starred">★<span>S</span></button>
      <button class="pi-cal${isPlanned ? ' is-planned' : ''}" data-item-key="${escape(itemKey)}" data-city="${escape(city || '')}" data-section="${escape(section || '')}" aria-label="Plan this">${PLAN_SVG}</button>
      <button class="pi-map${mapsUrl ? ' has-link' : ''}" data-item-key="${escape(itemKey)}" data-maps-url="${escape(mapsUrl)}" data-is-user="${isUserAdded ? '1' : '0'}" aria-label="Maps">${MAP_SVG}</button>
      ${delBtn}
    </span>
  </div>`;
}

// ── Event delegation for Places screen ────────────────────────
function handlePlacesClick(e) {
  // Star toggle
  const starBtn = e.target.closest('.star-btn');
  if (starBtn) {
    if (starBtn.dataset.user !== _currentUser) return; // other person's star is read-only
    toggleStar(starBtn.dataset.itemKey);
    return;
  }

  // Calendar / plan button
  const calBtn = e.target.closest('.pi-cal');
  if (calBtn) {
    const row      = calBtn.closest('.places-item');
    const itemName = row?.querySelector('.pi-text > span')?.textContent?.trim() || '';
    showDayPickerSheet(calBtn.dataset.itemKey, itemName, calBtn.dataset.city, calBtn.dataset.section);
    return;
  }

  // Map pin button
  const mapBtn = e.target.closest('.pi-map');
  if (mapBtn) {
    if (_editMode) {
      showMapsSheet(mapBtn.dataset.itemKey, mapBtn.dataset.mapsUrl || '', mapBtn.dataset.isUser === '1');
    } else {
      const url = mapBtn.dataset.mapsUrl;
      if (url) window.open(url, '_blank');
    }
    return;
  }

  // Delete user-added item
  const delBtn = e.target.closest('.pi-del');
  if (delBtn) {
    const row  = delBtn.closest('.places-item');
    const name = row?.querySelector('.pi-text span')?.textContent?.trim() || 'this place';
    if (!confirm(`Remove "${name}"?`)) return;
    deleteUserPlace(delBtn.dataset.id);
    return;
  }

  // Add spot button
  const addBtn = e.target.closest('.add-spot-btn');
  if (addBtn) {
    showAddPlaceSheet(addBtn.dataset.city, addBtn.dataset.section);
    return;
  }

  // Edit toggle (lock icon)
  const editBtn = e.target.closest('#edit-toggle-btn');
  if (editBtn) {
    toggleEditMode();
    return;
  }

  // User chip → switch user
  const chip = e.target.closest('#user-chip');
  if (chip) {
    showNamePickerSheet(false);
    return;
  }
}

// ── Event delegation for Journey screen ───────────────────────
function handleJourneyClick(e) {
  // Plan: check/done toggle
  const checkBtn = e.target.closest('.j-plan-check');
  if (checkBtn) {
    const plan = _dayPlans.find(p => p.id === checkBtn.dataset.planId);
    if (plan) toggleDayPlanDone(plan.id, !plan.done);
    return;
  }

  // Plan: remove
  const removeBtn = e.target.closest('.j-plan-remove');
  if (removeBtn) {
    removeDayPlan(removeBtn.dataset.planId);
    return;
  }

  // Journey navigation — only if click didn't hit a plan element
  const row = e.target.closest('.journey-entry');
  if (!row) return;
  const cityIdx = row.dataset.cityIdx;
  if (cityIdx !== undefined && cityIdx !== '') { navigateToCity(parseInt(cityIdx, 10)); return; }
  if (row.dataset.navRefs !== undefined) { navigate('refs'); return; }
}

// ── Flight ticket stub (reused in Today + Refs) ──
function renderFlightTicket(f) {
  return `<div class="flight-ticket">
    <div class="ft-header">
      <span class="ft-flight">${f.flight}</span>
      <span class="ft-leg">${escape(f.leg)}</span>
    </div>
    <div class="ft-route">
      <div class="ft-stop">
        <div class="ft-code">${f.from.code}</div>
        <div class="ft-city">${escape(f.from.city)}</div>
        <div class="ft-time">${escape(f.departs)}</div>
        <div class="ft-terminal">Terminal ${escape(f.from.terminal)}</div>
      </div>
      <div class="ft-arrow">&#8594;</div>
      <div class="ft-stop ft-stop--right">
        <div class="ft-code">${f.to.code}</div>
        <div class="ft-city">${escape(f.to.city)}</div>
        <div class="ft-time">${escape(f.arrives)}</div>
        <div class="ft-terminal">Terminal ${escape(f.to.terminal)}</div>
      </div>
    </div>
    <div class="ft-details">
      <div class="ft-detail"><div class="ft-detail-label">Seat</div>${f.seat}</div>
      <div class="ft-detail"><div class="ft-detail-label">Duration</div>${f.duration}</div>
      <div class="ft-detail"><div class="ft-detail-label">Aircraft</div>${escape(f.aircraft)}</div>
      <div class="ft-detail ft-detail--wide"><div class="ft-detail-label">Baggage</div>${escape(f.baggage)}</div>
    </div>
  </div>`;
}

// ── Render: TODAY ────────────────────────────
function renderToday() {
  const p = getTripPhase();
  const el = document.getElementById('screen-today');
  const nowStr = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' });

  let h = `<div class="page-header">
    <span class="page-header__title">Vietnam</span>
    <span class="page-header__sub">Field Journal &middot; ${nowStr}</span>
  </div>`;

  if (p.phase === 'before') {
    const dep = TRIP.itinerary[0];
    h += `<div class="countdown-wrap">
      <div class="countdown-ticket">
        <div class="countdown-grid">
          <div class="countdown-unit">
            <div class="countdown-val" id="cd-days">--</div>
            <div class="countdown-unit-label">Days</div>
          </div>
          <div class="countdown-sep">:</div>
          <div class="countdown-unit">
            <div class="countdown-val" id="cd-hrs">--</div>
            <div class="countdown-unit-label">Hrs</div>
          </div>
          <div class="countdown-sep">:</div>
          <div class="countdown-unit">
            <div class="countdown-val" id="cd-min">--</div>
            <div class="countdown-unit-label">Min</div>
          </div>
          <div class="countdown-sep">:</div>
          <div class="countdown-unit">
            <div class="countdown-val" id="cd-sec">--</div>
            <div class="countdown-unit-label">Sec</div>
          </div>
        </div>
        <div class="countdown-until">Until departure &mdash; LAX &middot; Fri Mar 6 &middot; 10:50 AM PST</div>
      </div>
    </div>

    <div class="today-block">
      <div class="block-label">Departure</div>
      <div class="block-content">Friday, March 6 &mdash; LAX 10:50 AM<br>Korean Air &middot; 20 hours, 1 stop</div>
    </div>

    <div class="today-block">
      <div class="block-label">Flight Ref</div>
      <div class="stamp-cluster" style="margin-top:6px;">
        <div class="stamp stamp--red"><span class="stamp__sublabel">Korean Air</span>E9WTAF</div>
      </div>
    </div>

    <div class="today-block">
      <div class="block-label">Stef e-Visa Code</div>
      <div class="block-content">E260212USA59547149160</div>
      <div class="refs-note" style="margin-top:8px;">Check-in 4 days before at evisa.gov.vn</div>
    </div>`;

  } else if (p.phase === 'during') {
    const e = p.entry;
    const dt = fmtShort(e.date);
    const label = BADGE_LABELS[e.type] || '';
    const cityIdx = cityIdxForEntry(e);

    h += `<div class="today-masthead">
      <div class="today-eyebrow">Day ${p.dayNum} of ${TOTAL_DAYS}</div>
      <div class="today-bignum">${dt.day}</div>
      <div class="today-city${cityIdx !== -1 ? ' today-city--linked' : ''}"${cityIdx !== -1 ? ` data-city-idx="${cityIdx}"` : ''}>${e.title.split('\n')[0]}</div>
      <div class="today-date">${fmtLong(e.date)}</div>
    </div>`;

    if (e.type === 'flight') {
      const legs = FLIGHTS.filter(f => f.date === e.date);
      if (legs.length) {
        h += `<div class="today-block">
          <div class="block-label">Flights Today &mdash; Korean Air &middot; Ref: E9WTAF</div>
          ${legs.map(renderFlightTicket).join('')}
        </div>`;
      }
    } else if (e.type !== 'day') {
      h += `<div class="today-block">
        <span class="travel-chip">${label}</span>
        <div class="block-content">${escape(e.travel)}</div>
      </div>`;
    }

    h += `<div class="today-block">
      <div class="block-label">Wake &amp; Sleep</div>
      <div class="sleep-grid">
        <div>
          <div class="sleep-cell__label">Wake</div>
          <div class="sleep-cell__val">${escape(e.from)}</div>
        </div>
        <div>
          <div class="sleep-cell__label">Sleep</div>
          <div class="sleep-cell__val">${escape(e.to)}</div>
        </div>
      </div>
    </div>`;

    if (e.notes) {
      h += `<div class="today-block">
        <div class="block-label">Notes</div>
        <div class="today-notes-text">${escape(e.notes)}</div>
      </div>`;
    }

    if (e.hotel) {
      h += `<div style="padding: 14px var(--gutter) 0;">
        <div class="hotel-card${cityIdx !== -1 ? ' hotel-card--linked' : ''}"${cityIdx !== -1 ? ` data-city-idx="${cityIdx}"` : ''}>
          <div class="hotel-card__label">Tonight's Stay</div>
          <div class="hotel-card__name">${escape(e.hotel)}</div>
          ${e.hotel_address ? `<div class="hotel-card__address">${escape(e.hotel_address)}</div>` : ''}
        </div>
      </div>`;
    }

    if (e.refs && e.refs.length) {
      h += `<div class="today-block">
        <div class="block-label">References</div>
        <div class="stamp-cluster" style="margin-top:8px;">
          ${e.refs.map((r,i) => `<div class="stamp stamp--${['red','green','blue','sepia'][i%4]}">${escape(r)}</div>`).join('')}
        </div>
      </div>`;
    }

  } else {
    h += `<div class="trip-done">
      <div class="trip-done__heading">Trip Complete.</div>
      <div class="trip-done__sub">Vietnam &mdash; March 2026<br>16 days &middot; 6 cities</div>
    </div>`;
  }

  el.innerHTML = h;

  // Start live countdown if we're in the pre-departure phase
  if (p.phase === 'before') startCountdown();

  // City name → Places
  el.querySelectorAll('.today-city--linked').forEach(node => {
    node.addEventListener('click', () => navigateToCity(+node.dataset.cityIdx));
  });
  // Hotel card → Places
  el.querySelectorAll('.hotel-card--linked').forEach(card => {
    card.addEventListener('click', () => navigateToCity(+card.dataset.cityIdx));
  });
  // Stamp codes → Refs
  el.querySelectorAll('.stamp').forEach(stamp => {
    stamp.classList.add('stamp--tappable');
    stamp.addEventListener('click', ev => { ev.stopPropagation(); navigate('refs'); });
  });
}

// ── Render: JOURNEY ──────────────────────────
function renderJourney() {
  const now = today0();
  const el  = document.getElementById('screen-journey');

  let h = `<div class="page-header">
    <span class="page-header__title">The Journey</span>
    <span class="page-header__sub">Mar 6 &ndash; 21 &middot; 2026</span>
  </div><div class="journey-list">`;

  TRIP.itinerary.forEach((e, i) => {
    const d        = dayOf(e.date);
    const isNow    = d.getTime() === now.getTime();
    const isPast   = d < now;
    const dt       = fmtShort(e.date);
    const label    = BADGE_LABELS[e.type];
    const cityIdx  = cityIdxForEntry(e);
    const hasCity  = cityIdx !== -1;
    const isFlight = e.type === 'flight';

    h += `<div class="journey-entry${isNow ? ' is-today' : ''}${isPast ? ' is-past' : ''}"
      ${hasCity ? `data-city-idx="${cityIdx}" role="button"` : ''}
      ${!hasCity && isFlight ? 'data-nav-refs="1" role="button"' : ''}>
      <div class="j-date">
        <div class="j-date__mon">${dt.mon}</div>
        <div class="j-date__day">${dt.day}</div>
      </div>
      <div class="j-line"><div class="j-dot"></div></div>
      <div class="j-body">
        ${isNow ? '<span class="j-today-tag">&#9664; today</span>' : ''}
        <div class="j-title">${escape(e.title.split('\n')[0])}</div>
        <div class="j-meta">
          ${label ? `<span class="j-badge ${e.type}">${label}</span>` : ''}
          ${e.travel ? `<span class="j-travel">${escape(e.travel)}</span>` : ''}
        </div>
        ${e.notes ? `<div class="j-note">${escape(e.notes)}</div>` : ''}
        <div class="j-plan" id="j-plan-${e.date}"></div>
      </div>
    </div>`;
  });

  h += '</div>';
  el.innerHTML = h;

  // Single delegated handler for plan interactions + navigation
  el.addEventListener('click', handleJourneyClick);

  // Scroll today into view after paint
  requestAnimationFrame(() => {
    const todayEl = el.querySelector('.is-today');
    if (todayEl) todayEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  refreshJourneyPlans();
}

// ── Render: PLACES ───────────────────────────
function renderPlaces() {
  const cities = Object.keys(TRIP.cities);
  const el = document.getElementById('screen-places');

  const lockSVG   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  const unlockSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0"/></svg>`;

  // Header + sticky tab strip
  let h = `<div class="page-header">
    <span class="page-header__title">Places</span>
    <span class="page-header__sub">6 Destinations</span>
    <button id="user-chip" class="user-chip user-chip--unknown" aria-label="Switch user">?</button>
    <button class="edit-toggle-btn" id="edit-toggle-btn" aria-label="Toggle editing">
      <span class="lock-icon lock-icon--locked">${lockSVG}</span>
      <span class="lock-icon lock-icon--unlocked">${unlockSVG}</span>
    </button>
  </div>
  <div class="city-tab-strip">
    ${cities.map((c, i) => `<button class="city-tab-btn${i === 0 ? ' active' : ''}" data-city="${i}">${c}</button>`).join('')}
  </div>`;

  // City panels
  cities.forEach((name, cityIdx) => {
    const city = TRIP.cities[name];
    const slug = citySlug(name);
    h += `<div class="city-panel${cityIdx === 0 ? ' active' : ''}" id="city-panel-${cityIdx}">`;

    // Polaroid or placeholder
    if (city.image) {
      h += `<div class="polaroid-wrap">
        <div class="polaroid">
          <img src="${city.image}" alt="${name}" loading="lazy">
          <div class="polaroid-label">${name}</div>
        </div>
      </div>`;
    } else {
      h += `<div class="city-no-photo">${name}</div>`;
    }

    // Overview
    if (city.overview) {
      h += `<div class="city-overview">
        ${city.overview.split('\n\n').map(p => `<p>${markupOverview(p)}</p>`).join('')}
      </div>`;
    }

    // Stay
    if (city.stay) {
      h += `<div class="lodging-block">
        <strong>${escape(city.stay.name)}</strong>
        ${city.stay.address ? `<div>${escape(city.stay.address)}</div>` : ''}
        ${city.stay.booking ? `<small>${escape(city.stay.booking)}</small>` : ''}
      </div>`;
    }

    // Things to Do
    const doItems  = city.do || [];
    const eatItems = [...(city.eat || []), ...(city.drink || [])];

    if (doItems.length) {
      h += `<div class="places-section">
        <div class="places-section__head">
          <span class="places-section__icon">&#10022;</span>
          <span class="places-section__label">Things to Do</span>
        </div>
        ${doItems.map((item, i) => {
          const parts = item.split('|');
          const iKey  = hardcodedKey(name, 'do', i);
          const meta  = _itemMeta[iKey];
          const mUrl  = (meta && meta.maps_url) || '';
          return renderPlaceItemHTML(parts[0].trim(), iKey, mUrl, false, parts[1] ? parts[1].trim() : '', name, 'do');
        }).join('')}
        <div class="user-places-list" id="up-${slug}-do"></div>
        <button class="add-spot-btn" data-city="${escape(name)}" data-section="do">+ Add</button>
      </div>`;
    }

    // Eat & Drink
    if (eatItems.length) {
      h += `<div class="places-section">
        <div class="places-section__head">
          <span class="places-section__icon">&#9675;</span>
          <span class="places-section__label">Eat &amp; Drink</span>
        </div>
        ${eatItems.map((item, i) => {
          const parts = item.split('|');
          const iKey  = hardcodedKey(name, 'eat', i);
          const meta  = _itemMeta[iKey];
          const mUrl  = (meta && meta.maps_url) || '';
          return renderPlaceItemHTML(parts[0].trim(), iKey, mUrl, false, parts[1] ? parts[1].trim() : '', name, 'eat');
        }).join('')}
        <div class="user-places-list" id="up-${slug}-eat"></div>
        <button class="add-spot-btn" data-city="${escape(name)}" data-section="eat">+ Add</button>
      </div>`;
    }

    h += '</div>'; // end city-panel
  });

  el.innerHTML = h;

  // Tab switching
  el.querySelectorAll('.city-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.city;
      el.querySelectorAll('.city-tab-btn').forEach(b => b.classList.remove('active'));
      el.querySelectorAll('.city-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      el.querySelector(`#city-panel-${idx}`).classList.add('active');
      el.scrollTop = 0;
    });
  });

  // Single delegated handler for all interactions
  el.addEventListener('click', handlePlacesClick);

  // Apply current state
  updateEditUI();
  updateUserChip();
}

// ── Render: REFS ─────────────────────────────
function renderRefs() {
  const el = document.getElementById('screen-refs');

  const REFS = [
    {
      city: 'Ho Chi Minh City',
      note: 'Liberty Central Saigon · Check in Mar 7 · Depart night train Mar 9',
      stamps: [
        { label: 'Agoda Hotel', code: '966228062', color: 'red' },
        { label: 'Baolau Train', code: '3B1CAD', color: 'green' }
      ],
      phones: [],
      address: '17 Ton Duc Thang, District 1, Ho Chi Minh City\nSaigon Railway Station: 01 Nguyễn Thông, Phường 9, Quận 3'
    },
    {
      city: 'Hoi An',
      note: 'Zen Boutique Eco · Nights Mar 10–11 · PIN 6633 · Scooter pickup 9 AM Mar 12',
      stamps: [
        { label: 'Booking.com', code: '5331628842', color: 'red' },
        { label: 'TripAdvisor Scooter', code: '1365980523', color: 'green' }
      ],
      phones: ['+84 90 673 71 45'],
      address: 'Zen Boutique Eco · 87 Ly Thuong Kiet, Cam Chau, Hoi An'
    },
    {
      city: 'Hue',
      note: 'Pisces Hotel · HK Buslines to Phong Nha departs 9 AM — be 30 min early',
      stamps: [
        { label: 'Pisces Hotel', code: '6038803088', color: 'sepia' },
        { label: 'HK Buslines', code: '12GO27634922', color: 'blue' }
      ],
      phones: ['+84 7623 55 999'],
      address: '6/4 kiet 7 Nguyễn Công Trứ tổ 13, phường Phú Hội, Hue\nBus pickup: 35 Nguyen Cong Tru (2 blocks from hotel)'
    },
    {
      city: 'Phong Nha',
      note: 'Coco Riverside · Overnight train departs midnight from Dong Hoi · Coach 8, Seats 1 & 2',
      stamps: [
        { label: 'Bus (arrival)', code: '12GO27634922', color: 'blue' },
        { label: 'Baolau Train', code: 'F745F4', color: 'green' }
      ],
      phones: ['+84 365023363', '+84 886686982'],
      address: 'Phong Nha Coco Riverside · Phong Nha, Quảng Bình Province\nEmail: phongnhacocoriverside@gmail.com'
    }
  ];

  let h = `<div class="page-header">
    <span class="page-header__title">References</span>
    <span class="page-header__sub">Bookings &amp; Contacts</span>
  </div>`;

  // Flights section — full ticket stubs
  h += `<div class="refs-section">
    <div class="refs-city">Korean Air <span>Ref: E9WTAF &middot; Ticket: 1802353922392-393</span></div>
    <div class="stamp-cluster" style="margin-bottom:16px;">
      <div class="stamp stamp--red"><span class="stamp__sublabel">Booking Ref</span>E9WTAF</div>
      <div class="stamp stamp--blue"><span class="stamp__sublabel">Stef e-Visa</span>E260212USA59547149160</div>
    </div>
    ${FLIGHTS.map(renderFlightTicket).join('')}
  </div>`;

  REFS.forEach(r => {
    h += `<div class="refs-section">
      <div class="refs-city">${escape(r.city)} <span>${escape(r.note)}</span></div>`;

    if (r.stamps.length) {
      h += `<div class="stamp-cluster">
        ${r.stamps.map(s => `<div class="stamp stamp--${s.color}"><span class="stamp__sublabel">${escape(s.label)}</span>${escape(s.code)}</div>`).join('')}
      </div>`;
    }

    if (r.phones.length) {
      h += `<div class="phone-list">
        ${r.phones.map(p => `<div class="phone-entry"><a href="tel:${p}">${p}</a></div>`).join('')}
      </div>`;
    }

    if (r.address) {
      h += `<div class="refs-address">${escape(r.address).replace(/\n/g, '<br>')}</div>`;
    }

    h += '</div>';
  });

  // Budget summary
  const total = TRIP.money.reduce((s, m) => s + m.amount, 0);
  h += `<div class="money-summary">
    <div class="money-title">Budget Summary</div>
    ${TRIP.money.map(m => `
      <div class="money-row">
        <span class="money-cat">${escape(m.category)}</span>
        <span class="money-amt">$${m.amount.toFixed(2)}</span>
      </div>`).join('')}
    <div class="money-row">
      <span>Total tracked</span>
      <span class="money-amt">$${total.toFixed(2)}</span>
    </div>
  </div>`;

  h += `<div class="app-refresh">
    <button id="force-refresh-btn" class="force-refresh-btn">Refresh app</button>
    <span class="app-version">v${APP_VERSION}</span>
  </div>`;

  el.innerHTML = h;

  document.getElementById('force-refresh-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('force-refresh-btn');
    if (btn) { btn.textContent = 'Refreshing…'; btn.disabled = true; }
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) await reg.unregister();
      }
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (_) {}
    window.location.reload(true);
  });
}

// ── Navigation ───────────────────────────────
function navigate(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`screen-${screen}`).classList.add('active');
  document.querySelector(`[data-screen="${screen}"]`).classList.add('active');
}

// ── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Render all screens up front (they're hidden until activated)
  renderToday();
  renderJourney();
  renderPlaces();
  renderRefs();

  // Wire navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.screen));
  });

  // Sheet overlay: tap background to dismiss
  document.getElementById('sheet-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideSheet();
  });

  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Connect to Supabase and load collaborative data
  initDB();
});
