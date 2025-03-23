function sendMessageToBackground(message) {
  if (message.type == "gotQuestion") {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("click", handleClick);
  }

  chrome.runtime.sendMessage(message);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type == "getQuestion") {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
  }
});

function handleMouseMove(event) {
  const element = document.elementFromPoint(event.clientX, event.clientY);

  const highlightedElement = document.getElementById("highlight");
  if (highlightedElement) {
    highlightedElement.id = "";
  }

  if (element) {
    element.id = "highlight";
  }
}

function handleClick(event) {
  const highlightedElement = document.getElementById("highlight");

  if (highlightedElement) {
    clickedText = highlightedElement.textContent.trim();
    console.log("Clicked Text:", clickedText);
  }
}
