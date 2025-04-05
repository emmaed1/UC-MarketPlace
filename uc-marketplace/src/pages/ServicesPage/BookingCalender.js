import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import "./Services.css";

// Function to send booking email
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
    
    if (res.success) {
      console.log("Booking email sent successfully");
      return true;
    } else {
      console.log("Error sending booking email");
      return false;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const BookingCalendar = ({ onBookingConfirm, onClose, serviceAvailability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Default availability if none is provided
  const defaultAvailability = [
    { day: "Monday", time: "9:00 AM" },
    { day: "Monday", time: "10:00 AM" },
    { day: "Monday", time: "11:00 AM" },
    { day: "Wednesday", time: "1:00 PM" },
    { day: "Wednesday", time: "2:00 PM" },
    { day: "Friday", time: "3:00 PM" },
    { day: "Friday", time: "4:00 PM" }
  ];
  
  // Use the provided availability or fall back to default
  const availability = serviceAvailability || defaultAvailability;
  
  useEffect(() => {
    // Add custom classes to calendar for styling
    const addCustomClasses = () => {
      const calendarContainer = document.querySelector('.react-calendar');
      if (calendarContainer) {
        calendarContainer.classList.add('sleek-calendar');
      }
    };
    
    addCustomClasses();
    // Add event listener for calendar navigation
    document.addEventListener('click', addCustomClasses);
    
    return () => {
      document.removeEventListener('click', addCustomClasses);
    };
  }, []);
  
  const getAvailableTimesForDay = (date) => {
    if (!date) return [];
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    const availableTimes = availability
      .filter(slot => slot.day === dayOfWeek)
      .map(slot => slot.time);
      
    return availableTimes;
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
  
  // Function to check if a date should be disabled
  const tileDisabled = ({ date, view }) => {
    // Disable dates in the past
    if (date < new Date().setHours(0, 0, 0, 0)) {
      return true;
    }
    
    // Only check day availability if we're viewing days
    if (view === 'month') {
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      // Disable days with no available time slots
      const hasTimeSlots = availability.some(slot => slot.day === dayOfWeek);
      return !hasTimeSlots;
    }
    
    return false;
  };
  
  // Function to add custom class names to calendar tiles
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hasTimeSlots = availability.some(slot => slot.day === dayOfWeek);
      
      if (hasTimeSlots) {
        return 'available-day';
      }
    }
    return null;
  };
  
  const formatMonthYear = (locale, date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const formatShortWeekday = (locale, date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  const confirmBooking = async () => {
    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.toLocaleDateString();
      
      // Send booking email
      const emailSent = await sendBookingEmail({ date: formattedDate, time: selectedTime });
      
      if (emailSent) {
        Swal.fire({
          title: "Booking Confirmed!",
          text: `You have booked ${formattedDate} at ${selectedTime}. An email confirmation has been sent.`,
          icon: "success",
          customClass: {
            container: 'sleek-swal-container',
            popup: 'sleek-swal-popup',
            title: 'sleek-swal-title',
            confirmButton: 'sleek-swal-confirm-button'
          },
          buttonsStyling: false
        });
      } else {
        Swal.fire({
          title: "Booking Confirmed",
          text: `You have booked ${formattedDate} at ${selectedTime}. However, there was an issue sending the confirmation email.`,
          icon: "info",
          customClass: {
            container: 'sleek-swal-container',
            popup: 'sleek-swal-popup',
            title: 'sleek-swal-title',
            confirmButton: 'sleek-swal-confirm-button'
          },
          buttonsStyling: false
        });
      }
      
      // Notify parent component and close calendar
      onBookingConfirm?.({ date: formattedDate, time: selectedTime });
      onClose();
    } else {
      Swal.fire({
        title: "Error",
        text: "Please select both a date and a time slot before confirming.",
        icon: "error",
        customClass: {
          container: 'sleek-swal-container',
          popup: 'sleek-swal-popup',
          title: 'sleek-swal-title',
          confirmButton: 'sleek-swal-confirm-button'
        },
        buttonsStyling: false
      });
    }
  };
  
  // Get current month available days count for visual indicator
  const getCurrentMonthStats = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let availableDays = 0;
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hasTimeSlots = availability.some(slot => slot.day === dayOfWeek);
      
      if (hasTimeSlots && date >= new Date().setHours(0, 0, 0, 0)) {
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
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long',
                day: 'numeric'
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
                  <span className="summary-value">{selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
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