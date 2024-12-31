import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./priorityTable.css";

const PriorityTable = ({ weekDates, categories }) => {
  const [priorityData, setPriorityData] = useState({});
  const [droppedTasks, setDroppedTasks] = useState({});

  // Fetch tasks for the selected week
  const fetchTasksForWeek = async () => {
    const colRef = collection(db, "Events");
    onSnapshot(colRef, (snapshot) => {
      const weekTasks = {};
      snapshot.docs.forEach((doc) => {
        const event = doc.data();
        const eventDate = event.date;

        // Check if the event date falls within the current week
        if (weekDates.some((date) => date.date === eventDate)) {
          const eventCategory = Array.isArray(event.category)
            ? event.category[0]
            : event.category; // Take the first category

          if (!weekTasks[eventCategory]) {
            weekTasks[eventCategory] = [];
          }

          weekTasks[eventCategory].push({
            id: doc.id,
            title: event.title,
            date: eventDate,
          });
        }
      });

      setPriorityData(weekTasks);
    });
  };

  // Fetch dropped tasks for the selected week from Firebase
  const fetchDroppedTasks = async () => {
    const colRef = collection(db, "PriorityTable");
    onSnapshot(colRef, (snapshot) => {
      const tasks = {};
      snapshot.docs.forEach((doc) => {
        tasks[doc.id] = doc.data().tasks || [];
      });
      setDroppedTasks(tasks);
    });
  };

  // Save dropped tasks to Firebase
  const saveDroppedTasks = async (date, tasks) => {
    const docRef = doc(db, "PriorityTable", date);
    await setDoc(docRef, { tasks }, { merge: true });
  };

  // Fetch data whenever weekDates change
  useEffect(() => {
    fetchTasksForWeek();
    fetchDroppedTasks();
  }, [weekDates]);

  // Handle Drag Start
  const handleDragStart = (event, task) => {
    event.dataTransfer.setData("task", JSON.stringify(task));
  };

  // Handle Drop
  const handleDrop = async (event, date, category) => {
    event.preventDefault();
    const task = JSON.parse(event.dataTransfer.getData("task")); // Parse the task data

    const updatedTasks = [
      ...(droppedTasks[date] || []),
      { ...task, category },
    ];

    // Update local state
    setDroppedTasks((prev) => ({
      ...prev,
      [date]: updatedTasks,
    }));

    // Save to Firebase
    await saveDroppedTasks(date, updatedTasks);
  };

  // Allow Drop
  const allowDrop = (event) => {
    event.preventDefault();
  };

  // Handle Task Deletion
  const handleDeleteTask = async (date, taskId) => {
    const updatedTasks = droppedTasks[date]?.filter((task) => task.id !== taskId);

    // Update local state
    setDroppedTasks((prev) => ({
      ...prev,
      [date]: updatedTasks,
    }));

    // Save to Firebase
    await saveDroppedTasks(date, updatedTasks);
  };

  // Get Category Color
  const getCategoryColor = (categoryName) => {
    const category = categories.find((cat) => cat.Category === categoryName);
    return category ? category.Color : "#ccc";
  };

  return (
    <div className="priority-table-container">
      <div className="table">
        {/* Table Header */}
        <div className="table-header">
          <div className="table-cell category-header">Category</div>
          <div className="table-cell tasks-header">Tasks</div>
          {weekDates.map(({ date }) => (
            <div key={date} className="table-cell date-header">
              {new Date(date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        {categories.map((category) => (
          <div key={category.Category} className="table-row">
            {/* Category Column */}
            <div
              className="table-cell category-cell"
              style={{ backgroundColor: getCategoryColor(category.Category) }}
            >
              {category.Category}
            </div>

            {/* Tasks Column */}
            <div className="table-cell tasks-cell">
              {priorityData[category.Category]?.map((task) => (
                <div
                  key={task.id}
                  className="task"
                  style={{
                    backgroundColor: getCategoryColor(category.Category),
                  }}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, { id: task.id, title: task.title })
                  }
                >
                  {task.title}
                </div>
              ))}
            </div>

            {/* Weekly Task Columns */}
            {weekDates.map(({ date }) => (
              <div
                key={`${category.Category}-${date}`}
                className="table-cell"
                onDragOver={allowDrop}
                onDrop={(e) => handleDrop(e, date, category.Category)}
              >
                {/* Render tasks for the specific day */}
                {droppedTasks[date]
                  ?.filter((task) => task.category === category.Category)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="task"
                      style={{
                        backgroundColor: getCategoryColor(category.Category),
                      }}
                    >
                      {task.title}
                      <div><button
                        onClick={() => handleDeleteTask(date, task.id)}
                        className="delete-button"
                      >
                        Delete
                      </button></div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityTable;
