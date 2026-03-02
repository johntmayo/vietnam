/* ============================================
   VIETNAM · FIELD JOURNAL — app.js
   All trip data + rendering logic
   ============================================ */

'use strict';

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
      overview: "Vietnam's largest city and economic engine, Ho Chi Minh City (still widely called Saigon) mixes French boulevards, Chinese pagodas, glass towers, and a nonstop motorbike buzz. Once a Khmer fishing village, it became a major French colonial port and the capital of South Vietnam until reunification in 1975, so recent history is very present in the streets.\n\nPeople come for energy as much as for sights: slurp noodles at Ben Thanh Market, wander past the red-brick Notre Dame Cathedral and Central Post Office, and dive into the sobering exhibits of the War Remnants Museum. Evenings spill onto sidewalks and rooftop bars; food runs from tiny plastic-stool stalls to polished new-school Vietnamese, and neighborhoods like Chinatown (Cho Lon) add Chinese temples and markets to the mix.",
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
      overview: "Hoi An is a low-rise riverside town where yellow shop-houses, wooden merchants' homes, and assembly halls recall its past life as a major trading port between the 15th and 19th centuries. Merchants from China, Japan, and Europe left a blend of influences you still see in the Japanese Covered Bridge, Chinese temples, and French balconies.\n\nThe Old Town is a UNESCO World Heritage Site, famous for its lantern-lit evenings, bikes weaving past old facades, and tailors who can turn around custom clothes in a day. Typical days: coffee by the Thu Bon River, exploring historic houses and temples, a bike ride through rice paddies to the countryside or beach, then sunset cocktails and street food under hanging lanterns.",
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
      overview: "Hue is Vietnam's old royal capital, straddling the Perfume River with misty hills behind it. From 1802 to 1945 it was the seat of the Nguyễn emperors, and its walled Imperial City—with palaces, temples, and the former Forbidden Purple City—is now a UNESCO World Heritage complex.\n\nTravelers pair citadel wandering with boat trips to riverside pagodas and elaborate royal tombs scattered in the countryside. Hue also has a reputation for refined, slightly more delicate cuisine, so things like imperial-style small dishes and local noodle specialties are worth seeking out after a day of palaces and pagodas.",
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
      overview: "Phong Nha is a small town at the edge of Phong Nha–Kẻ Bàng National Park, a jungle-covered karst region riddled with caves and underground rivers. The park holds hundreds of caves, including Phong Nha Cave itself and record-breakers like Son Doong, one of the largest cave systems in the world.\n\nThis is an adventure base: boat rides into vast river caves, boardwalks through glittering Paradise Cave, ziplining and swimming at Dark Cave, and cycling along quiet country roads past buffalo and villages. War history is also nearby, with sites like the Ho Chi Minh Trail and DMZ area reachable on tours from the region.",
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
      overview: "Often nicknamed \"Halong Bay on land,\" Ninh Binh is all about dramatic limestone karsts rising straight out of rice paddies and slow green rivers. The core UNESCO-listed Trang An Landscape Complex weaves together caves, waterways, and temples, with boat trips that slip under low cave ceilings and between cliffs.\n\nVisitors typically base in Tam Coc or Trang An, climb Mua Cave steps for a sweeping viewpoint over river and paddies, and visit Hoa Lu, an ancient Vietnamese capital from the 10th century. The vibe is slower and rural: think rowing boats, bikes along dikes, and quiet evenings watching the limestone peaks fade into dusk.",
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
      overview: "Hanoi, Vietnam's capital, layers a thousand years of history with lakes, tree-lined streets, and dense markets. Once called Thang Long (\"Rising Dragon\"), it's been the political and cultural center of Vietnam for most of the last millennium, with brief interludes when power shifted to Hue.\n\nIn the Old Quarter, narrow streets are still loosely organized by traditional trades, with scooters, tiny stools, and street food everywhere. Classic stops include Hoan Kiem Lake, the 11th-century Temple of Literature (Vietnam's first university), the Imperial Citadel of Thang Long, Hoa Lo Prison, and the Vietnam Museum of Ethnology, which showcases the country's 54 ethnic groups. Evenings are for bia hơi (fresh beer) corners, bun cha and pho, and, if you like, rooftop views over the lake or the tangle of the Old Quarter.",
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

