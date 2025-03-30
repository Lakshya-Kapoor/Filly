function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type == "gotQuestion") {
    handleGotQuestion(message);
  }

  if (message.type == "gotAnswerField") {
    handleGotAnswerField();
  }

  if (message.type == "gotAnswer") {
    console.log("Got answer");
    handleGotAnswer(message);
  }
});

// State variables
let state = "default";

// DOM elements
const answerButton = document.getElementById("answer-button");
const clearButton = document.getElementById("clear-button");
const selectContainer = document.getElementById("select-container");
const contextContainer = document.getElementById("context-container");
const generateButton = document.getElementById("generate-button");
const generatingContainer = document.getElementById("generating-container");
const answerContainer = document.getElementById("answer-container");
const regenerateButton = document.getElementById("regenerate-button");
const fillButton = document.getElementById("fill-button");

// Event listeners
answerButton.addEventListener("click", handleAnswerButtonClick);
clearButton.addEventListener("click", handleClearButtonClick);
generateButton.addEventListener("click", handleGenerateButtonClick);
regenerateButton.addEventListener("click", handleGenerateButtonClick);
fillButton.addEventListener("click", handleFillAnswer);

function handleFillAnswer() {
  const answer = answerContainer.querySelector("textarea").value;
  sendMessageToBackground({ type: "setAnswerField", answer: answer });
}

function handleGotAnswer(message) {
  generatingContainer.style.display = "none";
  answerContainer.style.display = "flex";
  answerContainer.querySelector("textarea").value = message.answer;
  regenerateButton.style.display = "block";
  fillButton.style.display = "block";
}

function handleGenerateButtonClick() {
  generateButton.style.display = "none";
  regenerateButton.style.display = "none";
  fillButton.style.display = "none";
  generatingContainer.style.display = "flex";
  answerContainer.style.display = "none";

  const question = document.querySelector("#question-container textarea").value;
  const context = contextContainer.querySelector("textarea").value;
  sendMessageToBackground({ type: "generateAnswer", question, context });
}

// handlerFunctions
function handleAnswerButtonClick() {
  answerButton.style.display = "none";
  clearButton.style.display = "block";
  selectContainer.style.display = "flex";
  handleGetQuestion();
}

function handleClearButtonClick() {
  sendMessageToBackground({ type: "clearSelection" });
  answerButton.style.display = "block";
  clearButton.style.display = "none";
  selectContainer.style.display = "none";
  selectContainer.innerHTML = "";
  generatingContainer.style.display = "none";
  generateButton.style.display = "none";
  contextContainer.style.display = "none";
  answerContainer.style.display = "none";
  fillButton.style.display = "none";
  regenerateButton.style.display = "none";
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.value = "";
  });
}

function handleGetQuestion() {
  sendMessageToBackground({ type: "getQuestion" });
  selectContainer.innerHTML = `
    <div class="loading-container">
      <span>Click on question</span>
      <div class="loader"></div>
    </div>
  `;
}

function handleGotQuestion(message) {
  sendMessageToBackground({ type: "getAnswerField" });
  selectContainer.innerHTML = `
    <div id="question-container">
      <p>Question:</p>
      <textarea>${message.question}</textarea>
    </div>
    <div class="loading-container">
      <span>Click on input box</span>
      <div class="loader"></div>
    </div>
  `;
}

function handleGotAnswerField() {
  selectContainer.querySelector(".loading-container").remove();
  contextContainer.style.display = "flex";
  generateButton.style.display = "block";
}
