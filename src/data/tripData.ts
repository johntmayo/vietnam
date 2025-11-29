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

// Sample activities - in production, these would come from other tabs in Vietnam.xlsx
export const sampleActivities: Activity[] = [
  // Ho Chi Minh City
  {
    id: "hcmc-1",
    cityOrRegion: "Ho Chi Minh City",
    title: "War Remnants Museum",
    description: "Powerful museum documenting the Vietnam War",
    category: "history",
    estimatedDurationHours: 2.5,
    recommendedTimeOfDay: "morning",
    link: "https://www.google.com/maps/place/War+Remnants+Museum"
  },
  {
    id: "hcmc-2",
    cityOrRegion: "Ho Chi Minh City",
    title: "Cu Chi Tunnels",
    description: "Underground tunnel network used during the war",
    category: "history",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning"
  },
  {
    id: "hcmc-3",
    cityOrRegion: "Ho Chi Minh City",
    title: "Bến Thành Market",
    description: "Bustling central market for food and shopping",
    category: "food",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "morning"
  },
  {
    id: "hcmc-4",
    cityOrRegion: "Ho Chi Minh City",
    title: "Rooftop Bar District 1",
    description: "Evening drinks with city views",
    category: "night",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "evening"
  },
  // Hoi An
  {
    id: "hoian-1",
    cityOrRegion: "Hoi An",
    title: "Ancient Town Walking Tour",
    description: "Explore the UNESCO-listed old town",
    category: "anchor",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning"
  },
  {
    id: "hoian-2",
    cityOrRegion: "Hoi An",
    title: "Japanese Bridge",
    description: "Historic covered bridge in the old town",
    category: "culture",
    estimatedDurationHours: 0.5,
    recommendedTimeOfDay: "flexible"
  },
  {
    id: "hoian-3",
    cityOrRegion: "Hoi An",
    title: "Lantern Making Workshop",
    description: "Learn to make traditional lanterns",
    category: "culture",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "afternoon"
  },
  {
    id: "hoian-4",
    cityOrRegion: "Hoi An",
    title: "An Bàng Beach",
    description: "Relax on the beautiful beach",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "afternoon"
  },
  {
    id: "hoian-5",
    cityOrRegion: "Hoi An",
    title: "Cooking Class",
    description: "Learn to cook Vietnamese dishes",
    category: "food",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning"
  },
  // Phong Nha
  {
    id: "phongnha-1",
    cityOrRegion: "Phong Nha",
    title: "Paradise Cave Tour",
    description: "Explore one of the world's largest caves",
    category: "anchor",
    estimatedDurationHours: 4,
    recommendedTimeOfDay: "morning"
  },
  {
    id: "phongnha-2",
    cityOrRegion: "Phong Nha",
    title: "Dark Cave Adventure",
    description: "Zipline and mud bath in the cave",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "afternoon"
  },
  {
    id: "phongnha-3",
    cityOrRegion: "Phong Nha",
    title: "Bike Tour Countryside",
    description: "Cycle through rural villages",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning"
  },
  // Ninh Binh
  {
    id: "ninhbinh-1",
    cityOrRegion: "Ninh Binh",
    title: "Tam Cốc Boat Ride",
    description: "Scenic boat trip through karst landscape",
    category: "anchor",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "morning"
  },
  {
    id: "ninhbinh-2",
    cityOrRegion: "Ninh Binh",
    title: "Tràng An Scenic Complex",
    description: "Boat tour through caves and temples",
    category: "outdoors",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning"
  },
  {
    id: "ninhbinh-3",
    cityOrRegion: "Ninh Binh",
    title: "Bái Đính Temple",
    description: "Massive Buddhist temple complex",
    category: "culture",
    estimatedDurationHours: 2,
    recommendedTimeOfDay: "afternoon"
  },
  // Hanoi
  {
    id: "hanoi-1",
    cityOrRegion: "Hanoi",
    title: "Old Quarter Walking Tour",
    description: "Explore the historic 36 streets",
    category: "anchor",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "morning"
  },
  {
    id: "hanoi-2",
    cityOrRegion: "Hanoi",
    title: "Ho Chi Minh Mausoleum",
    description: "Visit the final resting place of Ho Chi Minh",
    category: "culture",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "morning"
  },
  {
    id: "hanoi-3",
    cityOrRegion: "Hanoi",
    title: "Temple of Literature",
    description: "Vietnam's first university",
    category: "culture",
    estimatedDurationHours: 1.5,
    recommendedTimeOfDay: "afternoon"
  },
  {
    id: "hanoi-4",
    cityOrRegion: "Hanoi",
    title: "Street Food Tour",
    description: "Sample local specialties with a guide",
    category: "food",
    estimatedDurationHours: 3,
    recommendedTimeOfDay: "evening"
  },
  {
    id: "hanoi-5",
    cityOrRegion: "Hanoi",
    title: "Water Puppet Show",
    description: "Traditional Vietnamese water puppetry",
    category: "culture",
    estimatedDurationHours: 1,
    recommendedTimeOfDay: "evening"
  },
  {
    id: "hanoi-6",
    cityOrRegion: "Hanoi",
    title: "Hạ Long Bay Day Trip",
    description: "Full day cruise to the famous bay",
    category: "anchor",
    estimatedDurationHours: 8,
    recommendedTimeOfDay: "morning"
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

