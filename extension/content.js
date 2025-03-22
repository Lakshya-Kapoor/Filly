let selectedField = null;

// Add event listeners to all form fields
document.addEventListener("mouseover", (event) => {
  let field = event.target;
  //   if (field.matches("input, textarea, select")) {
  field.style.outline = "2px solid blue"; // Highlight field
  //   }
});

document.addEventListener("mouseout", (event) => {
  let field = event.target;
  if (field.matches("input, textarea, select")) {
    field.style.outline = ""; // Remove highlight
  }
});

document.addEventListener("click", (event) => {
  let field = event.target;
  if (field.matches("input, textarea, select")) {
    event.preventDefault(); // Prevent unwanted clicks
    selectedField = field;
    field.style.outline = "2px solid red"; // Indicate selection

    // Send field details to background/popup
    chrome.runtime.sendMessage({
      action: "FIELD_SELECTED",
      fieldType: field.type,
      fieldName: field.name || field.id || "Unnamed Field",
    });
  }
});
