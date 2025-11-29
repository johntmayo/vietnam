import { useMemo, useState } from "react";
import {
  sampleCityStops,
  sampleActivities,
  generateDaysFromCityStops,
  getActivitiesForCity,
  calculateDayHours,
  getTimeBudgetStatus,
  suggestDayActivities,
  DAILY_TIME_BUDGET_HOURS,
  type Activity,
  type Day,
  type CityStop,
  type ActivityCategory,
  type DurationFilter,
  type TimeBudgetStatus
} from "./data/tripData";

type ViewMode = "cities" | "days";

export const App = () => {
  // Core state
  const [cityStops, setCityStops] = useState<CityStop[]>(sampleCityStops);
  const [allActivities, setAllActivities] = useState<Activity[]>(sampleActivities);
  const [days, setDays] = useState<Day[]>(() => generateDaysFromCityStops(sampleCityStops));
  const [selectedCity, setSelectedCity] = useState<string | null>(cityStops[0]?.name || null);
  const [viewMode, setViewMode] = useState<ViewMode>("cities");
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory | "all">("all");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("all");
  const [timeOfDayFilter, setTimeOfDayFilter] = useState<string>("all");
  
  // UI state
  const [showInterestedOnly, setShowInterestedOnly] = useState(false);

  // Get activities for selected city
  const cityActivities = useMemo(() => {
    if (!selectedCity) return [];
    let activities = getActivitiesForCity(allActivities, selectedCity);
    
    // Apply filters
    if (categoryFilter !== "all") {
      activities = activities.filter(a => a.category === categoryFilter);
    }
    
    if (durationFilter !== "all") {
      const range = durationFilter === "short" ? { min: 0, max: 2 } :
                     durationFilter === "medium" ? { min: 2, max: 4 } :
                     { min: 4, max: Infinity };
      activities = activities.filter(a => 
        a.estimatedDurationHours >= range.min && a.estimatedDurationHours < range.max
      );
    }
    
    if (timeOfDayFilter !== "all") {
      activities = activities.filter(a => 
        a.recommendedTimeOfDay === timeOfDayFilter || a.recommendedTimeOfDay === "flexible"
      );
    }
    
    if (showInterestedOnly) {
      activities = activities.filter(a => a.isInterested);
    }
    
    return activities;
  }, [selectedCity, allActivities, categoryFilter, durationFilter, timeOfDayFilter, showInterestedOnly]);

  // Get days for selected city
  const cityDays = useMemo(() => {
    if (!selectedCity) return [];
    return days.filter(d => d.cityOrRegion === selectedCity);
  }, [selectedCity, days]);

  // Toggle activity interest
  const toggleActivityInterest = (activityId: string) => {
    setAllActivities(prev => prev.map(a => 
      a.id === activityId ? { ...a, isInterested: !a.isInterested } : a
    ));
  };

  // Assign activity to a day
  const assignActivityToDay = (activityId: string, dayId: string) => {
    const activity = allActivities.find(a => a.id === activityId);
    if (!activity) return;

    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        // Check if already assigned
        if (day.scheduledActivities.some(a => a.id === activityId)) {
          return day;
        }
        
        // Check time budget
        const newTotal = calculateDayHours([...day.scheduledActivities, activity]);
        const status = getTimeBudgetStatus(newTotal);
        
        // Allow assignment even if overbooked (will show warning)
        const updatedActivities = [...day.scheduledActivities, activity];
        return {
          ...day,
          scheduledActivities: updatedActivities,
          totalScheduledHours: calculateDayHours(updatedActivities)
        };
      }
      return day;
    }));
  };

  // Remove activity from day
  const removeActivityFromDay = (activityId: string, dayId: string) => {
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        const updatedActivities = day.scheduledActivities.filter(a => a.id !== activityId);
        return {
          ...day,
          scheduledActivities: updatedActivities,
          totalScheduledHours: calculateDayHours(updatedActivities)
        };
      }
      return day;
    }));
  };

  // Move activity between days
  const moveActivityToDay = (activityId: string, fromDayId: string, toDayId: string) => {
    const activity = allActivities.find(a => a.id === activityId);
    if (!activity) return;

    setDays(prev => prev.map(day => {
      if (day.id === fromDayId) {
        return {
          ...day,
          scheduledActivities: day.scheduledActivities.filter(a => a.id !== activityId),
          totalScheduledHours: calculateDayHours(day.scheduledActivities.filter(a => a.id !== activityId))
        };
      }
      if (day.id === toDayId) {
        if (day.scheduledActivities.some(a => a.id === activityId)) {
          return day; // Already there
        }
        const updatedActivities = [...day.scheduledActivities, activity];
        return {
          ...day,
          scheduledActivities: updatedActivities,
          totalScheduledHours: calculateDayHours(updatedActivities)
        };
      }
      return day;
    }));
  };

  // Reorder activities in a day
  const reorderDayActivities = (dayId: string, activityIds: string[]) => {
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        const reordered = activityIds
          .map(id => day.scheduledActivities.find(a => a.id === id))
          .filter((a): a is Activity => a !== undefined);
        return {
          ...day,
          scheduledActivities: reordered,
          totalScheduledHours: calculateDayHours(reordered)
        };
      }
      return day;
    }));
  };

  // Suggest activities for a day
  const suggestActivitiesForDay = (dayId: string) => {
    const day = days.find(d => d.id === dayId);
    if (!day) return;

    const cityActivities = getActivitiesForCity(allActivities, day.cityOrRegion);
    const available = cityActivities.filter(a => 
      !day.scheduledActivities.some(sa => sa.id === a.id)
    );
    
    const suggested = suggestDayActivities(available, DAILY_TIME_BUDGET_HOURS);
    
    setDays(prev => prev.map(d => {
      if (d.id === dayId) {
        const updated = [...d.scheduledActivities, ...suggested];
        return {
          ...d,
          scheduledActivities: updated,
          totalScheduledHours: calculateDayHours(updated)
        };
      }
      return d;
    }));
  };

  return (
    <div className="app-root">
      <div className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Vietnam Trip Planner</h1>
          <p className="hero-subtitle">
            Build your perfect itinerary day by day. Select activities, assign them to days, and track your time budget.
          </p>
          
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "cities" ? "active" : ""}`}
              onClick={() => setViewMode("cities")}
            >
              By City
            </button>
            <button
              className={`view-btn ${viewMode === "days" ? "active" : ""}`}
              onClick={() => setViewMode("days")}
            >
              By Day
            </button>
          </div>
        </div>
      </div>

      <div className="shell">
        {/* City Navigation Sidebar */}
        <aside className="sidebar">
          <section className="card">
            <h2>📍 Your Route</h2>
            <div className="city-list">
              {cityStops.map((stop) => {
                const cityDays = days.filter(d => d.cityOrRegion === stop.name);
                const totalHours = cityDays.reduce((sum, day) => sum + day.totalScheduledHours, 0);
                const activityCount = cityDays.reduce((sum, day) => sum + day.scheduledActivities.length, 0);
                
                return (
                  <button
                    key={stop.id}
                    className={`city-button ${selectedCity === stop.name ? "active" : ""}`}
                    onClick={() => setSelectedCity(stop.name)}
                  >
                    <div className="city-button-header">
                      <span className="city-name">{stop.name}</span>
                      <span className="city-dates">
                        {new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                        {new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="city-stats">
                      <span>📅 {cityDays.length} days</span>
                      <span>🎯 {activityCount} activities</span>
                      <span>⏱️ {totalHours.toFixed(1)}h</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card">
            <h2>⏰ Time Budget</h2>
            <p className="muted">Daily limit: {DAILY_TIME_BUDGET_HOURS} hours</p>
            <div className="budget-summary">
              <div className="budget-stat">
                <span className="stat-label">📅 Total days</span>
                <span className="stat-value">{days.length}</span>
              </div>
              <div className="budget-stat">
                <span className="stat-label">🎯 Total activities</span>
                <span className="stat-value">
                  {days.reduce((sum, day) => sum + day.scheduledActivities.length, 0)}
                </span>
              </div>
            </div>
          </section>
        </aside>

        <main className="main">
          {viewMode === "cities" && selectedCity && (
            <div className="city-view">
              {/* Filters */}
              <div className="filters-panel">
                <div className="filter-group">
                  <label>Category</label>
                  <div className="pill-row">
                    {(["all", "food", "culture", "outdoors", "night", "anchor", "relax", "history"] as const).map(cat => (
                      <button
                        key={cat}
                        className={`pill ${categoryFilter === cat ? "pill-active" : ""}`}
                        onClick={() => setCategoryFilter(cat === "all" ? "all" : cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="filter-group">
                  <label>Duration</label>
                  <div className="pill-row">
                    {(["all", "short", "medium", "long"] as DurationFilter[]).map(dur => (
                      <button
                        key={dur}
                        className={`pill ${durationFilter === dur ? "pill-active" : ""}`}
                        onClick={() => setDurationFilter(dur)}
                      >
                        {dur} {dur !== "all" && dur === "short" ? "(<2h)" : dur === "medium" ? "(2-4h)" : "(4h+)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={showInterestedOnly}
                      onChange={(e) => setShowInterestedOnly(e.target.checked)}
                    />
                    Show interested only
                  </label>
                </div>
              </div>

              {/* Activities List */}
              <section className="panel">
                <h2>🎯 Activities in {selectedCity}</h2>
                <p className="muted">
                  {cityActivities.length} activities available. Check the box to mark as interested, or assign directly to a day.
                </p>
                <div className="activities-grid">
                  {cityActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      isInterested={activity.isInterested || false}
                      onToggleInterest={() => toggleActivityInterest(activity.id)}
                      onAssignToDay={(dayId) => assignActivityToDay(activity.id, dayId)}
                      availableDays={cityDays}
                    />
                  ))}
                </div>
              </section>

              {/* Days for this city */}
              <section className="panel">
                <h2>📅 Days in {selectedCity}</h2>
                <div className="days-list">
                  {cityDays.map((day) => (
                    <DayCard
                      key={day.id}
                      day={day}
                      onRemoveActivity={(activityId) => removeActivityFromDay(activityId, day.id)}
                      onSuggest={() => suggestActivitiesForDay(day.id)}
                      budget={DAILY_TIME_BUDGET_HOURS}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}

          {viewMode === "days" && (
            <section className="panel">
              <h2>📅 All Days</h2>
              <div className="days-list">
                {days.map((day) => (
                  <DayCard
                    key={day.id}
                    day={day}
                    onRemoveActivity={(activityId) => removeActivityFromDay(activityId, day.id)}
                    onSuggest={() => suggestActivitiesForDay(day.id)}
                    budget={DAILY_TIME_BUDGET_HOURS}
                  />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

// Activity Card Component
interface ActivityCardProps {
  activity: Activity;
  isInterested: boolean;
  onToggleInterest: () => void;
  onAssignToDay: (dayId: string) => void;
  availableDays: Day[];
}

const ActivityCard = ({ activity, isInterested, onToggleInterest, onAssignToDay, availableDays }: ActivityCardProps) => {
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  // Get appropriate Vietnam background image based on category
  const getCategoryImage = (category: string) => {
    const images: { [key: string]: string } = {
      food: "https://images.unsplash.com/photo-1555939594-58d7cb561b1d?w=800&q=80", // Vietnamese street food
      culture: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80", // Vietnamese temple
      outdoors: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Hiking trail
      night: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&q=80", // Night market
      anchor: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Halong Bay
      relax: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Beach/relaxation
      history: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80", // Historical site
      shopping: "https://images.unsplash.com/photo-1555939594-58d7cb561b1d?w=800&q=80" // Market scene
    };
    return images[category] || images.culture;
  };

  const cardStyle = {
    '--activity-bg-image': `url(${getCategoryImage(activity.category)})`
  } as React.CSSProperties;

  return (
    <div 
      className="activity-card"
      style={cardStyle}
    >
      <div className="activity-card-header">
        <label className="interest-checkbox">
          <input
            type="checkbox"
            checked={isInterested}
            onChange={onToggleInterest}
          />
          <span className="activity-title">{activity.title}</span>
        </label>
        <span className={`category-badge category-${activity.category}`}>
          {activity.category}
        </span>
      </div>
      <p className="activity-description">{activity.description}</p>
      <div className="activity-meta">
        <span className="duration-badge">{activity.estimatedDurationHours}h</span>
        {activity.recommendedTimeOfDay && activity.recommendedTimeOfDay !== "flexible" && (
          <span className="time-badge">{activity.recommendedTimeOfDay}</span>
        )}
      </div>
      <div className="activity-actions">
        <button
          className="assign-btn"
          onClick={() => setShowAssignMenu(!showAssignMenu)}
        >
          Assign to day ↓
        </button>
        {showAssignMenu && (
          <div className="assign-menu">
            {availableDays.map(day => (
              <button
                key={day.id}
                className="assign-option"
                onClick={() => {
                  onAssignToDay(day.id);
                  setShowAssignMenu(false);
                }}
              >
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Day Card Component
interface DayCardProps {
  day: Day;
  onRemoveActivity: (activityId: string) => void;
  onSuggest: () => void;
  budget: number;
}

const DayCard = ({ day, onRemoveActivity, onSuggest, budget }: DayCardProps) => {
  const status = getTimeBudgetStatus(day.totalScheduledHours, budget);
  const remainingHours = budget - day.totalScheduledHours;

  return (
    <div className={`day-card day-card-${status}`}>
      <div className="day-card-header">
        <div>
          <h3>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          <p className="muted">{day.cityOrRegion}</p>
        </div>
        <div className="time-meter">
          <div className="time-meter-bar">
            <div
              className={`time-meter-fill time-meter-${status}`}
              style={{ width: `${Math.min(100, (day.totalScheduledHours / budget) * 100)}%` }}
            />
          </div>
          <div className="time-meter-text">
            <span className={status === "overbooked" ? "warning" : ""}>
              {day.totalScheduledHours.toFixed(1)}h / {budget}h
            </span>
            {status === "overbooked" && (
              <span className="warning-text">Over by {Math.abs(remainingHours).toFixed(1)}h</span>
            )}
            {status === "underbooked" && (
              <span className="info-text">{remainingHours.toFixed(1)}h free</span>
            )}
          </div>
        </div>
      </div>

      <div className="day-activities">
        {day.scheduledActivities.length === 0 ? (
          <p className="empty-day">No activities scheduled. Click "Suggest a day" to get started!</p>
        ) : (
          day.scheduledActivities.map((activity, index) => (
            <div key={activity.id} className="scheduled-activity">
              <div className="activity-order">{index + 1}</div>
              <div className="activity-details">
                <span className="activity-name">{activity.title}</span>
                <span className="activity-duration">{activity.estimatedDurationHours}h</span>
              </div>
              <button
                className="remove-btn-small"
                onClick={() => onRemoveActivity(activity.id)}
                aria-label="Remove activity"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <button className="suggest-btn" onClick={onSuggest}>
        <span>✨ Suggest Activities for This Day</span>
      </button>
    </div>
  );
};
