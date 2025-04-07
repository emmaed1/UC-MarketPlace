import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-availability.css";

const CalendarAvailabilitySelector = ({ availability, setAvailability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const normalizeToLocalDate = (date) => {
    const local = new Date(date);
    local.setHours(0, 0, 0, 0);
    return local;
  };

  const formatDateToString = (date) => {
    const localDate = normalizeToLocalDate(date);
    return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
  };

  const hasTimeSlots = (date) => {
    if (!date) return false;
    const dateStr = formatDateToString(date);
    return availability.some(slot => slot.date === dateStr);
  };

  const getTimeSlotsForDate = (date) => {
    if (!date) return [];
    const dateStr = formatDateToString(date);
    return availability.filter(slot => slot.date === dateStr).map(slot => slot.time);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(normalizeToLocalDate(date));
    setViewMode("timeSlots");
  };

  const toggleTimeSlot = (time) => {
    const dateStr = formatDateToString(selectedDate);
    setAvailability(prev => {
      const exists = prev.some(slot => slot.date === dateStr && slot.time === time);
      if (exists) {
        return prev.filter(slot => !(slot.date === dateStr && slot.time === time));
      } else {
        return [...prev, { date: dateStr, time }];
      }
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = formatDateToString(date);
    return availability.some(slot => slot.date === dateStr) ? "has-availability" : null;
  };

  const backToCalendar = () => {
    setViewMode("calendar");
    setSelectedDate(null);
  };

  const clearDate = () => {
    if (!selectedDate) return;
    const dateStr = formatDateToString(selectedDate);
    setAvailability(prev => prev.filter(slot => slot.date !== dateStr));
    backToCalendar();
  };

  const formatDateForDisplay = (date) => {
    return normalizeToLocalDate(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getDatesWithAvailability = () => {
    const grouped = {};
    availability.forEach(slot => {
      if (!grouped[slot.date]) grouped[slot.date] = [];
      grouped[slot.date].push(slot.time);
    });
    return Object.entries(grouped).map(([date, times]) => ({ date, times }));
  };

  return (
    <div className="calendar-availability-container">
      {viewMode === "calendar" ? (
        <>
          <div className="calendar-wrapper">
            <Calendar
              calendarType="gregory"
              onChange={handleDateSelect}
              value={selectedDate}
              tileClassName={tileClassName}
              minDate={new Date()}
            />
          </div>

          {availability.length > 0 && (
            <div className="availability-summary">
              <h4>Your Availability Summary</h4>
              <div className="summary-list">
                {getDatesWithAvailability().map(({ date, times }) => {
                  const [y, m, d] = date.split("-").map(Number);
                  const localDate = new Date(y, m - 1, d);
                  return (
                    <div key={date} className="summary-item">
                      <div className="summary-date">
                        {localDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric"
                        })}
                      </div>
                      <div className="summary-times">
                        {times.sort().join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button type="button" className="clear-all-btn" onClick={() => setAvailability([])}>
                Clear All Availability
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="time-slots-selection">
          <div className="time-slots-header">
            <button type="button" className="back-btn" onClick={backToCalendar}>
              ← Back to Calendar
            </button>
            <h3>{formatDateForDisplay(selectedDate)}</h3>
            {hasTimeSlots(selectedDate) && (
              <button type="button" className="clear-btn" onClick={clearDate}>
                Clear This Date
              </button>
            )}
          </div>

          <div className="time-slots-grid">
            {timeSlots.map(time => (
              <button
                key={time}
                type="button"
                className={`time-slot-btn ${getTimeSlotsForDate(selectedDate).includes(time) ? "selected" : ""}`}
                onClick={() => toggleTimeSlot(time)}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="actions">
            <button type="button" className="done-btn" onClick={backToCalendar}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarAvailabilitySelector;
