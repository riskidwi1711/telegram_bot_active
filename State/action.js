function setQuestion(chatId, data) {
  return {
    type: "INIT",
    chatId,
    data,
  };
}
function setStep(chatId, data) {
  return {
    type: "SETSTEP",
    chatId,
    data,
  };
}

module.exports = {
  setQuestion,setStep
};
