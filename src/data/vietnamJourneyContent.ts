// Rich content from "Vietnam Journey: Classic Highlights & Offbeat Adventures"
// This file will be populated with content from the Word document

import { Activity, ActivityCategory } from "./tripData";

export interface DetailedActivity extends Activity {
  // Extended fields for rich content
  detailedDescription?: string;
  bestTimeToVisit?: string;
  tips?: string[];
  nearbyAttractions?: string[];
  costEstimate?: string;
  difficulty?: "easy" | "moderate" | "challenging";
  offbeat?: boolean; // Marked as offbeat adventure
  classic?: boolean; // Marked as classic highlight
}

export interface CityInsights {
  cityName: string;
  overview?: string;
  bestTimeToVisit?: string;
  transportation?: string;
  accommodation?: string;
  foodHighlights?: string[];
  culturalNotes?: string[];
  offbeatSpots?: string[];
  classicMustSees?: string[];
}

export interface RegionGuide {
  region: "North" | "Central" | "South";
  overview?: string;
  weatherNotes?: string;
  transportation?: string;
  highlights?: string[];
}

// Placeholder - will be populated with actual content from the document
export const vietnamJourneyContent: {
  cityInsights: CityInsights[];
  regionGuides: RegionGuide[];
  detailedActivities: DetailedActivity[];
} = {
  cityInsights: [],
  regionGuides: [],
  detailedActivities: []
};

// Function to parse text content and populate the data structure
export function parseJourneyContent(textContent: string): void {
  // This will parse structured text and populate the data
  // Format expected: sections with headers, bullet points, etc.
  // Implementation will depend on the actual document structure
}

