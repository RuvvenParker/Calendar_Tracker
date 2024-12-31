import React, { useState, useEffect } from "react";
import "./App.css";
import { attributes, types } from "./config/formConfig";
import { generateFormComponents } from "./utils/AddFormGenerator";
import { handleDelete } from "./utils/handleEvent";
import UpdateEventForm from "./components/UpdateEventForm";
import Calendar from "./components/Calendar";
import { fetchCategories } from "./utils/fetchData";
import CategoryManager from "./components/categoriesForm";
import PriorityTable from "./components/priorityTable";
import html2canvas from "html2canvas";

// Import Firebase functions
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // Adjust path based on your project structure

const generateWeekDates = (startDate) => {
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startDate.getDate() - startDate.getDay());

  return Array.from({ length: 8 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const displayDate = day.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    }).replace(",", "");

    const internalDate = day.toISOString().split("T")[0];

    return {
      dayName: day.toLocaleDateString("en-US", { weekday: "long" }),
      date: internalDate,
      displayDate: displayDate,
    };
  });
};

function App() {
  const [initialFormData, setInitialFormData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekDates, setWeekDates] = useState(generateWeekDates(new Date()));
  const [selectedDateTime, setSelectedDateTime] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDateTime.startTime && !selectedDateTime.manualEndTime) {
      const [hour, minute] = selectedDateTime.startTime.split(":").map(Number);
      const newEndTime = `${String(hour + 1).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;
  
      setSelectedDateTime((prev) => ({
        ...prev,
        endTime: prev.manualEndTime ? prev.endTime : newEndTime,
      }));
    }
    // Include `selectedDateTime` safely in dependencies
  }, [selectedDateTime.startTime, selectedDateTime.manualEndTime]);
  
  
  const handleDateTimeChange = (field, value) => {
    setSelectedDateTime((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "startTime" && !prev.manualEndTime
        ? {
            endTime: `${String(Number(value.split(":")[0]) + 1).padStart(2, "0")}:${value.split(":")[1]}`,
          }
        : {}),
    }));
  };
  

  const handleEndTimeChange = (newEndTime) => {
    setSelectedDateTime((prev) => ({
      ...prev,
      endTime: newEndTime,
      manualEndTime: true,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = {};
    const categoriesSelected = Array.from(e.target.elements["category"] || [])
      .filter((input) => input.checked)
      .map((input) => input.value);

    if (categoriesSelected.length === 0) {
      setErrorMessage("Please select at least one category.");
      return;
    }

    attributes.forEach((attr, i) => {
      if (attr === "category") {
        formData[attr] = categoriesSelected;
      } else {
        formData[attr] = e.target[attr]?.value || "";
      }
    });

    try {
      const colRef = collection(db, "Events");
      await addDoc(colRef, formData);
      e.target.reset(); // Clear the form
      setErrorMessage(""); // Clear error message
    } catch (error) {
      console.error("Error adding event:", error);
      setErrorMessage("An error occurred while adding the event.");
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    if (direction === "previous") {
      newDate.setDate(currentWeekStart.getDate() - 7);
    } else if (direction === "next") {
      newDate.setDate(currentWeekStart.getDate() + 7);
    } else if (direction === "today") {
      newDate.setTime(Date.now());
    }
    setCurrentWeekStart(newDate);
    setWeekDates(generateWeekDates(newDate));
  };

  const populateForm = (eventData) => {
    setInitialFormData(eventData);
  };

  const exportCalendar = () => {
    const calendarElement = document.getElementById("calendar-container");
    if (!calendarElement) return;

    html2canvas(calendarElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = `calendar-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="navigation-buttons">
        <button onClick={() => navigateWeek("previous")}>&lt;</button>
        <button onClick={() => navigateWeek("today")}>Today</button>
        <button onClick={() => navigateWeek("next")}>&gt;</button>
      </div>
      <PriorityTable weekDates={weekDates} categories={categories} />
      <Calendar
  weekDates={weekDates}
  populateForm={populateForm}
  setSelectedDateTime={setSelectedDateTime}
  selectedDateTime={selectedDateTime} // Add this line
/>


      <button id="export-cal" onClick={exportCalendar}>
        Export Calendar as Image
      </button>
      <div className="form-container">
        <div className="left-form">
        <form
  className="add"
  id="event_control"
  onSubmit={(e) => handleAdd(e)}
>
  <h3>Create an Event</h3>
  {generateFormComponents(
    attributes,
    types,
    categories,
    selectedDateTime,
    handleDateTimeChange
  )}
  {errorMessage && <div className="error-message">{errorMessage}</div>}
  <button type="submit">Add Event</button>
</form>

        <form
          className="delete"
          id="event_control"
          onSubmit={(e) => handleDelete(e)}
        >
          <h3>Delete an Event</h3>
          <label htmlFor="docref">Event Reference ID:</label>
          <input type="text" name="docId" />
          <button type="submit">Delete Event</button>
        </form>
        </div>
        <div className="right-form">
        <UpdateEventForm
          id="updateEventForm"
          initialFormData={initialFormData}
        />
        </div>
        <CategoryManager />
      </div>
    </div>
  );
}

export default App;
