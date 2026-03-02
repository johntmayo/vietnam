# Vietnam Trip Data Handoff

Generated: 2026-03-01T22:09:20.390294

## Core itinerary (from Overview tab)

- **2026-03-06**: depart from LAX- 10:50AM; Booking Reference : E9WTAF Korean Air  
  Wake: LA | Sleep: plane | Travel: Fly (20 hours, 1 stop)
  
  Notes: Stef e-visa code:E260212USA59547149160
  
  Hotel: Check in 4 days to see if worked https://evisa.gov.vn/e-visa/search
  
  Refs: E9WTAF, E260212USA59547149160

- **2026-03-07**: Ho Chi Minh City  
  Wake: plane | Sleep: HCM | Travel: arrive sat 7, 10:20pm
  
  Notes: stay in hotel, store luggage, get train food
  
  Hotel: Liberty Central Saigon Riverside Hotel
  
  Address: 17 Ton Duc Thang, District 1, Ho Chi Minh City, Vietnam

- **2026-03-08**: Ho Chi Minh City  
  Wake: HCM | Sleep: HCM | Travel: —

- **2026-03-09**: Ho Chi Minh City
8:30pm night train  
  Wake: HCM | Sleep: train | Travel: 15-17 hours (overnight)

- **2026-03-10**: Hoi An  
  Wake: train | Sleep: Hoi An | Travel: Hoi An (via Da Nang train)
  
  Notes: arrive 1pm tues

- **2026-03-11**: Hoi An  
  Wake: Hoi An | Sleep: Hoi An | Travel: —
  
  Notes: cooking class?

- **2026-03-12**: Scooter to Hue  
  Wake: Hoi An | Sleep: Hue | Travel: —

- **2026-03-13**: Take bus from Hue-- Phong Nha (for caves & intense nature)  
  Wake: Hue | Sleep: Phong Na | Travel: 4 hour bus

- **2026-03-14**: Phong Nha  
  Wake: Phong Na | Sleep: Phong Na | Travel: —
  
  Notes: adventure day

- **2026-03-15**: Phong Nha, overnight train leaves midnight  
  Wake: Phong Na | Sleep: train | Travel: 10 hour train from Phong Nha to Ninh Binh

- **2026-03-16**: Ninh Binh  
  Wake: train | Sleep: Ninh Binh | Travel: arrives 9am

- **2026-03-17**: Ninh Binh  
  Wake: Ninh Binh | Sleep: Ninh Binh | Travel: —

- **2026-03-18**: Ninh Binh & Hanoi  
  Wake: Ninh Binh | Sleep: Hanoi | Travel: 2 hour train to Hanoi
  
  Notes: potential to spend another night in Ninh Binh

- **2026-03-19**: Hanoi  
  Wake: Hanoi | Sleep: Hanoi | Travel: —
  
  Notes: cooking class?

- **2026-03-20**: Hanoi  
  Wake: Hanoi | Sleep: Hanoi | Travel: —
  
  Notes: cooking class?

- **2026-03-21**: fly out midday- 12:20pm  
  Wake: Hanoi | Sleep: plane | Travel: 16.5 hours, 1 stop

## Lodging and key refs (best effort from city tabs)

- **Ho Chi Minh**
  - Stay: Liberty Central Saigon Hotel | Agoda Booking: 966228062
  - Address: Stay in District 1
  - Refs: 966228062, ined, 3B1CAD
- **Hoi An**
  - Stay: Zen Boutique Eco | 87 Ly Thuong Kiet, Cam Chau, Hoi An, Vietnam | booked for night of 10 & 11 | phone +84 90 673 71 45 | Booking: Confirmation: 5331628842
PIN: 6633 (Confidential)
  - Address: Zen Boutique Eco | 87 Ly Thuong Kiet, Cam Chau, Hoi An, Vietnam | booked for night of 10 & 11 | phone +84 90 673 71 45 | Booking: Confirmation: 5331628842
PIN: 6633 (Confidential)
  - Refs: Confirmation, erence
- **Hue**
  - Stay: Arrive via scooter around 4/5pm
  - Address: 6/4 kiet 7 Nguyễn Công Trứ tổ 13, phường phú hội, Tp. Huế, Hue, Vietnam
  - Refs: Number, confirmation
- **Phong Nha**
  - Stay: PHONG NHA (Quảng Bình Province)
  - Address: The Pub with Cold Beer - a whole experience, can swim there and float- leave about 4 hours
- **Ninh Binh**
  - Address: Row to Trang An | quieter, dramatic caves, UNESCO-protected | 7-9am ideal time, buy ticket at Trang An wharf- will be pared with a boat and 2 other people. 3 hours long (get before 10am) https://muave.disantrangan.vn/home/en. People say route 3 with the Dot cave and steps is the best one (though skull island is hokey) or route 2 is the middle, balanced tour
- **Hanoi**
  - Stay: To dos:

## Money notes (from Moneys tab)

- 313.5: trains
- 15.525: bus
- 156.36: hotel
- 798.53: john flight
- 58.0: scooter

## Notes for developer

- `trip.json` preserves all city-tab content in `cities[city].raw_lines` and lightly groups into `sections`.
- Parsing is heuristic. If something looks off, treat `raw_lines` as source of truth.
- Booking / reference codes found are listed in `refs` arrays.
