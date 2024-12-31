import { collection, getDocs, doc, updateDoc, getDoc} from "firebase/firestore";
import { db } from "../firebase";

// Fetch categories from Firestore
export const fetchCategories = async () => {
  const snapshot = await getDocs(collection(db, "Categories"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Fetch events from Firestore
export const fetchEvents = async () => {
  const snapshot = await getDocs(collection(db, "Events"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update event position in Firestore
export const updateEventPosition = async (event) => {
  const eventRef = doc(db, "Events", event.id);
  await updateDoc(eventRef, {
    startTime: event.startTime, // Update the new startTime
  });
};

export const fetchEventById = async (eventId) => {
  const eventRef = doc(db, "Events", eventId);
  const snapshot = await getDoc(eventRef);

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() }; // Return event data
  } else {
    console.error("No such event!");
    return null;
  }
};

export const updateEvent = async (updatedEventData) => {
  const eventRef = doc(db, "Events", updatedEventData.id); // Use the event's ID
  await updateDoc(eventRef, updatedEventData); // Update Firestore with the new data
};

