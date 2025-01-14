import * as XLSX from "xlsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path to your Firebase setup

export const exportWeeklyEventsToExcel = async (weekDates) => {
  try {
    // Fetch all events from Firestore
    const colRef = collection(db, "Events");
    const snapshot = await getDocs(colRef);

    // Get all events as an array
    const allEvents = snapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID if necessary
      ...doc.data(),
    }));

    // Extract the start and end dates for the week
    const weekStart = new Date(weekDates[0].date); // First day of the 8-day week
    const weekEnd = new Date(weekDates[weekDates.length - 1].date); // Last day of the 8-day week

    // Filter events for the specified week
    const weeklyEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.date); // Ensure your event object has a `date` field
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    if (weeklyEvents.length === 0) {
      alert("No events found for the current week.");
      return;
    }

    // Convert filtered events to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(weeklyEvents);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Events");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, `weekly-events-${Date.now()}.xlsx`);
    alert("Weekly events exported successfully!");
  } catch (error) {
    console.error("Error exporting weekly events:", error);
    alert("An error occurred while exporting events.");
  }
};