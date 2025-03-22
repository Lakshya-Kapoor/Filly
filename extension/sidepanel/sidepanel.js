function selectElement(name) {
  return `
    <div class="select-element">
        <h3>Select ${name}</h3>
        <div class="loader"></div>
    </div>
`;
}

class SelectFields {
  constructor() {
    this.question = null;
    this.answerField = null;

    document.getElementById("select").innerHTML = selectElement("Question");
  }

  setQuestion(question) {
    this.question = question;
    document.getElementById("select").innerHTML = selectElement("Answer");
  }

  setAnswerField(answerField) {
    this.answerField = answerField;
  }
}

window.onload = () => {
  let instance = new SelectFields();
};
