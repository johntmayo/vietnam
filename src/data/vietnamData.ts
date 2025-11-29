export type Region = "North" | "Central" | "South";

export interface Destination {
  id: string;
  name: string;
  region: Region;
  daysRecommended: number;
  themes: ("Culture" | "Nature" | "Food" | "History" | "Beach" | "Nightlife" | "Relax")[];
  highlight: string;
  bestForMarchApril: boolean;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  hours?: string;
  mapLink?: string;
  themes: Destination["themes"];
}

export interface DayPlan {
  day: number;
  base: string;
  title: string;
  description: string;
  region: Region;
  themes: Destination["themes"];
  activities?: Activity[];
}

export interface ItineraryTemplate {
  id: string;
  name: string;
  description: string;
  focus: string[];
  days: DayPlan[];
}

export const destinations: Destination[] = [
  {
    id: "hanoi",
    name: "Hanoi",
    region: "North",
    daysRecommended: 2,
    themes: ["Culture", "Food", "History", "Nightlife"],
    highlight:
      "Wander the Old Quarter, street food tours, coffee culture, and lakeside evenings.",
    bestForMarchApril: true
  },
  {
    id: "halong",
    name: "Hạ Long Bay / Lan Ha Bay",
    region: "North",
    daysRecommended: 2,
    themes: ["Nature", "Relax"],
    highlight:
      "Stay on an overnight boat among limestone karsts; kayak and visit caves.",
    bestForMarchApril: true
  },
  {
    id: "ninhbinh",
    name: "Ninh Bình (Tam Cốc / Tràng An)",
    region: "North",
    daysRecommended: 2,
    themes: ["Nature", "Culture"],
    highlight: "Karst landscapes, paddled boat rides, and countryside cycling.",
    bestForMarchApril: true
  },
  {
    id: "hue",
    name: "Huế",
    region: "Central",
    daysRecommended: 2,
    themes: ["History", "Culture", "Food"],
    highlight:
      "Imperial Citadel, royal tombs along the Perfume River, and refined royal cuisine.",
    bestForMarchApril: true
  },
  {
    id: "hoian",
    name: "Hội An",
    region: "Central",
    daysRecommended: 3,
    themes: ["Culture", "Food", "Beach", "Relax"],
    highlight:
      "Lantern-lit Ancient Town, tailoring, rice-field cycling, and An Bàng beach.",
    bestForMarchApril: true
  },
  {
    id: "danang",
    name: "Đà Nẵng",
    region: "Central",
    daysRecommended: 1,
    themes: ["Beach", "Nightlife"],
    highlight:
      "Gateway between Huế and Hội An with modern beach resorts and coastal views.",
    bestForMarchApril: true
  },
  {
    id: "dalat",
    name: "Đà Lạt",
    region: "South",
    daysRecommended: 2,
    themes: ["Nature", "Relax"],
    highlight: "Cool highlands, waterfalls, coffee farms, and pine forests.",
    bestForMarchApril: true
  },
  {
    id: "saigon",
    name: "Ho Chi Minh City (Saigon)",
    region: "South",
    daysRecommended: 3,
    themes: ["History", "Food", "Nightlife"],
    highlight:
      "War Remnants Museum, Cu Chi Tunnels, markets, rooftop bars, and motorbike chaos.",
    bestForMarchApril: true
  },
  {
    id: "mekong",
    name: "Mekong Delta",
    region: "South",
    daysRecommended: 2,
    themes: ["Nature", "Food"],
    highlight:
      "Floating markets, river life, tropical fruit orchards, and homestays.",
    bestForMarchApril: true
  },
  {
    id: "phuquoc",
    name: "Phú Quốc",
    region: "South",
    daysRecommended: 3,
    themes: ["Beach", "Relax"],
    highlight:
      "White sand beaches, clear water, snorkeling, and sunset seafood dinners.",
    bestForMarchApril: true
  }
];

