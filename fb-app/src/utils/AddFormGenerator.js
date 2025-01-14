import React from "react";
import "./AddFormGenerator.css";
import { labels } from "../config/formConfig";

export const generateFormComponents = (
  attributes,
  types,
  categories,
  selectedDateTime = {},
  handleDateTimeChange
) => {
  return attributes.map((attribute, index) => {
    const defaultValue = selectedDateTime[attribute] || ""; // Default value from state

    if (attribute === "category") {
      return (
        <div key={attribute}>
          <label>{labels[index]}</label>
          <div>
            {categories.map((cat) => (
              <div key={cat.Category}>
                <input
                  type="checkbox"
                  id={`category-${cat.Category}`}
                  name={attribute}
                  value={cat.Category}
                />
                <label htmlFor={`category-${cat.Category}`}>
                  {cat.Category}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (attribute === "date" || attribute === "startTime" || attribute === "endTime") {
      return (
        <div key={attribute}>
          <label htmlFor={attribute}>{labels[index]}</label>
          <input
            type={attribute === "date" ? "date" : "time"}
            id={attribute}
            name={attribute}
            value={defaultValue}
            onChange={(e) => handleDateTimeChange(attribute, e.target.value)}
          />
        </div>
      );
    } else if (types[index] === "textarea") {
      return (
        <div key={attribute}>
          <label htmlFor={attribute}>{labels[index]}</label>
          <textarea
            id={attribute}
            name={attribute}
            rows="2"
            defaultValue={defaultValue}
          ></textarea>
        </div>
      );
    } else if(attribute == "repeatInterval") {
      return (
        <div key={attribute}>
          <label htmlFor={attribute}>{labels[index]}</label>
          <input
            type={types[index]}
            id={attribute}
            name={attribute}
            defaultValue="1"
          />
        </div>)
    }
      else {
      return (
        <div key={attribute}>
          <label htmlFor={attribute}>{labels[index]}</label>
          <input
            type={types[index]}
            id={attribute}
            name={attribute}
            defaultValue={defaultValue}
          />
        </div>
      );
    }
  });
};
