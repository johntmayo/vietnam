// Core data models for the interactive trip planner
// Based on Vietnam.xlsx structure: Overview tab (city/region + dates) + activity tabs

export type ActivityCategory = "food" | "culture" | "outdoors" | "night" | "anchor" | "relax" | "history" | "shopping";
export type TimeOfDay = "morning" | "afternoon" | "evening" | "flexible";

export interface Activity {
  id: string;
  cityOrRegion: string; // Must match cities from Overview
  title: string;
  description: string; // Short description
  category: ActivityCategory;
  estimatedDurationHours: number; // e.g. 1.5, 3, 6
  recommendedTimeOfDay?: TimeOfDay;
  notes?: string;
  link?: string;
  isInterested?: boolean; // User marked as "I'm interested"
}

export interface CityStop {
  id: string;
  name: string; // e.g. "HCMC", "Hoi An", "Phong Nha", "Ninh Binh", "Hanoi"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  region?: "North" | "Central" | "South";
}

export interface Day {
  id: string;
  date: string; // ISO date string
  cityOrRegion: string;
  scheduledActivities: Activity[];
  totalScheduledHours: number;
}

// Daily time budget constant (configurable)
export const DAILY_TIME_BUDGET_HOURS = 10;

// Duration range filters
export type DurationFilter = "all" | "short" | "medium" | "long";
export const DURATION_RANGES = {
  short: { min: 0, max: 2 },
  medium: { min: 2, max: 4 },
  long: { min: 4, max: Infinity }
};

// Sample data structure - in production, this would come from parsing Vietnam.xlsx
// Overview tab structure (city order + dates):
export const sampleCityStops: CityStop[] = [
  {
    id: "hcmc",
    name: "Ho Chi Minh City",
    startDate: "2026-03-08",
    endDate: "2026-03-10",
    region: "South"
  },
  {
    id: "hoian",
    name: "Hoi An",
    startDate: "2026-03-10",
    endDate: "2026-03-13",
    region: "Central"
  },
  {
    id: "phongnha",
    name: "Phong Nha",
    startDate: "2026-03-13",
    endDate: "2026-03-15",
    region: "Central"
  },
  {
    id: "ninhbinh",
    name: "Ninh Binh",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    region: "North"
  },
  {
    id: "hanoi",
    name: "Hanoi",
    startDate: "2026-03-17",
    endDate: "2026-03-21",
    region: "North"
  }
];

