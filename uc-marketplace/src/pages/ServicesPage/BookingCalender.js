import React, { useState } from "react"; 
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

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  }).then((res) => res.json());

  if (res.success) {
    console.log("Booking email sent successfully");
  } else {
    console.log("Error sending booking email");
  }
};

// Main BookingCalendar component
const BookingCalendar = ({ onBookingConfirm, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSlotClick = (time) => {
    setSelectedTime(time);
  };

  const confirmBooking = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.toLocaleDateString();

      // Send booking email
      sendBookingEmail({ date: formattedDate, time: selectedTime });

      // Show confirmation alert
      Swal.fire({
        title: "Booking Confirmed!",
        text: `You have booked ${formattedDate} at ${selectedTime}. An email confirmation has been sent.`,
        icon: "success",
      });

      // Notify parent component and close calendar
      onBookingConfirm?.({ date: formattedDate, time: selectedTime });
      onClose();  // Close the calendar modal after booking is confirmed
    } else {
      Swal.fire({
        title: "Error",
        text: "Please select both a date and a time slot before confirming.",
        icon: "error",
      });
    }
  };

  return (
    <div className="booking-calendar">
      <h3>Select a Date</h3>
      <Calendar onChange={handleDateChange} value={selectedDate} />
      {selectedDate && (
        <>
          <h3>Available Time Slots</h3>
          <div className="time-slots">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                onClick={() => handleTimeSlotClick(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <button className="confirm-button" onClick={confirmBooking}>
            Confirm Booking
          </button>
        </>
      )}
    </div>
  );
};

export default BookingCalendar;
