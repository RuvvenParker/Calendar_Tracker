import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { fetchCategories, fetchEventById } from "../utils/fetchData";
import { db } from "../firebase";
import Event from "./Event";
import "./Calendar.css";

const Calendar = ({ weekDates, populateForm, setSelectedDateTime, selectedDateTime }) => {

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(""); // To track the current time
  const [currentDate, setCurrentDate] = useState(""); // To track the current date

  const times = Array.from({ length: 18 }, (_, i) =>
    String(5 + i).padStart(2, "0") + ":00"
  );

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    };

    const fetchEventsRealtime = () => {
      const colRef = collection(db, "Events");
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      });

      return unsubscribe; // Cleanup listener
    };

    fetchCategoriesData();
    const unsubscribe = fetchEventsRealtime();
    updateCurrentTime(); // Set initial current time

    const interval = setInterval(updateCurrentTime, 60000); // Update every minute

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const updateCurrentTime = () => {
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}:00`;
    const formattedDate = now.toISOString().split("T")[0];
    setCurrentTime(formattedTime);
    setCurrentDate(formattedDate);
  };

  const getEventColor = (eventCategory) => {
    const category = categories.find((cat) => cat.Category === eventCategory);
    return category ? category.Color : "#ccc"; // Default gray
  };

  const calculateDuration = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  };

  const handleEventClick = async (eventId) => {
    const eventData = await fetchEventById(eventId);
    populateForm(eventData); // Populate form fields
  };

  return (
    <div id="calendar-container" className="calendar-container">
      <div className="grid-header">
  <div className="time-slot-header"></div>
  {weekDates.map(({ dayName, displayDate }) => (
    <div
      key={displayDate}
      className={`day-header ${
        currentDate === displayDate ? "highlight-column" : ""
      }`}
    >
      {dayName} <br /> {displayDate}
    </div>
  ))}
</div>


      <div className="grid-body">
        {times.map((time) => (
          <React.Fragment key={time}>
            <div className="time-slot">{time}</div>
            {weekDates.map(({ date }) => (
              <div
              key={`${date}-${time}`}
              onClick={() =>
                setSelectedDateTime((prev) => ({
                  ...prev,
                  date,
                  startTime: time,
                }))
              }
              className={`grid-cell ${
                currentDate === date ? "highlight-column" : ""
              } ${currentDate === date && currentTime === time ? "highlight" : ""}`}
            >
            
            
              {events
                .filter((event) => {
                  const [eventStartHour] = event.startTime.split(":").map(Number);
                  const [slotHour] = time.split(":").map(Number);
            
                  return event.date === date && eventStartHour === slotHour;
                })
                .map((event) => (
                  <Event
                    key={event.id}
                    event={event}
                    getEventColor={getEventColor}
                    calculateDuration={calculateDuration}
                    onEventClick={handleEventClick}
                  />
                ))}
            </div>
            
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
