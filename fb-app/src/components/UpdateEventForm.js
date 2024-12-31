import React, { useState, useEffect } from "react";
import { updateEvent } from "../utils/fetchData";
import { fetchCategories } from "../utils/fetchData";
import { documentId } from "firebase/firestore";

const UpdateEventForm = ({ initialFormData }) => {
  const initialState = {
    title: "",
    category: [],
    date: "", // Add date field
    startTime: "",
    endTime: "",
    location: "",
    fulfilled: false,
    reason: "",
    notes:""
  };

  const [formData, setFormData] = useState(initialState);
  const [categories, setCategories] = useState([]); // Fetch categories

  // Populate form when initialFormData changes
  useEffect(() => {
    if (initialFormData) {
      setFormData({ ...initialState, ...initialFormData });
    }
  }, [initialFormData]);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "category") {
      setFormData((prevData) => ({
        ...prevData,
        category: checked
          ? [...prevData.category, value]
          : prevData.category.filter((cat) => cat !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(formData); // Submit updated data
      setFormData(initialState); // Reset the form
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  return (
    <form id="event_control" onSubmit={handleSubmit}>
      <h3>Update Event</h3>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date" // Render as a date picker
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Categories</label>
        {categories.map((cat) => (
          <div key={cat.id}>
            <input
              type="checkbox"
              id={cat.Category}
              name="category"
              value={cat.Category}
              checked={formData.category.includes(cat.Category)}
              onChange={handleChange}
            />
            <label htmlFor={cat.Category}>{cat.Category}</label>
          </div>
        ))}
      </div>

      <div className="form-group">
        <label htmlFor="startTime"></label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="endTime">-</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="people">People</label>
        <input
          type="text"
          id="people"
          name="people"
          value={formData.people}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <input
          type="textarea"
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="fulfilled">Fulfilled</label>
        <input
          type="checkbox"
          id="fulfilled"
          name="fulfilled"
          checked={formData.fulfilled}
          onChange={handleChange}
        />
      </div>

      {!formData.fulfilled && (
        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <input
            type="text"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          />
        </div>
      )}
      <div>
        <label className="form-group">Id: {formData.id}</label>

      </div>


      <button type="submit">Update Event</button>
    </form>
  );
};

export default UpdateEventForm;

