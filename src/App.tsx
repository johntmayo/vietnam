import { useMemo, useState, useEffect } from "react";
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
  type TimeBudgetStatus,
  type TimeOfDay
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
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [editingCityStop, setEditingCityStop] = useState<CityStop | null>(null);
  const [newActivityCity, setNewActivityCity] = useState<string | null>(null);

  // Lock body scroll when modals are open (mobile optimization)
  useEffect(() => {
    const isModalOpen = showAddActivityModal || showAddCityModal || editingCityStop !== null;
    if (isModalOpen) {
      document.body.classList.add('modal-open');
      // Prevent background scroll on iOS
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showAddActivityModal, showAddCityModal, editingCityStop]);

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

  // Create a new custom activity
  const createCustomActivity = (activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isInterested: false
    };
    setAllActivities(prev => [...prev, newActivity]);
    setShowAddActivityModal(false);
    setNewActivityCity(null);
  };

  // Add a new city stop
  const addCityStop = (cityData: Omit<CityStop, 'id'>) => {
    const newStop: CityStop = {
      ...cityData,
      id: `city-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedStops = [...cityStops, newStop].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    setCityStops(updatedStops);
    
    // Regenerate days
    const newDays = generateDaysFromCityStops(updatedStops);
    setDays(newDays);
    
    setShowAddCityModal(false);
  };

  // Update city stop dates
  const updateCityStop = (stopId: string, updates: Partial<CityStop>) => {
    const updatedStops = cityStops.map(stop => 
      stop.id === stopId ? { ...stop, ...updates } : stop
    ).sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    setCityStops(updatedStops);
    
    // Regenerate days when dates change
    if (updates.startDate || updates.endDate || updates.name) {
      const newDays = generateDaysFromCityStops(updatedStops);
      setDays(newDays);
    }
    
    setEditingCityStop(null);
  };

  // Delete a city stop
  const deleteCityStop = (stopId: string) => {
    const stop = cityStops.find(s => s.id === stopId);
    if (!stop) return;
    
    setCityStops(prev => prev.filter(s => s.id !== stopId));
    setDays(prev => prev.filter(d => d.cityOrRegion !== stop.name));
    setAllActivities(prev => prev.filter(a => a.cityOrRegion !== stop.name));
    
    if (selectedCity === stop.name) {
      const remaining = cityStops.filter(s => s.id !== stopId);
      setSelectedCity(remaining[0]?.name || null);
    }
  };

  // Calculate number of days for a city stop
  const getDaysForStop = (stop: CityStop): number => {
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>📍 Your Route</h2>
              <button
                className="add-btn-small"
                onClick={() => setShowAddCityModal(true)}
                title="Add new city stop"
              >
                + Add Stop
              </button>
            </div>
            <div className="city-list">
              {cityStops.map((stop) => {
                const cityDays = days.filter(d => d.cityOrRegion === stop.name);
                const totalHours = cityDays.reduce((sum, day) => sum + day.totalScheduledHours, 0);
                const activityCount = cityDays.reduce((sum, day) => sum + day.scheduledActivities.length, 0);
                const numDays = getDaysForStop(stop);
                
                return (
                  <div key={stop.id} className="city-button-wrapper">
                    <button
                      className={`city-button ${selectedCity === stop.name ? "active" : ""}`}
                      onClick={() => setSelectedCity(stop.name)}
                    >
                      <div className="city-button-header">
                        <span className="city-name">{stop.name}</span>
                        <span className="city-dates">
                          {new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - 
                          {new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="city-stats">
                        <span>📅 {numDays} days</span>
                        <span>🎯 {activityCount} activities</span>
                        <span>⏱️ {totalHours.toFixed(1)}h</span>
                      </div>
                    </button>
                    <div className="city-actions">
                      <button
                        className="edit-btn-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCityStop(stop);
                        }}
                        title="Edit dates"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete ${stop.name}? This will also remove all activities in this city.`)) {
                            deleteCityStop(stop.id);
                          }
                        }}
                        title="Delete stop"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h2>🎯 Activities in {selectedCity}</h2>
                    <p className="muted">
                      {cityActivities.length} activities available. Check the box to mark as interested, or assign directly to a day.
                    </p>
                  </div>
                  <button
                    className="add-btn"
                    onClick={() => {
                      setNewActivityCity(selectedCity);
                      setShowAddActivityModal(true);
                    }}
                  >
                    + Create Activity
                  </button>
                </div>
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

      {/* Add City Stop Modal */}
      {showAddCityModal && (
        <AddCityModal
          onClose={() => setShowAddCityModal(false)}
          onSave={(cityData) => addCityStop(cityData)}
          existingStops={cityStops}
        />
      )}

      {/* Edit City Stop Modal */}
      {editingCityStop && (
        <EditCityModal
          cityStop={editingCityStop}
          onClose={() => setEditingCityStop(null)}
          onSave={(updates) => updateCityStop(editingCityStop.id, updates)}
        />
      )}

      {/* Add Activity Modal */}
      {showAddActivityModal && newActivityCity && (
        <AddActivityModal
          cityName={newActivityCity}
          onClose={() => {
            setShowAddActivityModal(false);
            setNewActivityCity(null);
          }}
          onSave={(activityData) => createCustomActivity(activityData)}
        />
      )}
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

