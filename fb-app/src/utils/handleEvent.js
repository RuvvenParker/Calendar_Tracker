import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Your Firebase configuration

// Firestore collection reference
const colRef = collection(db, "Events");

// Event listener function for form submission (Add Event)
// export const handleAdd = async (e, attributes) => {
//   e.preventDefault(); // Prevent default form behavior

//   const formData = {};
//   for (let i = 0; i < attributes.length; i++) {
//     if (attributes[i] === "category") {
//       // Handle categories as multiple-choice checkboxes
//       formData[attributes[i]] = Array.from(e.target[attributes[i]])
//         .filter((input) => input.checked)
//         .map((input) => input.value); // Collect selected categories
//     } else {
//       formData[attributes[i]] = e.target[attributes[i]].value; // Extract values dynamically
//     }
//   }

//   // Add additional default fields
//   formData["fulfilled"] = e.target.fulfilled ? e.target.fulfilled.checked : false; // Checkbox for fulfilled
//   formData["reason"] = e.target.reason?.value || ""; // Optional reason for unfulfilled

//   // Add the form data to Firestore
//   try {
//     await addDoc(colRef, formData);
//     e.target.reset(); // Reset form after submission
//   } catch (error) {
//     console.error("Error adding event:", error);
//     alert("Failed to add event. Please try again.");
//   }
// };
export const handleAdd = async (e, attributes, setErrorMessage) => {
  e.preventDefault(); // Prevent form submission

  // Validate that at least one category is selected
  const categories = Array.from(e.target.elements["category"])
    .filter((input) => input.checked)
    .map((input) => input.value);

  if (categories.length === 0) {
    setErrorMessage("Please select at least one category.");
    return;
  }

  const formData = {};
  for (let i = 0; i < attributes.length; i++) {
    const attributeName = attributes[i];
    if (attributeName === "category") {
      formData[attributeName] = categories; // Save selected categories as an array
    } else {
      formData[attributeName] = e.target[attributeName].value;
    }
  }

  formData["fulfilled"] = "true";
  formData["reason"] = "";

  try {
    // Add the form data to Firestore
    const colRef = collection(db, "Events");
    await addDoc(colRef, formData);
    e.target.reset(); // Clear the form
    setErrorMessage(""); // Clear any previous error messages
  } catch (error) {
    console.error("Error adding event:", error);
    setErrorMessage("Error submitting the form. Please try again.");
  }
};


// Event listener function for deleting a document (Delete Event)
export const handleDelete = async (e) => {
  e.preventDefault();
  console.log(e.target.docId.value);

  const docRef = doc(db, "Events", e.target.docId.value);
  try {
    await deleteDoc(docRef);
    e.target.reset();
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("Failed to delete event. Please try again.");
  }
};
