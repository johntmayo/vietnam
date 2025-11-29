// Utility to parse content from the Vietnam Journey document
// Handles various formats: sections, bullet points, recommendations, etc.

import { DetailedActivity, CityInsights, RegionGuide } from "../data/vietnamJourneyContent";
import { ActivityCategory, Activity } from "../data/tripData";

export function parseTextToActivities(text: string, cityName: string): DetailedActivity[] {
  const activities: DetailedActivity[] = [];
  
  // Parse patterns like:
  // - Activity Name (2h) - description
  // * Activity Name - description
  // Activity Name: description
  
  const lines = text.split('\n').filter(line => line.trim());
  
  lines.forEach((line, index) => {
    // Try to extract activity information
    const activityMatch = line.match(/(?:[-*•]|^\d+\.)\s*(.+?)(?:\s*\((\d+(?:\.\d+)?)h?\))?(?:\s*[-–—]\s*(.+))?/i);
    
    if (activityMatch) {
      const title = activityMatch[1].trim();
      const hours = activityMatch[2] ? parseFloat(activityMatch[2]) : 2;
      const description = activityMatch[3]?.trim() || title;
      
      // Try to infer category from title/description
      const category = inferCategory(title + " " + description);
      
      activities.push({
        id: `${cityName.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        cityOrRegion: cityName,
        title,
        description,
        category,
        estimatedDurationHours: hours,
        recommendedTimeOfDay: "flexible"
      });
    }
  });
  
  return activities;
}

function inferCategory(text: string): ActivityCategory {
  const lower = text.toLowerCase();
  if (lower.match(/(food|eat|restaurant|market|street food|pho|banh)/)) return "food";
  if (lower.match(/(temple|pagoda|museum|history|historical|war|citadel)/)) return "history";
  if (lower.match(/(hike|trek|bike|kayak|outdoor|nature|trail|mountain)/)) return "outdoors";
  if (lower.match(/(beach|relax|spa|pool|resort)/)) return "relax";
  if (lower.match(/(bar|night|club|rooftop|nightlife)/)) return "night";
  if (lower.match(/(culture|cultural|traditional|village|local)/)) return "culture";
  if (lower.match(/(must|essential|highlight|main|anchor)/)) return "anchor";
  if (lower.match(/(shop|market|buy|souvenir)/)) return "shopping";
  return "culture";
}

export function parseCityInsights(text: string, cityName: string): CityInsights {
  const insights: CityInsights = {
    cityName
  };
  
  // Parse sections like:
  // Overview: ...
  // Best Time: ...
  // Food Highlights: ...
  
  const sections = text.split(/(?=^[A-Z][^:]+:)/m);
  
  sections.forEach(section => {
    const [header, ...content] = section.split(':');
    const contentText = content.join(':').trim();
    
    if (header.toLowerCase().includes('overview')) {
      insights.overview = contentText;
    } else if (header.toLowerCase().includes('best time')) {
      insights.bestTimeToVisit = contentText;
    } else if (header.toLowerCase().includes('food')) {
      insights.foodHighlights = contentText.split(/[•\-\*]/).map(s => s.trim()).filter(Boolean);
    } else if (header.toLowerCase().includes('culture')) {
      insights.culturalNotes = contentText.split(/[•\-\*]/).map(s => s.trim()).filter(Boolean);
    }
  });
  
  return insights;
}