// Add City Stop Modal Component
interface AddCityModalProps {
  onClose: () => void;
  onSave: (cityData: Omit<CityStop, 'id'>) => void;
  existingStops: CityStop[];
}

const AddCityModal = ({ onClose, onSave, existingStops }: AddCityModalProps) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [numDays, setNumDays] = useState(2);
  const [region, setRegion] = useState<"North" | "Central" | "South" | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate) return;
    
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + numDays - 1);
    
    onSave({
      name,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      region: region || undefined
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Add New City Stop</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>City Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Da Nang, Hue, Sapa"
              required
              autoComplete="off"
              inputMode="text"
            />
          </div>
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Number of Days *</label>
            <input
              type="number"
              min="1"
              value={numDays}
              onChange={(e) => setNumDays(parseInt(e.target.value) || 1)}
              required
            />
            <small>End date will be: {startDate && (() => {
              const start = new Date(startDate);
              const end = new Date(start);
              end.setDate(end.getDate() + numDays - 1);
              return end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            })()}</small>
          </div>
          <div className="form-group">
            <label>Region (optional)</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as any)}
            >
              <option value="">Select region</option>
              <option value="North">North</option>
              <option value="Central">Central</option>
              <option value="South">South</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add City Stop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit City Stop Modal Component
interface EditCityModalProps {
  cityStop: CityStop;
  onClose: () => void;
  onSave: (updates: Partial<CityStop>) => void;
}

const EditCityModal = ({ cityStop, onClose, onSave }: EditCityModalProps) => {
  const [name, setName] = useState(cityStop.name);
  const [startDate, setStartDate] = useState(cityStop.startDate);
  const [numDays, setNumDays] = useState(() => {
    const start = new Date(cityStop.startDate);
    const end = new Date(cityStop.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  });
  const [region, setRegion] = useState<"North" | "Central" | "South" | "">(cityStop.region || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + numDays - 1);
    
    onSave({
      name,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      region: region || undefined
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Edit City Stop</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>City Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="off"
              inputMode="text"
            />
          </div>
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              inputMode="none"
            />
          </div>
          <div className="form-group">
            <label>Number of Days *</label>
            <input
              type="number"
              min="1"
              value={numDays}
              onChange={(e) => setNumDays(parseInt(e.target.value) || 1)}
              required
              inputMode="numeric"
            />
            <small>End date will be: {(() => {
              const start = new Date(startDate);
              const end = new Date(start);
              end.setDate(end.getDate() + numDays - 1);
              return end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            })()}</small>
          </div>
          <div className="form-group">
            <label>Region (optional)</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as any)}
            >
              <option value="">Select region</option>
              <option value="North">North</option>
              <option value="Central">Central</option>
              <option value="South">South</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Activity Modal Component
interface AddActivityModalProps {
  cityName: string;
  onClose: () => void;
  onSave: (activityData: Omit<Activity, 'id'>) => void;
}

const AddActivityModal = ({ cityName, onClose, onSave }: AddActivityModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("culture");
  const [duration, setDuration] = useState(2);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("flexible");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    onSave({
      cityOrRegion: cityName,
      title,
      description,
      category,
      estimatedDurationHours: duration,
      recommendedTimeOfDay: timeOfDay,
      notes: notes || undefined,
      isInterested: false
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Create Activity in {cityName}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Activity Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Visit Local Market"
              required
              autoComplete="off"
              inputMode="text"
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you'll do..."
              rows={4}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                required
              >
                <option value="food">Food</option>
                <option value="culture">Culture</option>
                <option value="outdoors">Outdoors</option>
                <option value="night">Night</option>
                <option value="anchor">Anchor</option>
                <option value="relax">Relax</option>
                <option value="history">History</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration (hours) *</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
                required
                inputMode="decimal"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Best Time of Day</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
            >
              <option value="flexible">Flexible</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional tips or information..."
              rows={2}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
