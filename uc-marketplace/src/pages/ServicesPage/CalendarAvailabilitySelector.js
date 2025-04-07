import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-availability.css";

const CalendarAvailabilitySelector = ({ availability, setAvailability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" or "timeSlots"
  
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  // Helper function to convert Date to YYYY-MM-DD format
  const formatDateToString = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };
  
  // Check if a date has any time slots selected
  const hasTimeSlots = (date) => {
    if (!date) return false;
    const dateStr = formatDateToString(date);
    return availability.some(slot => slot.date === dateStr);
  };

  // Get selected time slots for a specific date
  const getTimeSlotsForDate = (date) => {
    if (!date) return [];
    const dateStr = formatDateToString(date);
    return availability
      .filter(slot => slot.date === dateStr)
      .map(slot => slot.time);
  };

  // Handle date selection in calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setViewMode("timeSlots");
  };

  // Toggle a time slot for the selected date
  const toggleTimeSlot = (time) => {
    const dateStr = formatDateToString(selectedDate);
    
    setAvailability(prev => {
      // Check if this exact slot exists
      const slotExists = prev.some(
        slot => slot.date === dateStr && slot.time === time
      );
      
      if (slotExists) {
        // Remove the slot
        return prev.filter(
          slot => !(slot.date === dateStr && slot.time === time)
        );
      } else {
        // Add the slot - NOTE: Removed day property to prevent day-of-week availability
        return [...prev, { date: dateStr, time }];
      }
    });
  };

  // Custom tile class to show which dates have availability
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    
    const dateStr = formatDateToString(date);
    const hasAvailability = availability.some(slot => slot.date === dateStr);
    
    if (hasAvailability) return "has-availability";
    return null;
  };

  // Return to calendar view
  const backToCalendar = () => {
    setViewMode("calendar");
    setSelectedDate(null);
  };

  // Remove all time slots for a date
  const clearDate = () => {
    if (!selectedDate) return;
    
    const dateStr = formatDateToString(selectedDate);
    setAvailability(prev => 
      prev.filter(slot => slot.date !== dateStr)
    );
    
    // Return to calendar after clearing
    backToCalendar();
  };

  // Format the date for display
  const formatDateForDisplay = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Get all dates with availability for summary display
  const getDatesWithAvailability = () => {
    const dateMap = {};
    
    availability.forEach(slot => {
      if (!dateMap[slot.date]) {
        dateMap[slot.date] = [];
      }
      dateMap[slot.date].push(slot.time);
    });
    
    return Object.entries(dateMap).map(([date, times]) => ({
      date,
      times
    }));
  };

  return (
    <div className="calendar-availability-container">
      {viewMode === "calendar" ? (
        <>
          <div className="calendar-wrapper">
            <Calendar 
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
                {getDatesWithAvailability().map(item => (
                  <div key={item.date} className="summary-item">
                    <div className="summary-date">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </div>
                    <div className="summary-times">
                      {item.times.sort().join(", ")}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                type="button"
                className="clear-all-btn"
                onClick={() => setAvailability([])}
              >
                Clear All Availability
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="time-slots-selection">
          <div className="time-slots-header">
            <button 
              type="button"
              className="back-btn"
              onClick={backToCalendar}
            >
              &larr; Back to Calendar
            </button>
            <h3>{formatDateForDisplay(selectedDate)}</h3>
            {hasTimeSlots(selectedDate) && (
              <button 
                type="button"
                className="clear-btn"
                onClick={clearDate}
              >
                Clear This Date
              </button>
            )}
          </div>
          
          <div className="time-slots-grid">
            {timeSlots.map(time => (
              <button
                key={time}
                type="button"
                className={`time-slot-btn ${
                  getTimeSlotsForDate(selectedDate).includes(time) ? "selected" : ""
                }`}
                onClick={() => toggleTimeSlot(time)}
              >
                {time}
              </button>
            ))}
          </div>
          
          <div className="actions">
            <button 
              type="button"
              className="done-btn"
              onClick={backToCalendar}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarAvailabilitySelector;