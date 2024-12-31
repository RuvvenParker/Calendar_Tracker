import React, { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path to your Firebase configuration

const CategoryManager = () => {
  // State for categories and form data
  const [formData, setFormData] = useState({
    categoryName: "",
    color: "#000000",
  });
  const [categories, setCategories] = useState([]); // List of categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Category to delete

  // Fetch categories from Firestore on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const colRef = collection(db, "Categories");
        const snapshot = await getDocs(colRef);
        const fetchedCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const colRef = collection(db, "Categories");
      await addDoc(colRef, {
        Category: formData.categoryName,
        Color: formData.color,
      });
      alert("Category added successfully!");
      setFormData({ categoryName: "", color: "#000000" }); // Reset form
      // Refresh categories
      const snapshot = await getDocs(collection(db, "Categories"));
      const refreshedCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(refreshedCategories);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a category to delete.");
      return;
    }

    try {
      const docRef = doc(db, "Categories", selectedCategory);
      await deleteDoc(docRef);
      alert("Category deleted successfully!");
      setSelectedCategory(""); // Reset selected category
      // Refresh categories
      const snapshot = await getDocs(collection(db, "Categories"));
      const refreshedCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(refreshedCategories);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div id="event_control" className="category-manager">
      <h3>Manage Categories</h3>

      {/* Add Category Form */}
      <form  onSubmit={handleAddCategory} className="add-category-form">
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="color">Pick a Color</label>
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Category</button>
      </form>

      {/* Delete Category Form */}
      <form onSubmit={handleDeleteCategory} className="delete-category-form">
        <div className="form-group">
          <label htmlFor="deleteCategory">Delete Category</label>
          <select
            id="deleteCategory"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.Category}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Delete Category</button>
      </form>
    </div>
  );
};

export default CategoryManager;
