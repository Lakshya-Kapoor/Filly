// Send messages to the background script
function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type == "getQuestion") {
    handleGetQuestion();
  } else if (message.type == "getAnswerField") {
    handleGetAnswerField();
  } else if (message.type == "clearSelection") {
    handleClearSelection();
  } else if (message.type == "setAnswerField") {
    handleSetAnswerField(message);
  }
});

function handleSetAnswerField(message) {
  const answerField = document.getElementById("highlight");
  if (answerField) {
    answerField.value = message.answer;
  }
}

function handleClearSelection() {
  const highlightedElement = document.getElementById("highlight");
  if (highlightedElement) {
    highlightedElement.id = "";
  }
}

function handleGetAnswerField() {
  document.addEventListener("mousemove", highlightElements);
  document.addEventListener("click", selectInputElement);
}

function handleGotAnswerField() {
  document.removeEventListener("mousemove", highlightElements);
  document.removeEventListener("click", selectInputElement);
  sendMessageToBackground({ type: "gotAnswerField" });
}

function handleGotQuestion(question) {
  document.removeEventListener("mousemove", highlightElements);
  document.removeEventListener("click", selectQuestion);
  sendMessageToBackground({ type: "gotQuestion", question: question });
}

function handleGetQuestion() {
  document.addEventListener("mousemove", highlightElements);
  document.addEventListener("click", selectQuestion);
}

function highlightElements(event) {
  const element = document.elementFromPoint(event.clientX, event.clientY);

  const highlightedElement = document.getElementById("highlight");
  if (highlightedElement) {
    highlightedElement.id = "";
  }

  if (element) {
    element.id = "highlight";
  }
}

function selectQuestion(event) {
  const highlightedElement = document.getElementById("highlight");

  if (highlightedElement) {
    highlightedElement.id = "";
    clickedText = highlightedElement.textContent.trim();
    handleGotQuestion(clickedText);
  }
}

function selectInputElement(event) {
  const highlightedElement = document.getElementById("highlight");

  if (
    highlightedElement &&
    (highlightedElement.tagName === "INPUT" ||
      highlightedElement.tagName === "TEXTAREA" ||
      highlightedElement.isContentEditable)
  ) {
    handleGotAnswerField();
  }
}
