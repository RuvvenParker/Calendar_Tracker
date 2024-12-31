import React, { useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming firebase.js is in the `src` folder

const AddEventForm = () => {
  const [formData, setFormData] = useState({ title: '', category: '' });
  const colRef = collection(db, 'Events'); // Firestore collection reference
  // const [events, setEvents] = useState([]);
  // const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(colRef, formData);
      alert('Event added successfully!');
      setFormData({ title: '', category: '' });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="add">
      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={formData.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Event Category"
        value={formData.category}
        onChange={handleChange}
      />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default AddEventForm;