export const twoWeekClassicNorthToSouth: ItineraryTemplate = {
  id: "classic-north-south",
  name: "Classic North → South (2 Weeks)",
  description:
    "Balanced culture, nature, and food journey from Hanoi and Hạ Long Bay down through Hội An to Ho Chi Minh City and the Mekong.",
  focus: ["Culture", "Food", "Nature"],
  days: [
    {
      day: 1,
      base: "Hanoi",
      title: "Arrival & Old Quarter",
      description:
        "Arrive in Hanoi, check in, then wander the Old Quarter, Hoàn Kiếm Lake, and enjoy your first street food dinner.",
      region: "North",
      themes: ["Culture", "Food", "History"]
    },
    {
      day: 2,
      base: "Hanoi",
      title: "Museums & Train Street",
      description:
        "Visit the Ho Chi Minh complex, Temple of Literature, and Vietnamese Women’s Museum; coffee on Train Street if open.",
      region: "North",
      themes: ["History", "Culture", "Food"]
    },
    {
      day: 3,
      base: "Hạ Long Bay",
      title: "Cruise Departure",
      description:
        "Transfer to Hạ Long / Lan Ha Bay and board an overnight cruise; kayak, swim, sunset on deck.",
      region: "North",
      themes: ["Nature", "Relax"]
    },
    {
      day: 4,
      base: "Hanoi → Da Nang → Hội An",
      title: "Bay Sunrise & Fly Central",
      description:
        "Enjoy sunrise on the bay, disembark, transfer back to Hanoi and fly to Da Nang, then transfer to Hội An.",
      region: "Central",
      themes: ["Nature", "Culture"]
    },
    {
      day: 5,
      base: "Hội An",
      title: "Ancient Town & Lanterns",
      description:
        "Explore the Ancient Town, Japanese Bridge, assembly halls, and take a lantern-lit evening boat ride.",
      region: "Central",
      themes: ["Culture", "Food", "Nightlife"]
    },
    {
      day: 6,
      base: "Hội An",
      title: "Countryside & Beach",
      description:
        "Cycle through rice paddies to Tra Que village, then relax at An Bàng beach in the afternoon.",
      region: "Central",
      themes: ["Nature", "Relax", "Food"]
    },
    {
      day: 7,
      base: "Huế",
      title: "Hai Vân Pass to Huế",
      description:
        "Travel the scenic Hải Vân Pass (by car or motorbike tour) to Huế; explore riverside cafés in the evening.",
      region: "Central",
      themes: ["Nature", "Culture"]
    },
    {
      day: 8,
      base: "Huế",
      title: "Imperial City & Tombs",
      description:
        "Visit the Imperial Citadel, Thien Mu Pagoda, and one or two royal tombs; try Huế’s signature dishes.",
      region: "Central",
      themes: ["History", "Culture", "Food"]
    },
    {
      day: 9,
      base: "Da Lat",
      title: "Fly to Đà Lạt",
      description:
        "Fly via Da Nang to Đà Lạt, Vietnam’s cool highland escape; evening stroll around Xuan Huong Lake.",
      region: "South",
      themes: ["Nature", "Relax"]
    },
    {
      day: 10,
      base: "Da Lat",
      title: "Waterfalls & Coffee Farms",
      description:
        "Day trip to a waterfall (Pongour or Datanla) and visit coffee farms; enjoy the café scene.",
      region: "South",
      themes: ["Nature", "Relax", "Food"]
    },
    {
      day: 11,
      base: "Ho Chi Minh City",
      title: "Fly to Saigon",
      description:
        "Fly to Ho Chi Minh City; explore Bến Thành Market, Nguyen Hue Walking Street, and a rooftop bar.",
      region: "South",
      themes: ["Food", "Nightlife", "Culture"]
    },
    {
      day: 12,
      base: "Ho Chi Minh City",
      title: "War History & District 1",
      description:
        "Visit the War Remnants Museum, Reunification Palace, Notre Dame Cathedral and the Central Post Office.",
      region: "South",
      themes: ["History", "Culture"]
    },
    {
      day: 13,
      base: "Mekong Delta",
      title: "Mekong Delta Overnight",
      description:
        "Head to the Mekong (Cần Thơ or Ben Tre); boat rides, canals, fruit orchards, and homestay.",
      region: "South",
      themes: ["Nature", "Food"]
    },
    {
      day: 14,
      base: "Ho Chi Minh City",
      title: "Return & Departure",
      description:
        "Return to Ho Chi Minh City; last-minute coffee, shopping, and fly home.",
      region: "South",
      themes: ["Food", "Relax"]
    }
  ]
};


