// Toggles the sidepanel on clicking the action button
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

function sendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  });
}

function sendMessageToSidePanel(message) {
  chrome.runtime.sendMessage(message);
}

// Listens for messages from the sidepanel and content script
chrome.runtime.onMessage.addListener((message) => {
  if (
    message.type == "getQuestion" ||
    message.type == "getAnswerField" ||
    message.type == "setAnswerField"
  ) {
    sendMessageToContentScript(message);
  }

  if (message.type == "gotQuestion" || message.type == "gotAnswerField") {
    sendMessageToSidePanel(message);
  }

  // TODO: Call gemini API
  if (message.type == "getAIAnswer") {
    sendMessageToSidePanel({ type: "gotAIAnswer", answer: "Answer" });
  }
});
