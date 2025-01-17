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
    if(minutes> 0 && hours > 1){return `${hours}h ${minutes}m`}
    else if((minutes> 0) && (hours < 1)) {return `${minutes}m`}
    else{return `${hours}h`};
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

  if (event.priority === "1" && !event.fulfilled) {
    // Priority 1, not fulfilled
    backgroundStyle = "red";
    textColor = "white";
  } else if (isTaskOverdue(event.date, event.endTime)) {
    // Handle overdue tasks
    if (!event.fulfilled) {
      backgroundStyle = "black";
      textColor = "white";
    } else {
      backgroundStyle =
        categoryColors.length === 1
          ? categoryColors[0]
          : `linear-gradient(to bottom, ${categoryColors.join(", ")})`;
      textColor = "gray";
      eventOpacity = 0.5;
    }
  } else {
    let darkershade = darkenHex(categoryColors[0], 0.75);
    backgroundStyle =
      categoryColors.length === 1
        ? `linear-gradient(to bottom, ${categoryColors[0]}, ${darkershade})`
        : `linear-gradient(to bottom, ${categoryColors.join(", ")})`;
  }



  // const bordercol= `linear-gradient(to bottom, ${categoryColors.map(darkenHex).join(", ")})`;

  return (
    <div
      className="event"
      style={{
        background: backgroundStyle,
        color: textColor,
        height: `${(duration / 60) * gridSlotHeight}px`,
        top: `${(startMinute / 60) * gridSlotHeight}px`,
        position: "absolute",
        left: `${padding}px`,
        right: `${padding}px`,
        zIndex: 1,
        cursor: "pointer",
        opacity: eventOpacity,
        border: `3px solid ${darkenHex(categoryColors[0])}`
      }}
      onClick={() => onEventClick(event.id)}
    >
      {(!event.fulfilled && !isTaskOverdue(event.date, event.endTime)) && ( <div id="event-shine"></div>)}
      <span className="event-title"><b>{event.title}</b></span>
      <br/> 
      <div class="footnotes" id="onhover">[{event.startTime} - {event.endTime}]</div>
      <span class="footnotes" id="event-duration"><b>{durationconv(duration)}</b></span>
      <br />
      <div class="footnotes"><b>{event.location}</b></div>
      {/* <hr style={{ color: "black" }} id="breakline" /> */}
      <div class="footnotes" id="onhover">{event.people}</div>
      <div class="footnotes" id="onhover"><u>{event.category.join(" | ")}</u></div>
      {event.notes && <div class="footnotes" id="notes">{event.notes}</div>}
      {!event.fulfilled && (
        <div className="event-reason" style={{ color: "red", marginTop: "5px" }}>
          {event.reason}
        </div>
      )}
      {(!event.fulfilled && !isTaskOverdue(event.date, event.endTime)) && ( <div id="event-shadow"></div>)}
    </div>
  );
};

export default Event;