function escape(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
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
        <div class="countdown-days">${p.daysUntil}</div>
        <div class="countdown-label">${p.daysUntil === 1 ? 'Day' : 'Days'}</div>
        <div class="countdown-until">Until departure</div>
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

    h += `<div class="today-masthead">
      <div class="today-eyebrow">Day ${p.dayNum} of ${TOTAL_DAYS}</div>
      <div class="today-bignum">${dt.day}</div>
      <div class="today-city">${e.title.split('\n')[0]}</div>
      <div class="today-date">${fmtLong(e.date)}</div>
    </div>`;

    if (e.type !== 'day') {
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
        <div class="hotel-card">
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
    const d      = dayOf(e.date);
    const isNow  = d.getTime() === now.getTime();
    const isPast = d < now;
    const dt     = fmtShort(e.date);
    const label  = BADGE_LABELS[e.type];

    h += `<div class="journey-entry${isNow ? ' is-today' : ''}${isPast ? ' is-past' : ''}">
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
      </div>
    </div>`;
  });

  h += '</div>';
  el.innerHTML = h;

  // Scroll today into view after paint
  requestAnimationFrame(() => {
    const todayEl = el.querySelector('.is-today');
    if (todayEl) todayEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ── Render: PLACES ───────────────────────────
function renderPlaces() {
  const cities = Object.keys(TRIP.cities);
  const el = document.getElementById('screen-places');

  // Header + sticky tab strip
  let h = `<div class="page-header">
    <span class="page-header__title">Places</span>
    <span class="page-header__sub">6 Destinations</span>
  </div>
  <div class="city-tab-strip">
    ${cities.map((c, i) => `<button class="city-tab-btn${i === 0 ? ' active' : ''}" data-city="${i}">${c}</button>`).join('')}
  </div>`;

  // City panels
  cities.forEach((name, i) => {
    const city = TRIP.cities[name];
    h += `<div class="city-panel${i === 0 ? ' active' : ''}" id="city-panel-${i}">`;

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
        ${city.overview.split('\n\n').map(p => `<p>${escape(p)}</p>`).join('')}
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

    // Do
    if (city.do && city.do.length) {
      h += `<div class="places-section">
        <div class="places-section__head">
          <span class="places-section__icon">&#10022;</span>
          <span class="places-section__label">Things to Do</span>
        </div>
        ${city.do.map(item => {
          const parts = item.split('|');
          return `<div class="places-item">${escape(parts[0].trim())}${parts[1] ? `<em>&nbsp;&mdash;&nbsp;${escape(parts[1].trim())}</em>` : ''}</div>`;
        }).join('')}
      </div>`;
    }

    // Eat & Drink combined
    const eats = [...(city.eat || []), ...(city.drink || [])];
    if (eats.length) {
      h += `<div class="places-section">
        <div class="places-section__head">
          <span class="places-section__icon">&#9675;</span>
          <span class="places-section__label">Eat &amp; Drink</span>
        </div>
        ${eats.map(item => {
          const parts = item.split('|');
          return `<div class="places-item">${escape(parts[0].trim())}${parts[1] ? `<em>&nbsp;&mdash;&nbsp;${escape(parts[1].trim())}</em>` : ''}</div>`;
        }).join('')}
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
      // Scroll to top of places screen
      el.scrollTop = 0;
    });
  });
}

// ── Render: REFS ─────────────────────────────
function renderRefs() {
  const el = document.getElementById('screen-refs');

  const REFS = [
    {
      city: 'Flights',
      note: 'Korean Air E9WTAF · LAX → HCM, Mar 6–21',
      stamps: [
        { label: 'Korean Air', code: 'E9WTAF', color: 'red' },
        { label: 'Stef e-Visa', code: 'E260212USA59547149160', color: 'blue' }
      ],
      phones: [],
      address: ''
    },
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

  el.innerHTML = h;
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

  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
