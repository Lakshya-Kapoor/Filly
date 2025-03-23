let FILL = false;

// Elements
let fillButton = document.getElementById("fill");
let clearButton = document.getElementById("clear");
let selectDiv = document.getElementById("select");

// Event listeners
fillButton.addEventListener("click", () => {
  FILL = true;
  fillButton.classList.add("hidden");
  clearButton.classList.remove("hidden");
  Select.startCycle();
});

clearButton.addEventListener("click", () => {
  FILL = false;
  fillButton.classList.remove("hidden");
  clearButton.classList.add("hidden");
  Select.stopCycle();
});

// Functions
function selectElement(name) {
  return `
    <div class="select-element">
        <h3>Select ${name}</h3>
        <div class="loader"></div>
    </div>
`;
}

class Select {
  static state = "stopped";
  static question = null;
  static answerField = null;

  static getQuestion() {
    sendMessageToBackground({ type: "getQuestion" });
    selectDiv.innerHTML = selectElement("Question");
  }

  static setQuestion(question) {
    Select.question = question;
  }

  static getAnswerField() {
    sendMessageToBackground({ type: "getAnswerField" });
  }

  static setAnswerField(answerField) {
    Select.answerField = answerField;
  }

  static getAIAnswer() {
    sendMessageToBackground({
      type: "getAIAnswer",
      question: Select.question,
    });
  }

  static async startCycle() {
    Select.state = "getQuestion";
    Select.getQuestion();
    await waitFor(() => Select.state == "gotQuestion");
    if (Select.state == "stopped") return;

    Select.state = "getAnswerField";
    Select.getAnswerField();
    await waitFor(() => Select.state == "gotAnswerField");
    if (Select.state == "stopped") return;

    Select.state = "getAnswer";
  }

  static async stopCycle() {
    Select.state = "stopped";
    selectDiv.innerHTML = "";
  }

  static setState(state) {
    Select.state = state;
  }
}

async function waitFor(checkFn) {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (checkFn() || Select.state == "stopped") {
        clearInterval(intervalId);
        resolve();
      }
    }, 500);
  });
}

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type == "gotQuestion") {
    Select.setState("gotQuestion");
    Select.setQuestion(message.question);
  }

  if (message.type == "gotAnswerField") {
    Select.setState("gotAnswerField");
    Select.setAnswerField(message.answerField);
  }
});
