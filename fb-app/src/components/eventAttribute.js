import React from "react";

const AttrForm = ({ attr, type, required, categories }) => {
  const words = attr.split(/(?=[A-Z])/); // Split camelCase
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  const label = capitalizedWords.join(" ");

  return (
    <div className="form-group">
      <label htmlFor={attr}>{label}</label>
      {categories ? (
        // Render dropdown for category field
        <select name={attr} required={required}>
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.Category}>
              {category.Category}
            </option>
          ))}
        </select>
      ) : (
        // Render input for other fields
        <input type={type} name={attr} required={required} />
      )}
    </div>
  );
};

export default AttrForm;


export const darkenHex = (hex, factor = 0.8) => {
    // Ensure the hex starts with '#' and remove it for processing
    hex = hex.replace(/^#/, "");
  
    // Convert short hex (e.g., #abc) to full hex (e.g., #aabbcc)
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
  
    // Validate hex format
    if (hex.length !== 6) {
      throw new Error("Invalid hex color format.");
    }
  
    // Convert hex to RGB components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Apply darkening factor and clamp to 0–255
    const darken = (value) => Math.max(0, Math.round(value * factor));
  
    // Convert darkened values back to hex
    const toHex = (value) => value.toString(16).padStart(2, "0");
  
    // Return the new hex color
    return `#${toHex(darken(r))}${toHex(darken(g))}${toHex(darken(b))}`;
  };

  