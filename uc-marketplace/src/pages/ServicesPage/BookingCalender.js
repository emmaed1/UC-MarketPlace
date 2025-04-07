import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import "./Services.css";

const sendBookingEmail = async (bookingDetails) => {
  const { date, time } = bookingDetails;
  const formData = new FormData();
  formData.append("access_key", "b130a017-569f-4325-990e-9c2b8def5889");
  formData.append("name", "Booking Confirmation");
  formData.append("email", "recipient@example.com");
  formData.append("message", `Booking Details: \nDate: ${date} \nTime: ${time}`);

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    return res.success;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const BookingCalendar = ({ onBookingConfirm, onClose, serviceAvailability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState({});

  // Ensure availability is properly handled
  const availability = Array.isArray(serviceAvailability) ? serviceAvailability : [];

  // Process available dates on component mount and when availability changes
  useEffect(() => {
    // Process availability data into a lookup object for better performance
    const datesLookup = {};
    
    availability.forEach(slot => {
      if (slot.date) {
        if (!datesLookup[slot.date]) {
          datesLookup[slot.date] = [];
        }
        datesLookup[slot.date].push(slot.time);
      }
    });
    
    setAvailableDates(datesLookup);
    
    // Add class to calendar for styling
    const calendarContainer = document.querySelector(".react-calendar");
    if (calendarContainer) {
      calendarContainer.classList.add("sleek-calendar");
    }
  }, [availability]);

  const getAvailableTimesForDay = (date) => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split("T")[0]; // format: yyyy-mm-dd
    
    // Only get times for the specific date (not day of week)
    const specificDateTimes = availableDates[dateStr] || [];
    
    return specificDateTimes.sort();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSlotClick = (time) => {
    setSelectedTime(time);
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
  };

  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;
    
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    
    // Check if this specific date has any available times
    const dateStr = date.toISOString().split("T")[0];
    
    // Only check for specific date availability
    const hasSpecificDateAvailability = availableDates[dateStr] && availableDates[dateStr].length > 0;
    
    return !hasSpecificDateAvailability;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    
    const dateStr = date.toISOString().split("T")[0];
    
    // Only check for specific date availability
    const hasSpecificDateAvailability = availableDates[dateStr] && availableDates[dateStr].length > 0;
    
    return hasSpecificDateAvailability ? "available-day" : null;
  };

  const formatMonthYear = (locale, date) =>
    date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const formatShortWeekday = (locale, date) =>
    date.toLocaleDateString("en-US", { weekday: "short" });

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        title: "Error",
        text: "Please select both a date and a time slot before confirming.",
        icon: "error",
        customClass: {
          container: "sleek-swal-container",
          popup: "sleek-swal-popup",
          title: "sleek-swal-title",
          confirmButton: "sleek-swal-confirm-button",
        },
        buttonsStyling: false,
      });
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString();
    const emailSent = await sendBookingEmail({
      date: formattedDate,
      time: selectedTime,
    });

    Swal.fire({
      title: emailSent ? "Booking Confirmed!" : "Booking Confirmed",
      text: emailSent
        ? `You have booked ${formattedDate} at ${selectedTime}. An email confirmation has been sent.`
        : `You have booked ${formattedDate} at ${selectedTime}. However, there was an issue sending the confirmation email.`,
      icon: emailSent ? "success" : "info",
      customClass: {
        container: "sleek-swal-container",
        popup: "sleek-swal-popup",
        title: "sleek-swal-title",
        confirmButton: "sleek-swal-confirm-button",
      },
      buttonsStyling: false,
    });

    onBookingConfirm?.({ date: formattedDate, time: selectedTime });
    onClose?.();
  };

  const getCurrentMonthStats = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let availableDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      if (date < today) continue; // Skip past dates
      
      const dateStr = date.toISOString().split("T")[0];
      
      // Only check for specific date availability
      const hasSpecificDateAvailability = availableDates[dateStr] && availableDates[dateStr].length > 0;
      
      if (hasSpecificDateAvailability) {
        availableDays++;
      }
    }

    return { total: daysInMonth, available: availableDays };
  };

  const monthStats = getCurrentMonthStats();

  return (
    <div className="booking-calendar sleek-booking-calendar">
      <div className="calendar-header">
        <h3>Select Appointment Date</h3>
        <div className="calendar-availability-indicator">
          <div className="availability-dot"></div>
          <span>{monthStats.available} days available this month</span>
        </div>
      </div>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        onActiveStartDateChange={handleActiveStartDateChange}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        formatMonthYear={formatMonthYear}
        formatShortWeekday={formatShortWeekday}
        minDate={new Date()}
        prevLabel={<span className="calendar-nav-arrow">←</span>}
        nextLabel={<span className="calendar-nav-arrow">→</span>}
        prev2Label={null}
        next2Label={null}
      />

      {selectedDate && (
        <div className="time-selection-container">
          <h3>
            <span className="date-indicator">{selectedDate.getDate()}</span>
            <span className="date-text">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </h3>

          <div className="time-slots-container">
            {getAvailableTimesForDay(selectedDate).length > 0 ? (
              <>
                <p className="time-selection-prompt">Select an available time slot:</p>
                <div className="time-slots">
                  {getAvailableTimesForDay(selectedDate).map((time) => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                      onClick={() => handleTimeSlotClick(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="no-slots-message">No available time slots for this day.</p>
            )}
          </div>

          {selectedTime && (
            <div className="booking-summary">
              <h4>Booking Summary</h4>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="summary-label">Date:</span>
                  <span className="summary-value">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Time:</span>
                  <span className="summary-value">{selectedTime}</span>
                </div>
              </div>
              <button className="confirm-button" onClick={confirmBooking}>
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;