// Activities from "Vietnam Journey: Classic Highlights & Offbeat Adventures"
// Comprehensive list with detailed descriptions, tips, and offbeat options
export const sampleActivities: Activity[] = [
  // ========== HO CHI MINH CITY ==========
  {
    id: "hcmc-1",
    cityOrRegion: "Ho Chi Minh City",
    title: "War Remnants Museum & Reunification Palace",
    description: "Get a sobering look at Vietnam's 20th-century history. The War Remnants Museum's graphic exhibits document the Vietnam War's impact. The nearby Independence (Reunification) Palace, frozen in 1970s decor, marks the end of the war in 1975.",
    category: "history",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "Not a light visit, but highly regarded by travelers. Go early to avoid crowds."
  },
  {
    id: "hcmc-2",
    cityOrRegion: "Ho Chi Minh City",
    title: "Ben Thanh Market & Coffee Culture",
    description: "Wander Ben Thanh's bustling halls for souvenirs and street food. Then escape the heat at a café – Saigon's coffee culture is legendary. Try a cà phê sữa đá (iced coffee with condensed milk).",
    category: "food",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "morning",
    notes: "Many hip cafes and hidden coffee shops in alleys; some double as art galleries or havens for book-lovers."
  },
  {
    id: "hcmc-3",
    cityOrRegion: "Ho Chi Minh City",
    title: "Historic Architecture Tour",
    description: "Admire French colonial landmarks like the Central Post Office and Notre Dame Cathedral. Visit Thien Hau Temple in Cho Lon (Chinatown) – an atmospheric 19th-century temple where coils of incense hang from the ceiling.",
    category: "culture",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "Cho Lon's pagodas and herbal shops make for an intriguing half-day in District 5."
  },
  {
    id: "hcmc-4",
    cityOrRegion: "Ho Chi Minh City",
    title: "Cu Chi Tunnels",
    description: "A bit outside the city, visit the Củ Chi Tunnels, a vast underground network stretching over 200 kilometers. Crawling through the claustrophobic tunnels (widened for tourists) gives perspective on how the Viet Cong lived and fought.",
    category: "history",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning",
    notes: "Many tours include a shooting range and historical video; go early to beat crowds and midday heat."
  },
  {
    id: "hcmc-5",
    cityOrRegion: "Ho Chi Minh City",
    title: "Saigon's Chinatown & Specialty Streets",
    description: "Exploring District 5's Chinatown shows you an authentic side of the city with traditional apothecaries and ceramic stores. Nearby, 'Textile Street' offers a riot of silks and fabrics.",
    category: "culture",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "afternoon",
    notes: "Other niche streets abound – from flower markets to a street of specialty Vietnamese coffees."
  },
  {
    id: "hcmc-6",
    cityOrRegion: "Ho Chi Minh City",
    title: "Scooter Tour by Night",
    description: "Join a guided scooter tour by night. Companies like XO Tours let you ride pillion on a guide's bike, zipping through areas most tourists miss and sampling the best street eats.",
    category: "night",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "evening",
    notes: "An exhilarating way to see the city's backstreets and food stalls. Guides are licensed and experienced."
  },
  {
    id: "hcmc-7",
    cityOrRegion: "Ho Chi Minh City",
    title: "Mekong Delta Day Trip",
    description: "Take a day trip to the Mekong Delta's waterways. Ride a small sampan boat through palm-shaded canals and visit riverside workshops or orchards. Some tours stop at local farms where you can bike under coconut palms.",
    category: "outdoors",
    estimatedDurationHours: 8,
    recommendedTimeOfDay: "morning",
    notes: "Consider an overnight in the Delta (e.g. in Cần Thơ) to catch the famous Cái Răng floating market at dawn (5–6am) when it's busiest."
  },
  {
    id: "hcmc-8",
    cityOrRegion: "Ho Chi Minh City",
    title: "Walking Food Tour District 4",
    description: "Take a walking food tour of District 4's street-food alley. Sample vegetarian-friendly Vietnamese dishes and learn about local food culture.",
    category: "food",
    estimatedDurationHours: 2.5,
    recommendedTimeOfDay: "evening",
    notes: "Vegetarian dining in Saigon is fantastic – look for 'quán chay' (vegetarian eateries) or try Hum Vegetarian for an upscale experience."
  },
  {
    id: "hcmc-9",
    cityOrRegion: "Ho Chi Minh City",
    title: "Rooftop Bar & City Views",
    description: "Sip cocktails at a rooftop bar overlooking the city's skyline. Bitexco Tower's sky bar is popular, or try craft beer at Pasteur Street Brewing.",
    category: "night",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "evening",
    notes: "For low-key nights, try a craft beer tasting at a microbrewery or a quiet live music venue like Sax n' Art Jazz Club."
  },
  {
    id: "hcmc-10",
    cityOrRegion: "Ho Chi Minh City",
    title: "Nguyen Hue Walking Street",
    description: "Evening stroll down Nguyen Hue Walking Street or around the Opera House. Enjoy the city lights and possibly catch local teens performing dance routines on the plaza.",
    category: "relax",
    estimatedDurationHours: 1,
    recommendedTimeOfDay: "evening",
    notes: "A relaxed way to experience Saigon's evening atmosphere."
  },
  // ========== HOI AN ==========
  {
    id: "hoian-1",
    cityOrRegion: "Hoi An",
    title: "Ancient Houses & Japanese Bridge",
    description: "Stroll the lantern-lined streets and visit old merchant houses turned museums (like Tan Ky House). Don't miss the Japanese Covered Bridge, an iconic 16th-century bridge with a small temple inside – featured on Vietnam's currency.",
    category: "anchor",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "Early morning is the best time to see it crowd-free. By night, the whole Old Town is aglow with silk lanterns."
  },
  {
    id: "hoian-2",
    cityOrRegion: "Hoi An",
    title: "Lantern Lighting & Night Market",
    description: "Head to the riverfront to release paper lanterns onto the water. The nightly street market on Nguyen Hoang street sells snacks, souvenirs, and more lanterns.",
    category: "culture",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "evening",
    notes: "If you're there on the 14th day of the lunar month, you'll catch the Lantern Festival when the town turns off electric lights and shines solely by lantern glow."
  },
  {
    id: "hoian-3",
    cityOrRegion: "Hoi An",
    title: "Tailoring & Crafts",
    description: "Hội An is famous for its affordable tailor shops. Get custom clothing made in 24–48 hours. Visit Thanh Ha pottery village or a workshop making lanterns by hand.",
    category: "shopping",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "afternoon",
    notes: "You can even try making a lantern yourself as a souvenir."
  },
  {
    id: "hoian-4",
    cityOrRegion: "Hoi An",
    title: "Countryside Bicycle Ride",
    description: "Rent a bicycle and explore beyond the Old Town. Ride out to the surrounding rice paddies and villages. Popular loop to Tra Que Vegetable Village or Cam Kim Island.",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "It's flat terrain and very scenic with fewer tourists. Early morning or late afternoon is best."
  },
  {
    id: "hoian-5",
    cityOrRegion: "Hoi An",
    title: "Hải Vân Pass Scooter Trip",
    description: "A winding mountain pass between Đà Nẵng and Huế offering dramatic ocean and mountain views. About 60 km from Hội An to the top of the pass.",
    category: "outdoors",
    estimatedDurationHours: 6,
    recommendedTimeOfDay: "morning",
    notes: "Stop at scenic overlooks (like the famous spot where Top Gear filmed). You can hire an Easy Rider or go with a scooter tour company."
  },
  {
    id: "hoian-6",
    cityOrRegion: "Hoi An",
    title: "Marble Mountains",
    description: "Five limestone hills full of caves and pagodas. Climb stone steps to explore illuminated caverns with Buddhist shrines like Huyen Khong Cave where sunlight beams in from a collapsed ceiling.",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "A short hike, but quite an atmospheric spot combining nature and spirituality."
  },
  {
    id: "hoian-7",
    cityOrRegion: "Hoi An",
    title: "An Bàng Beach",
    description: "A 10-minute drive from town, great for an afternoon swim and a sunset drink at a beach bar. Clean, with gentle waves and thatched parasols.",
    category: "relax",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "afternoon",
    notes: "Nice to unwind after sightseeing."
  },
  {
    id: "hoian-8",
    cityOrRegion: "Hoi An",
    title: "Chàm Islands Day Trip",
    description: "Wild card: Reachable by speedboat from Cửa Đại harbor. These islands have coral reefs for snorkeling and a laid-back fishing-village vibe.",
    category: "outdoors",
    estimatedDurationHours: 6,
    recommendedTimeOfDay: "morning",
    notes: "Boat schedules are morning only and weather-dependent (service usually runs March–September)."
  },
  {
    id: "hoian-9",
    cityOrRegion: "Hoi An",
    title: "Cooking Class with Market Tour",
    description: "Many classes include a market tour to buy ingredients, then a hands-on lesson preparing dishes like cao lầu (Hội An's signature noodle dish) or fresh spring rolls.",
    category: "food",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning",
    notes: "Seek out a vegetarian-focused cooking class or request meatless recipes. Most classes are very accommodating with 'ăn chay' requests."
  },
  {
    id: "hoian-10",
    cityOrRegion: "Hoi An",
    title: "Hidden Cafes & Rooftop Views",
    description: "Hunt down a hidden cafe in the Old Town for local drip coffee or a tasting flight of Vietnamese teas. Faifo Coffee offers a panoramic view of Hội An's sunset over the tiled roofs.",
    category: "relax",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "afternoon",
    notes: "Get there before golden hour to snag a seat."
  },
  {
    id: "hoian-11",
    cityOrRegion: "Hoi An",
    title: "Hoi An Brewery & Lune Center",
    description: "For low-key nightlife, enjoy local craft beer at Hoi An Brewery or catch an art performance at the Lune Center (acrobatic show fusing modern circus and Vietnamese folk themes).",
    category: "night",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "evening",
    notes: "On weekends, An Bang Beach area sometimes has live music at beachside lounges."
  },
  // ========== PHONG NHA ==========
  {
    id: "phongnha-1",
    cityOrRegion: "Phong Nha",
    title: "Paradise Cave",
    description: "A spectacular dry cave known for its otherworldly stalactites and stalagmites. A wooden boardwalk extends 1 kilometer into the cave's massive chambers, which are dramatically lit. The scale (up to 30m high chambers) and formations are jaw-dropping.",
    category: "anchor",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning",
    notes: "Go early in the day to avoid tour bus crowds and to feel the quiet magic of the cave. Easy visit after a short uphill walk to the cave entrance."
  },
  {
    id: "phongnha-2",
    cityOrRegion: "Phong Nha",
    title: "Phong Nha Cave Boat Tour",
    description: "The namesake cave is reached by a boat ride up the Son River. You'll glide between karst cliffs and jungle, then the boat enters the cave itself for about 1.5 km! They cut the engine and paddle, so you can marvel at the illuminated formations reflecting off the water.",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "On the return, you can optionally get off and explore some dry sections on foot. The approach is gorgeous."
  },
  {
    id: "phongnha-3",
    cityOrRegion: "Phong Nha",
    title: "Dark Cave (Hang Tối) Adventure",
    description: "Zipline over a river to reach the cave, swim or wade in (lifejackets and headlights provided), then hike through muddy passages to a natural mud bath area! After slathering in therapeutic mud, you wash off in an underground river and kayak back.",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "afternoon",
    notes: "You will get dirty (wear an old swimsuit). Facilities are a bit rustic, but it's a blast if you're up for a moderate physical challenge."
  },
  {
    id: "phongnha-4",
    cityOrRegion: "Phong Nha",
    title: "Jungle Hiking & Lesser-Known Caves",
    description: "Consider a guided day trek. For example, the Phong Nha Eco-Trail to Thác Gió Waterfall or a hike to Hang Trọ Mơi (Eight Lady Cave & temple) which has war history significance.",
    category: "outdoors",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning",
    notes: "These are shorter hikes (a couple of hours) but get you into the jungle environment. With more time, you could do a full-day trek to Hang Tien or Hang Va (wet river caves)."
  },
  {
    id: "phongnha-5",
    cityOrRegion: "Phong Nha",
    title: "Hang Én Cave (Wild Card)",
    description: "The world's third-largest cave, done in a 2-day/1-night camping tour. Hike through remote jungle and villages, then camp on a sandy beach inside Hang Én's massive cavern with a jungle opening letting in sunlight.",
    category: "outdoors",
    estimatedDurationHours: 16,
    recommendedTimeOfDay: "morning",
    notes: "Requires good fitness (about 10 miles of hiking) and advance booking with an outfitter. A unique off-the-beaten-path overnight adventure."
  },
  {
    id: "phongnha-6",
    cityOrRegion: "Phong Nha",
    title: "Phong Nha Countryside Loop",
    description: "Rent a bicycle or scooter and ride out among the pepper farms, peanut fields, and karst hills. Popular ride: from the village to the Botanical Garden, then to Eight Ladies Cave & War Martyrs Memorial, and loop back.",
    category: "outdoors",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning",
    notes: "About 40 km round-trip. The roads have little traffic. You'll see stunning jungle-clad limestone formations."
  },
  {
    id: "phongnha-7",
    cityOrRegion: "Phong Nha",
    title: "The Pub With Cold Beer",
    description: "A rustic riverside spot famous for cold drinks and local dishes. It's become a bit of a legend among backpackers for its bucolic setting (hammocks, river to swim in, farm-to-table food).",
    category: "relax",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "afternoon",
    notes: "As vegetarians, you might opt for their peanut tofu dish. A short ride across the river from the village."
  },
  // ========== NINH BINH ==========
  {
    id: "ninhbinh-1",
    cityOrRegion: "Ninh Binh",
    title: "Tam Cốc Boat Ride",
    description: "Local women row you with their feet down the river, through bright-green rice fields flanked by karst cliffs, and into a series of low-ceiling caves. It feels like entering another world as you emerge from each cave to more postcard scenery.",
    category: "anchor",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "morning",
    notes: "Go early (around 7-8 AM) to catch the calm morning light and avoid midday heat. The rivers are most picturesque in late spring when rice fields are vivid green or golden."
  },
  {
    id: "ninhbinh-2",
    cityOrRegion: "Ninh Binh",
    title: "Tràng An Scenic Complex",
    description: "A UNESCO site - a slightly longer boat tour that weaves through a network of rivers and tunnels. Features more dramatic cavern passages and you'll also see temples tucked in the cliffs.",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "Tràng An tends to be a bit less crowded with hawkers. Some travelers do both Tam Cốc and Tràng An."
  },
  {
    id: "ninhbinh-3",
    cityOrRegion: "Ninh Binh",
    title: "Múa Cave Viewpoint",
    description: "Hike up about 500 stone steps to the Hang Múa peak, where a dragon statue winds along the summit. At the top, you get a panoramic view over Tam Cốc's valley – winding river, paddies, and karst spires as far as the eye can see.",
    category: "outdoors",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "afternoon",
    notes: "Sunset from here is spectacular, but sunrise is even better if you can manage an early start. The hike is steep but short (15–20 minutes up)."
  },
  {
    id: "ninhbinh-4",
    cityOrRegion: "Ninh Binh",
    title: "Ancient Capital Hoa Lư",
    description: "Hoa Lư was the capital of Vietnam in the 10th century. Today it's a quiet area with temples dedicated to past emperors Dinh and Le. The temples are built against a backdrop of karst cliffs.",
    category: "history",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "afternoon",
    notes: "Worth an hour stop to stroll the grounds, especially with a guide or audio guide. You might combine Hoa Lư with the Múa Cave stop."
  },
  {
    id: "ninhbinh-5",
    cityOrRegion: "Ninh Binh",
    title: "Cycling the Countryside",
    description: "Ninh Bình is arguably best explored by bicycle. Cycle down country lanes along canals and rice fields, passing duck farms and limestone outcrops. One lovely route is from Tam Cốc town to Bích Động Pagoda – a series of pagodas built into a mountainside cave.",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "Many accommodations lend bikes for free. Park your bike and climb the steps through cave chambers to reach a hilltop temple and viewpoint."
  },
  {
    id: "ninhbinh-6",
    cityOrRegion: "Ninh Binh",
    title: "Thung Nham Bird Park",
    description: "Near dusk you can see flocks of birds (storks, herons) return to roost in a wetland sanctuary. About 7km from Tam Cốc.",
    category: "outdoors",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "evening",
    notes: "Best visited near dusk to see the birds returning."
  },
  {
    id: "ninhbinh-7",
    cityOrRegion: "Ninh Binh",
    title: "Van Long Nature Reserve",
    description: "A less-touristy wetland reserve known for tranquil scenery and wildlife. Take a rowing boat out into Van Long's marshes, which are home to the Delacour's langur, an endangered primate.",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "Sightings aren't guaranteed, but the boat ride is very peaceful and without the tourist bustle of Tam Cốc. It was a filming location for Kong: Skull Island."
  },
  {
    id: "ninhbinh-8",
    cityOrRegion: "Ninh Binh",
    title: "Bái Đính Pagoda Complex",
    description: "Vietnam's largest Buddhist temple complex. A mix of ancient and new: an older pagoda sits in a cave on the hill (reachable by about 300 steps), and a newer massive complex has been built with grand halls, a 100-foot Buddha statue, and hundreds of stone arhats.",
    category: "culture",
    estimatedDurationHours: 2.5,
    recommendedTimeOfDay: "afternoon",
    notes: "You can tour the expansive grounds on electric carts. In the evening, the big pagoda is beautifully lit."
  },
  {
    id: "ninhbinh-9",
    cityOrRegion: "Ninh Binh",
    title: "Cooking & Local Village Experience",
    description: "Some homestays offer farm-to-table cooking classes or market tours. Learn regional specialties like burned rice (cơm cháy) – a Ninh Bình crunchy rice dish often served with sauce (vegetarian versions use a savory mushroom sauce).",
    category: "food",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "afternoon",
    notes: "A great opportunity to learn regional specialties with vegetarian adaptations."
  },
  // ========== HANOI ==========
  {
    id: "hanoi-1",
    cityOrRegion: "Hanoi",
    title: "Hanoi Old Quarter & Hoàn Kiếm Lake",
    description: "Wander the 36 Streets of the Old Quarter, each traditionally named after the trade that was sold there (Hang Gai = Silk Street, Hang Bac = Silver Street, etc.). Visit Hoàn Kiếm Lake – the spiritual heart of the city, where locals do tai chi in the mornings.",
    category: "anchor",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning",
    notes: "Stroll across the red Húc Bridge to Ngoc Son Temple on a tiny island in the lake. Try an egg coffee at the famous Café Giảng – this Hanoi specialty tastes like tiramisu in a cup!"
  },
  {
    id: "hanoi-2",
    cityOrRegion: "Hanoi",
    title: "Temple of Literature",
    description: "Vietnam's first university, established in 1076, set in a serene walled courtyard complex. Dedicated to Confucius and scholars. Stelae mounted on stone tortoises honor ancient grads.",
    category: "culture",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "afternoon",
    notes: "A peaceful spot full of ancient architecture and lotus ponds – a nice respite from the busy city."
  },
  {
    id: "hanoi-3",
    cityOrRegion: "Hanoi",
    title: "Ho Chi Minh Mausoleum & Quarter",
    description: "Pay respects to Ho Chi Minh at his imposing granite mausoleum. Then visit the stilt house and Presidential Palace grounds where he lived, and the One Pillar Pagoda (a tiny historic pagoda on a pillar in a lotus pond).",
    category: "culture",
    estimatedDurationHours: 2.5,
    recommendedTimeOfDay: "morning",
    notes: "Morning is the time to see his embalmed body, if you wish – dress modestly and expect lines. This area has pretty botanical gardens to wander."
  },
  {
    id: "hanoi-4",
    cityOrRegion: "Hanoi",
    title: "Vietnam Museum of Ethnology",
    description: "Excellent for understanding the 54 ethnic groups of Vietnam, with life-size traditional houses in an outdoor garden.",
    category: "culture",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "afternoon",
    notes: "A fascinating insight into Vietnam's diverse ethnic cultures."
  },
  {
    id: "hanoi-5",
    cityOrRegion: "Hanoi",
    title: "Women's Museum & Fine Arts Museum",
    description: "The Women's Museum highlights women's roles in Vietnam's culture and history (with beautiful exhibits on fashion, wartime contributions, etc.). The Fine Arts Museum has an impressive collection from ancient Cham art to modern paintings.",
    category: "culture",
    estimatedDurationHours: 2.5,
    recommendedTimeOfDay: "afternoon",
    notes: "Both museums offer deep insights into Vietnamese culture and history."
  },
  {
    id: "hanoi-6",
    cityOrRegion: "Hanoi",
    title: "Street Food Tour (Vegetarian Options)",
    description: "Hanoi's street food is legendary. Since you favor vegetarian, try pho chay (vegetarian pho), bánh mì with omelette, bun rieu chay (noodle soup with tomato broth), fresh spring rolls, sticky rice with peanut, etc.",
    category: "food",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "evening",
    notes: "A guided street food walk can be tailored to skip the meaty stuff. Try Uu Dam Chay or Bo De Quan for good veggie Vietnamese dishes. End with egg coffee or a chè dessert."
  },
  {
    id: "hanoi-7",
    cityOrRegion: "Hanoi",
    title: "Long Biên Bridge Walk",
    description: "Experience Hanoi's railway charm by visiting the Long Biên Bridge (designed by Eiffel's company) that crosses the Red River. You can actually walk on it, and even stand to the side when a train comes across.",
    category: "culture",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "afternoon",
    notes: "An evocative, slightly edgy experience with great views of the river and the city. Note: Train Street access has been restricted, but this is a great alternative."
  },
  {
    id: "hanoi-8",
    cityOrRegion: "Hanoi",
    title: "West Lake & Tran Quoc Pagoda",
    description: "Take a late afternoon walk around West Lake (Hồ Tây) – Hanoi's largest lake. Along the shore you'll find cafes, the beautiful Tran Quoc Pagoda (oldest Buddhist temple in the city, set on a lakeside islet), and locals fishing or doing evening exercise.",
    category: "relax",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "afternoon",
    notes: "Rent a bicycle or just stroll to enjoy the breeze. Another green escape is Lenin Park / Thống Nhất Park."
  },
  {
    id: "hanoi-9",
    cityOrRegion: "Hanoi",
    title: "Handicraft Villages",
    description: "Visit a traditional craft village on the outskirts. For instance, Bat Trang pottery village (about 30 minutes drive) – you can watch artisans throw clay and even try molding or painting your own piece of pottery.",
    category: "culture",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning",
    notes: "There's also Van Phuc silk village known for silk weaving, or Duong Lam Ancient Village for a glimpse of traditional houses."
  },
  {
    id: "hanoi-10",
    cityOrRegion: "Hanoi",
    title: "Water Puppet Theater",
    description: "An hour-long show where puppeteers behind a screen manipulate lacquered wooden puppets over a water stage, depicting folklore scenes to live music. It's charming and unique to Vietnam.",
    category: "culture",
    estimatedDurationHours: 1,
    recommendedTimeOfDay: "evening",
    notes: "Located near Hoan Kiem Lake. A must-see cultural experience."
  },
  {
    id: "hanoi-11",
    cityOrRegion: "Hanoi",
    title: "Jazz Club or Craft Beer",
    description: "Binh Minh's Jazz Club, run by a Vietnamese jazz legend, has live performances every night at 9pm and a classy, laid-back atmosphere. Alternatively, try The Mad Botanist for gin cocktails or Standing Bar which offers 19 Vietnam craft beers on tap.",
    category: "night",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "evening",
    notes: "These spots tend to be relaxed and are perfect for reflecting on your trip. Near the Opera House in the French Quarter."
  },
  {
    id: "hanoi-12",
    cityOrRegion: "Hanoi",
    title: "Weekend Night Market",
    description: "The weekend Night Market (Friday to Sunday nights along Hang Dao) is fun to browse for cheap trinkets and snacks. Great place to pick up souvenirs and support local artisans.",
    category: "shopping",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "evening",
    notes: "In the Old Quarter you'll find shops selling lacquerware, silk scarves, embroidered linens, coffee beans, and woven baskets."
  },
  {
    id: "hanoi-13",
    cityOrRegion: "Hanoi",
    title: "Hạ Long Bay Day Trip",
    description: "Full day cruise to the famous bay with its iconic limestone karsts rising from emerald waters. A UNESCO World Heritage site and one of Vietnam's most iconic destinations.",
    category: "anchor",
    estimatedDurationHours: 8,
    recommendedTimeOfDay: "morning",
    notes: "Usually includes boat cruise, cave visits, and kayaking. Book in advance as it's very popular."
  },
  
  // ========== WILD CARD ADVENTURES ==========
  {
    id: "wildcard-1",
    cityOrRegion: "Ha Giang",
    title: "Ha Giang Loop (3-5 Day Motorbike Odyssey)",
    description: "Venture to Vietnam's northernmost mountains on a 3-5 day motorbike loop in Hà Giang Province, bordering China. Called one of Southeast Asia's most breathtaking road trips. Ride through towering limestone peaks and deep valleys, including the legendary Mã Pí Lèng Pass.",
    category: "outdoors",
    estimatedDurationHours: 72,
    recommendedTimeOfDay: "morning",
    notes: "You can ride pillion with an easy-rider guide. Sleep in simple homestays, eat local meals. 4–5 days allows a more relaxed pace. Physically medium challenge but the rewards are immense. Ha Giang remains far less touristy than Sa Pa."
  },
  {
    id: "wildcard-2",
    cityOrRegion: "Cao Bang",
    title: "Bản Giốc Waterfall & Cao Bằng",
    description: "Bản Giốc is one of Vietnam's most magnificent waterfalls. It spans 300 meters across, cascading in tiers amidst jungle-covered karst – the widest waterfall in Southeast Asia, straddling the China-Vietnam border.",
    category: "outdoors",
    estimatedDurationHours: 12,
    recommendedTimeOfDay: "morning",
    notes: "Requires about 5-6 hours by car or bus from Hanoi, so it's best as an overnight trip. You can also explore the Ngườm Ngao Cave nearby. This region is a UNESCO Geopark."
  },
  {
    id: "wildcard-3",
    cityOrRegion: "Sapa",
    title: "Sapa Rice Terrace Treks",
    description: "Famed for its rice terrace mountains and Hmong ethnic culture. Spend 2–3 days trekking through valleys of terraced rice fields. You can do a moderate 1-day hike or an overnight trek with a homestay in a minority village.",
    category: "outdoors",
    estimatedDurationHours: 24,
    recommendedTimeOfDay: "morning",
    notes: "Take an overnight sleeper train from Hanoi to Sa Pa (via Lào Cai). March–May and Sept–Oct are most beautiful for the green or golden rice terraces. If Sapa's popularity is a turn-off, consider alternatives like Mộc Châu or Pu Luong."
  },
  {
    id: "wildcard-4",
    cityOrRegion: "Mekong Delta",
    title: "Mekong Delta Deeper Dive (2-3 Days)",
    description: "Extend your time in the delta beyond a day trip. Go to Cần Thơ to see the Cái Răng floating market at dawn, then continue to Châu Đốc near the Cambodian border. Visit Tra Su Cajuput Forest – a mangrove bird sanctuary you glide through on a sampan.",
    category: "outdoors",
    estimatedDurationHours: 48,
    recommendedTimeOfDay: "morning",
    notes: "Staying at a delta homestay, you'd dine on Mekong specialties (with vegetarian adaptations). The delta is flat and lush, so not physically hard – it's more about the journey by boat and cycling on narrow canalside paths."
  },
  {
    id: "wildcard-5",
    cityOrRegion: "Central Highlands",
    title: "Central Highlands & Ho Chi Minh Trail",
    description: "A real wild card: ride part of the Ho Chi Minh Trail through Kon Tum, Pleiku, Buôn Ma Thuột, and Đà Lạt. This region is rich in coffee plantations, waterfalls, and ethnic minority cultures, way off the tourist track.",
    category: "outdoors",
    estimatedDurationHours: 72,
    recommendedTimeOfDay: "morning",
    notes: "An Easy Rider motorbike tour can be arranged for a few days. Highlights include Dray Nur Waterfall near Buon Ma Thuot. This wild card is for those who want to see a different face of Vietnam. Time-intensive and involves a lot of road time."
  }
];

// Helper function to generate days from city stops
export function generateDaysFromCityStops(cityStops: CityStop[]): Day[] {
  const days: Day[] = [];
  
  cityStops.forEach((stop) => {
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        id: `day-${stop.id}-${d.toISOString().split('T')[0]}`,
        date: d.toISOString().split('T')[0],
        cityOrRegion: stop.name,
        scheduledActivities: [],
        totalScheduledHours: 0
      });
    }
  });
  
  return days;
}

// Helper to get activities for a city
export function getActivitiesForCity(activities: Activity[], cityName: string): Activity[] {
  return activities.filter(a => a.cityOrRegion === cityName);
}

// Helper to calculate total hours for a day
export function calculateDayHours(activities: Activity[]): number {
  return activities.reduce((sum, activity) => sum + activity.estimatedDurationHours, 0);
}

// Helper to get time budget status
export type TimeBudgetStatus = "underbooked" | "approaching" | "full" | "overbooked";

export function getTimeBudgetStatus(totalHours: number, budget: number = DAILY_TIME_BUDGET_HOURS): TimeBudgetStatus {
  if (totalHours < budget * 0.6) return "underbooked";
  if (totalHours < budget * 0.9) return "approaching";
  if (totalHours <= budget) return "full";
  return "overbooked";
}

// Helper to suggest a balanced day
export function suggestDayActivities(
  availableActivities: Activity[],
  budget: number = DAILY_TIME_BUDGET_HOURS
): Activity[] {
  const suggested: Activity[] = [];
  let totalHours = 0;
  
  // First, try to add one anchor activity
  const anchors = availableActivities.filter(a => a.category === "anchor" && !suggested.includes(a));
  if (anchors.length > 0) {
    const anchor = anchors[0];
    if (totalHours + anchor.estimatedDurationHours <= budget) {
      suggested.push(anchor);
      totalHours += anchor.estimatedDurationHours;
    }
  }
  
  // Then add smaller activities to fill the day
  const remaining = availableActivities
    .filter(a => !suggested.includes(a) && a.category !== "anchor")
    .sort((a, b) => a.estimatedDurationHours - b.estimatedDurationHours);
  
  for (const activity of remaining) {
    if (totalHours + activity.estimatedDurationHours <= budget) {
      suggested.push(activity);
      totalHours += activity.estimatedDurationHours;
    }
  }
  
  return suggested;
}

