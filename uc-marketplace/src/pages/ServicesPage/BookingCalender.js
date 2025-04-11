// BookingCalendar.jsx (timezone-safe version)
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

const formatDateToString = (date) => {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`;
};

const BookingCalendar = ({ onBookingConfirm, onClose, serviceAvailability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState({});

  const availability = Array.isArray(serviceAvailability) ? serviceAvailability : [];

  useEffect(() => {
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
  }, [availability]);

  const getAvailableTimesForDay = (date) => {
    if (!date) return [];
    const dateStr = formatDateToString(date);
    return (availableDates[dateStr] || []).sort();
  };

  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    const dateStr = formatDateToString(date);
    return !(availableDates[dateStr]?.length > 0);
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = formatDateToString(date);
    return availableDates[dateStr]?.length > 0 ? "available-day" : null;
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        title: "Error",
        text: "Please select both a date and a time slot before confirming.",
        icon: "error"
      });
      return;
    }

    const formattedDate = formatDateToString(selectedDate);
    const emailSent = await sendBookingEmail({ date: formattedDate, time: selectedTime });

    Swal.fire({
      title: emailSent ? "Booking Confirmed!" : "Booking Confirmed",
      text: emailSent
        ? `You have booked ${formattedDate} at ${selectedTime}. Email sent.`
        : `You have booked ${formattedDate} at ${selectedTime}. Email failed.`,
      icon: emailSent ? "success" : "info"
    });

    onBookingConfirm?.({ date: formattedDate, time: selectedTime });
    onClose?.();
  };

  return (
    <div className="booking-calendar sleek-booking-calendar">
      <div className="calendar-header">
        <h3>Select Appointment Date</h3>
        <div className="calendar-availability-indicator">
          <div className="availability-dot"></div>
          <span>{Object.keys(availableDates).length} days available this month</span>
        </div>
      </div>

      <Calendar
        onChange={(date) => {
          setSelectedDate(date);
          setSelectedTime(null);
        }}
        value={selectedDate}
        onActiveStartDateChange={({ activeStartDate }) => setCurrentMonth(activeStartDate)}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        formatMonthYear={(locale, date) => date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        formatShortWeekday={(locale, date) => date.toLocaleDateString("en-US", { weekday: "short" })}
        minDate={new Date()}
      />

      {selectedDate && (
        <div className="time-selection-container">
          <h3>{selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
          <div className="time-slots-container">
            {getAvailableTimesForDay(selectedDate).length > 0 ? (
              <>
                <p>Select an available time slot:</p>
                <div className="time-slots">
                  {getAvailableTimesForDay(selectedDate).map((time) => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                      onClick={() => setSelectedTime(time)}
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
              <p>Date: {selectedDate.toLocaleDateString()}</p>
              <p>Time: {selectedTime}</p>
              <button className="confirm-button" onClick={confirmBooking}>Confirm Booking</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
