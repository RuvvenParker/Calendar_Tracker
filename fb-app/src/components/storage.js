// .event {
//     position: absolute; /* Allow positioning relative to grid-cell */
//     border-radius: 8px;
//     padding: 5px; /* Ensure consistent padding */
//     color: #000000;
//     text-align: center;
//     font-size: 0.8rem;
//     word-wrap: break-word;
//     /* display: flex; Use flexbox for better content alignment */
//     flex-direction: column; /* Stack content vertically */
//     justify-content: space-between; /* Distribute content evenly */
//     align-items: center; /* Center content horizontally */
//     width: calc(100% - 30px); /* Ensure it spans the grid cell width, accounting for padding */
//     left: 5px; /* Align to the left with padding */
//     transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth animation */
//     z-index: 1; /* Ensure it's above other elements */
//     overflow: hidden; /* Prevent content overflow */
//   }

import React from "react";
import { darkenHex } from "./eventAttribute";

const Event = ({
  event,
  getEventColor,
  calculateDuration,
  gridSlotHeight = 50,
  padding = 5,
  onEventClick,
}) => {
  const duration = calculateDuration(event.startTime, event.endTime);

  // Extract minutes from the startTime to offset the event position
  const [startHour, startMinute] = event.startTime.split(":").map(Number);

  // Helper to check if the task is overdue
  const isTaskOverdue = (taskDate, endTime) => {
    const currentTime = new Date();
    const [year, month, day] = taskDate.split("-").map(Number); // Date: YYYY-MM-DD
    const [hour, minute] = endTime.split(":").map(Number); // Time: HH:mm
    const taskEndTime = new Date(year, month - 1, day, hour, minute); // Month is 0-indexed
    return taskEndTime < currentTime;
  };

  function durationconv(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60); // Extract hours
    const minutes = totalMinutes % 60; // Remainder for minutes
    if (minutes > 0 && hours > 1) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0 && hours < 1) {
      return `${minutes}m`;
    } else {
      return `${hours}h`;
    }
  }

  // Get category colors
  const selectedCategories = Array.isArray(event.category)
    ? event.category
    : [event.category];

  const categoryColors = selectedCategories.map((cat) => getEventColor(cat));

  // Determine background style
  let backgroundStyle;
  let textColor = "black";
  let eventOpacity = 1;

  if (isTaskOverdue(event.date, event.endTime)) {
    if (!event.fulfilled) {
      // Overdue and unfulfilled
      backgroundStyle = "black";
      textColor = "white";
    } else {
      // Overdue and fulfilled
      backgroundStyle =
        categoryColors.length === 1
          ? categoryColors[0] // Use solid color for a single category
          : `linear-gradient(to bottom, ${categoryColors.join(", ")})`; // Gradient for multiple
      textColor = "gray";
      eventOpacity = 0.5; // Reduce opacity for fulfilled overdue tasks
    }
  } else {
    let darkershade = darkenHex(categoryColors[0], 0.75);
    // Not overdue: Solid or gradient color
    backgroundStyle =
      categoryColors.length === 1
        ? `linear-gradient(to bottom, ${categoryColors[0]}, ${darkershade})`
        : `linear-gradient(to bottom, ${categoryColors.join(", ")})`; // Multiple categories: gradient
  }

  // Calculate extension height
  const extensionHeight = (event.extension / 60) * gridSlotHeight; // Convert minutes to pixels
  const extensionStyle = {
    height: `${extensionHeight}px`,
    backgroundColor: event.unfulfilledExtension ? "black" : darkenHex(getEventColor(event.category[0]),0.4),
    opacity: event.unfulfilledExtension ? 1 : 0.5,
    borderTop: "2px solid white",
    position: "absolute",
    left: `0px`,
    right: `0px`,
    bottom: 0, // Align the extension to the bottom of the event
    borderRadius: "0 0 0px 0px",
  };

  return (
    <div
      className="event"
      style={{
        background: backgroundStyle,
        color: textColor,
        height: `${(duration / 60) * gridSlotHeight + extensionHeight}px`, // Include extension height
        top: `${(startMinute / 60) * gridSlotHeight}px`,
        position: "absolute",
        left: `${padding}px`,
        right: `${padding}px`,
        zIndex: 1,
        cursor: "pointer",
        opacity: eventOpacity,
        border: `3px solid ${darkenHex(categoryColors[0])}`,
      }}
      onClick={() => onEventClick(event.id)}
    >
      {(!event.fulfilled && !isTaskOverdue(event.date, event.endTime)) && ( <div id="event-shine"></div>)}
      <span className="event-title"><b>{event.title}</b></span>
      <br />
      <div className="footnotes" id="onhover">
        [{event.startTime} - {event.endTime}]
      </div>
      <span className="footnotes" id="event-duration">
        <b>{durationconv(duration)}</b>
      </span>
      <br />
      <div className="footnotes">
        <b>{event.location}</b>
      </div>
      <div className="footnotes" id="onhover">
        {event.people}
      </div>
      <div className="footnotes" id="onhover">
        <u>{event.category.join(" | ")}</u>
      </div>
      {event.notes && <div className="footnotes" id="notes">{event.notes}</div>}
      {!event.fulfilled && (
        <div className="event-reason" style={{ color: "red", marginTop: "5px" }}>
          {event.reason}
        </div>
      )}
      {(!event.fulfilled && !isTaskOverdue(event.date, event.endTime)) && (
        <div id="event-shadow"></div>
      )}

      {/* Render the extension block */}
      {event.extension > 0 && (
        <div className="event-extension" style={extensionStyle}></div>
      )}
    </div>
  );
};

export default Event;